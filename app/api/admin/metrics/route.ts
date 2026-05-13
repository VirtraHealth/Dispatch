import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

function isAdmin(email: string) {
  return email === process.env.ADMIN_EMAIL
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // All users
  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id, subscription_status, trial_started_at, subscription_ended_at, created_at')

  const allUsers = users || []
  const activeUsers = allUsers.filter(u => u.subscription_status === 'active')
  const trialingUsers = allUsers.filter(u => u.subscription_status === 'trialing')
  const canceledUsers = allUsers.filter(u => u.subscription_status === 'canceled')
  const complimentaryUsers = allUsers.filter(u => u.subscription_status === 'complimentary')

  const totalUsers = allUsers.length
  const mrr = activeUsers.length * 4.99

  // Weekly Active Uploaders: users with a sent digest with doc_count > 0 in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: activeDigests } = await supabaseAdmin
    .from('digests')
    .select('user_id')
    .eq('status', 'sent')
    .gt('doc_count', 0)
    .gte('sent_at', sevenDaysAgo)

  const activeUploaderIds = new Set((activeDigests || []).map(d => d.user_id))
  const paidUserIds = new Set([...activeUsers, ...complimentaryUsers].map(u => u.id))
  const activeUploadersInPaid = Array.from(activeUploaderIds).filter(id => paidUserIds.has(id)).length
  const weeklyActiveUploaders = paidUserIds.size > 0
    ? (activeUploadersInPaid / paidUserIds.size) * 100
    : 0

  // Free → Paid Conversion: active / (active + trialing + recently canceled within 30d)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const recentCanceled = canceledUsers.filter(
    u => u.subscription_ended_at && u.subscription_ended_at > thirtyDaysAgo
  )
  const conversionDenominator = activeUsers.length + trialingUsers.length + recentCanceled.length
  const freeToPaidConversion = conversionDenominator > 0
    ? (activeUsers.length / conversionDenominator) * 100
    : 0

  // Monthly Churn: canceled this calendar month / active at month start
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const canceledThisMonth = canceledUsers.filter(
    u => u.subscription_ended_at && u.subscription_ended_at >= monthStart
  ).length
  // Approximate active at month start = current active + those who canceled this month
  const activeAtMonthStart = activeUsers.length + canceledThisMonth
  const monthlyChurn = activeAtMonthStart > 0
    ? (canceledThisMonth / activeAtMonthStart) * 100
    : 0

  // Day-7 Open Rate: users who opened email within 7 days of first digest
  const { data: firstDigests } = await supabaseAdmin
    .from('digests')
    .select('id, user_id, sent_at')
    .eq('status', 'sent')
    .order('sent_at', { ascending: true })

  // Get unique first digest per user
  const firstDigestByUser = new Map<string, { id: string; sent_at: string }>()
  for (const d of firstDigests || []) {
    if (!firstDigestByUser.has(d.user_id)) {
      firstDigestByUser.set(d.user_id, { id: d.id, sent_at: d.sent_at })
    }
  }

  const firstDigestIds = Array.from(firstDigestByUser.values()).map(d => d.id)
  let day7OpenRate = 0

  if (firstDigestIds.length > 0) {
    const { data: openEvents } = await supabaseAdmin
      .from('email_events')
      .select('digest_id, user_id, created_at')
      .eq('event_type', 'opened')
      .in('digest_id', firstDigestIds)

    const openedFirstDigestUserIds = new Set<string>()
    for (const evt of openEvents || []) {
      const firstDigest = firstDigestByUser.get(evt.user_id)
      if (!firstDigest) continue
      const sentAt = new Date(firstDigest.sent_at).getTime()
      const openedAt = new Date(evt.created_at).getTime()
      if (openedAt - sentAt <= 7 * 24 * 60 * 60 * 1000) {
        openedFirstDigestUserIds.add(evt.user_id)
      }
    }
    day7OpenRate = firstDigestIds.length > 0
      ? (openedFirstDigestUserIds.size / firstDigestIds.length) * 100
      : 0
  }

  // Cost Per Email: avg cost over last 30 days
  const { data: recentDigests } = await supabaseAdmin
    .from('digests')
    .select('input_tokens, output_tokens')
    .eq('status', 'sent')
    .gte('sent_at', thirtyDaysAgo)
    .not('input_tokens', 'is', null)

  let costPerEmail = 0
  if (recentDigests && recentDigests.length > 0) {
    const totalCost = recentDigests.reduce((sum, d) => {
      const inputCost = ((d.input_tokens || 0) / 1_000_000) * 3
      const outputCost = ((d.output_tokens || 0) / 1_000_000) * 15
      const emailCost = 0.0008
      return sum + inputCost + outputCost + emailCost
    }, 0)
    costPerEmail = totalCost / recentDigests.length
  }

  return NextResponse.json({
    totalUsers,
    mrr,
    byStatus: {
      active: activeUsers.length,
      trialing: trialingUsers.length,
      canceled: canceledUsers.length,
      complimentary: complimentaryUsers.length,
    },
    metrics: {
      day7OpenRate,
      weeklyActiveUploaders,
      freeToPaidConversion,
      monthlyChurn,
      costPerEmail,
    },
  })
}
