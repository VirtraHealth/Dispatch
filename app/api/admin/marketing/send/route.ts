import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { sendMarketingEmail } from '@/lib/email'

function isAdmin(email: string) {
  return email === process.env.ADMIN_EMAIL
}

type Segment = 'all' | 'active' | 'trialing' | 'canceled'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { segment, subject, body } = await req.json() as {
    segment: Segment
    subject: string
    body: string
  }

  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 })
  }

  // Fetch delivery emails for the target segment
  let query = supabaseAdmin
    .from('user_settings')
    .select('delivery_email, users!inner(subscription_status)')

  if (segment !== 'all') {
    query = query.eq('users.subscription_status', segment)
  }

  const { data: settings } = await query

  const emails = (settings || [])
    .map((s: { delivery_email: string }) => s.delivery_email)
    .filter(Boolean)

  if (emails.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0 })
  }

  let sent = 0
  let failed = 0

  // Send in batches of 50 with a small delay between batches
  for (let i = 0; i < emails.length; i += 50) {
    const batch = emails.slice(i, i + 50)
    const results = await Promise.allSettled(
      batch.map(to => sendMarketingEmail({ to, subject, body }))
    )
    sent += results.filter(r => r.status === 'fulfilled').length
    failed += results.filter(r => r.status === 'rejected').length
  }

  return NextResponse.json({ sent, failed })
}
