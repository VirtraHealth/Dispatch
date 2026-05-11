import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { readDocsFromFolders } from '@/lib/google-drive'
import { generateDigest } from '@/lib/claude'
import { sendDigestEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, google_access_token, google_refresh_token')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: settings } = await supabaseAdmin
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!settings?.folder_ids?.length) {
    return NextResponse.json({ error: 'No folders configured' }, { status: 400 })
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  try {
    const docs = await readDocsFromFolders(
      user.google_access_token,
      user.google_refresh_token,
      settings.folder_ids
    )

    if (!docs.length) {
      return NextResponse.json({ error: 'No readable documents found in selected folders' }, { status: 400 })
    }

    const { body, subject } = await generateDigest(
      docs,
      settings.personal_instructions || '',
      settings.onboarding_context || ''
    )

    await sendDigestEmail({
      to: settings.delivery_email,
      subject,
      body,
      docNames: docs.map(d => d.name),
      today,
      accessToken: user.google_access_token,
      refreshToken: user.google_refresh_token,
    })

    const { data: digest } = await supabaseAdmin
      .from('digests')
      .insert({
        user_id: user.id,
        subject,
        body_html: body,
        docs_read: docs.map(d => d.name),
        doc_count: docs.length,
        status: 'sent',
      })
      .select()
      .single()

    return NextResponse.json({ success: true, digest })
  } catch (e) {
    console.error('Digest generation failed:', e)
    return NextResponse.json({ error: 'Failed to generate digest' }, { status: 500 })
  }
}
