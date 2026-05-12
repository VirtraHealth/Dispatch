import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const subscription = event.data.object as Stripe.Subscription
  const customerId = subscription.customer as string

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await supabaseAdmin
        .from('users')
        .update({
          subscription_status: subscription.status,
          stripe_subscription_id: subscription.id,
        })
        .eq('stripe_customer_id', customerId)
      break

    case 'customer.subscription.deleted':
      await supabaseAdmin
        .from('users')
        .update({ subscription_status: 'canceled', stripe_subscription_id: null })
        .eq('stripe_customer_id', customerId)
      break
  }

  return NextResponse.json({ received: true })
}
