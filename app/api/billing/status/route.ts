import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { isSubscriptionActive, trialDaysRemaining } from '@/lib/stripe'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('subscription_status, trial_started_at, stripe_customer_id')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const active = isSubscriptionActive(user.subscription_status, user.trial_started_at)
  const trialing = user.subscription_status === 'trialing'
  const daysLeft = trialDaysRemaining(user.trial_started_at)

  return NextResponse.json({ active, trialing, daysLeft })
}
