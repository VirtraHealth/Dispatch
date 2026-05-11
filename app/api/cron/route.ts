import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { readDocsFromFolders } from '@/lib/google-drive'
import { generateDigest } from '@/lib/claude'
import { sendDigestEmail } from '@/lib/email'
import { getUsersDueForDigest } from '@/lib/digest-scheduler'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const currentUtcHour = new Date().getUTCHours()
  const due = await getUsersDueForDigest(currentUtcHour)

  const results = await Promise.allSettled(
    due.map(async setting => {
      const user = setting.users
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
          setting.folder_ids
        )

        if (!docs.length) {
          console.log(`No docs found for ${user.email}`)
          return
        }

        const { body, subject } = await generateDigest(
          docs,
          setting.personal_instructions || '',
          setting.onboarding_context || ''
        )

        await sendDigestEmail({
          to: setting.delivery_email,
          subject,
          body,
          docNames: docs.map(d => d.name),
          today,
          accessToken: user.google_access_token,
          refreshToken: user.google_refresh_token,
        })

        await supabaseAdmin.from('digests').insert({
          user_id: setting.user_id,
          subject,
          body_html: body,
          docs_read: docs.map(d => d.name),
          doc_count: docs.length,
          status: 'sent',
        })

        console.log(`Digest sent to ${user.email}`)
      } catch (e) {
        console.error(`Digest failed for ${user.email}:`, e)

        await supabaseAdmin.from('digests').insert({
          user_id: setting.user_id,
          subject: `Dispatch · ${today}`,
          body_html: '',
          docs_read: [],
          doc_count: 0,
          status: 'failed',
        })

        throw e
      }
    })
  )

  const succeeded = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  return NextResponse.json({ succeeded, failed, total: due.length })
}
