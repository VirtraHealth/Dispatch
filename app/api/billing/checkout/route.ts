import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, stripe_customer_id')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  let customerId = user.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({ email: session.user.email })
    customerId = customer.id
    await supabaseAdmin
      .from('users')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
