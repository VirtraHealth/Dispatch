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

  const [{ data: users }, { data: digestStats }] = await Promise.all([
    supabaseAdmin
      .from('users')
      .select(`id, email, name, subscription_status, trial_started_at, stripe_customer_id, created_at`)
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('digests')
      .select('user_id, sent_at')
      .eq('status', 'sent'),
  ])

  // Aggregate digest count and last sent date per user
  const statsMap = new Map<string, { count: number; lastSent: string | null }>()
  for (const d of digestStats || []) {
    const existing = statsMap.get(d.user_id)
    if (!existing) {
      statsMap.set(d.user_id, { count: 1, lastSent: d.sent_at })
    } else {
      existing.count += 1
      if (!existing.lastSent || d.sent_at > existing.lastSent) {
        existing.lastSent = d.sent_at
      }
    }
  }

  const enriched = (users || []).map(u => ({
    ...u,
    digest_count: statsMap.get(u.id)?.count ?? 0,
    last_digest_at: statsMap.get(u.id)?.lastSent ?? null,
  }))

  return NextResponse.json({ users: enriched })
}
