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

  // Enforce 4 instant digests per rolling 7-day window
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: instantCount } = await supabaseAdmin
    .from('digests')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('source', 'instant')
    .gte('sent_at', sevenDaysAgo)

  if ((instantCount ?? 0) >= 4) {
    return NextResponse.json({ error: 'Weekly instant digest limit reached (4 per week)' }, { status: 429 })
  }

  try {
    const docs = await readDocsFromFolders(
      user.google_access_token,
      user.google_refresh_token,
      settings.folder_ids
    )

    if (!docs.length) {
      return NextResponse.json({ error: 'No readable documents found in selected folders' }, { status: 400 })
    }

    // Check if this is the user's first digest
    const { count: digestCount } = await supabaseAdmin
      .from('digests')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const isFirstDigest = (digestCount ?? 0) === 0

    // Collect recent non-"perfect" feedback to inform this generation
    const { data: feedbackRows } = await supabaseAdmin
      .from('digests')
      .select('sent_at, feedback')
      .eq('user_id', user.id)
      .not('feedback', 'is', null)
      .neq('feedback', 'perfect')
      .order('sent_at', { ascending: false })
      .limit(3)

    const recentFeedback = (feedbackRows || [])
      .filter(d => d.feedback)
      .map(d => {
        const date = new Date(d.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        return `- ${date}: "${d.feedback}"`
      })
      .join('\n')

    const { body, subject } = await generateDigest(
      docs,
      settings.personal_instructions || '',
      settings.onboarding_context || '',
      recentFeedback,
      isFirstDigest,
    )

    await sendDigestEmail({
      to: settings.delivery_email,
      subject,
      body,
      docNames: docs.map(d => d.name),
      today,
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
        source: 'instant',
      })
      .select()
      .single()

    return NextResponse.json({ success: true, digest })
  } catch (e) {
    console.error('Digest generation failed:', e)
    return NextResponse.json({ error: 'Failed to generate digest' }, { status: 500 })
  }
}
