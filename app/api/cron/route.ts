import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { readDocsFromFolders } from '@/lib/google-drive'
import { generateDigest } from '@/lib/claude'
import { sendDigestEmail } from '@/lib/email'
import { getUsersDueForDigest } from '@/lib/digest-scheduler'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(req: NextRequest) {
  // Accept secret via x-cron-secret header (external cron services)
  // or Authorization: Bearer header (Vercel built-in cron)
  const cronSecret = process.env.CRON_SECRET
  const headerSecret = req.headers.get('x-cron-secret')
  const authHeader = req.headers.get('authorization')
  const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (headerSecret !== cronSecret && bearerSecret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const due = await getUsersDueForDigest()

  console.log(`[cron] ${due.length} user(s) due`)

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
          console.log(`[cron] No docs found for ${user.email}`)
          return
        }

        // Fetch recent feedback to inform generation
        const { data: feedbackRows } = await supabaseAdmin
          .from('digests')
          .select('sent_at, feedback')
          .eq('user_id', setting.user_id)
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

        // Detect first digest
        const { count: digestCount } = await supabaseAdmin
          .from('digests')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', setting.user_id)

        const isFirstDigest = (digestCount ?? 0) === 0

        const { body, subject } = await generateDigest(
          docs,
          setting.personal_instructions || '',
          setting.onboarding_context || '',
          recentFeedback,
          isFirstDigest,
        )

        await sendDigestEmail({
          to: setting.delivery_email,
          subject,
          body,
          docNames: docs.map(d => d.name),
          today,
        })

        await supabaseAdmin.from('digests').insert({
          user_id: setting.user_id,
          subject,
          body_html: body,
          docs_read: docs.map(d => d.name),
          doc_count: docs.length,
          status: 'sent',
          source: 'scheduled',
        })

        console.log(`[cron] Digest sent to ${user.email}`)
      } catch (e) {
        console.error(`[cron] Digest failed for ${user.email}:`, e)

        await supabaseAdmin.from('digests').insert({
          user_id: setting.user_id,
          subject: `Dispatch · ${today}`,
          body_html: '',
          docs_read: [],
          doc_count: 0,
          status: 'failed',
          source: 'scheduled',
        })

        throw e
      }
    })
  )

  const succeeded = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  return NextResponse.json({ succeeded, failed, total: due.length })
}
