import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { readDocs } from '@/lib/google-drive'
import { getJournalEntriesDoc } from '@/lib/journal'
import { generateDigest } from '@/lib/claude'
import { sendDigestEmail, sendContextNudgeEmail } from '@/lib/email'
import { getUsersDueForDigest } from '@/lib/digest-scheduler'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (bearerSecret !== process.env.CRON_SECRET) {
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
        const docs = await readDocs(
          user.google_access_token,
          user.google_refresh_token,
          setting.folder_ids
        )

        const journalDoc = await getJournalEntriesDoc(setting.user_id)
        if (journalDoc) docs.unshift(journalDoc)

        if (!docs.length) {
          console.log(`[cron] No docs found for ${user.email}`)
          // Send a daily nudge until the user connects docs.
          // Dedup: skip if a nudge was already sent in the last 20 hours.
          const { data: priorNudges } = await supabaseAdmin
            .from('digests')
            .select('sent_at')
            .eq('user_id', setting.user_id)
            .eq('source', 'nudge')
            .order('sent_at', { ascending: false })

          const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
          const alreadySentToday = priorNudges?.[0] && priorNudges[0].sent_at >= twentyHoursAgo

          if (!alreadySentToday) {
            const nudgeNumber = (priorNudges?.length ?? 0) + 1
            await sendContextNudgeEmail({ to: setting.delivery_email, nudgeNumber })
            await supabaseAdmin.from('digests').insert({
              user_id: setting.user_id,
              subject: 'nudge_sent',
              body_html: '',
              docs_read: [],
              doc_count: 0,
              status: 'nudge',
              source: 'nudge',
            })
            console.log(`[cron] Context nudge #${nudgeNumber} sent to ${user.email}`)
          }
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

        // Detect first real digest (exclude nudge records)
        const { count: digestCount } = await supabaseAdmin
          .from('digests')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', setting.user_id)
          .eq('status', 'sent')

        const isFirstDigest = (digestCount ?? 0) === 0

        const { body, subject, inputTokens, outputTokens } = await generateDigest(
          docs,
          setting.personal_instructions || '',
          setting.onboarding_context || '',
          recentFeedback,
          isFirstDigest,
        )

        const { data: digest } = await supabaseAdmin.from('digests').insert({
          user_id: setting.user_id,
          subject,
          body_html: body,
          docs_read: docs.map(d => d.name),
          doc_count: docs.length,
          status: 'sent',
          source: 'scheduled',
          input_tokens: inputTokens,
          output_tokens: outputTokens,
        }).select().single()

        await sendDigestEmail({
          to: setting.delivery_email,
          subject,
          body,
          docNames: docs.map(d => d.name),
          today,
          digestId: digest?.id,
        })

        console.log(`[cron] Digest sent to ${user.email}`)
      } catch (e) {
        console.error(`[cron] Digest failed for ${user.email}:`, e)

        await supabaseAdmin.from('digests').insert({
          user_id: setting.user_id,
          subject: `My Daily Journal · ${today}`,
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
