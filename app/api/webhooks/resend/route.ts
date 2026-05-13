import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()

  // Verify Resend webhook signature
  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing signature headers' }, { status: 400 })
  }

  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[webhook] RESEND_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  // Verify using HMAC-SHA256
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret.startsWith('whsec_')
        ? atob(webhookSecret.slice(6))
        : webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const signedContent = `${svixId}.${svixTimestamp}.${body}`
    const signatures = svixSignature.split(' ').map(s => s.split(',')[1]).filter(Boolean)

    let verified = false
    for (const sig of signatures) {
      const sigBytes = Uint8Array.from(atob(sig), c => c.charCodeAt(0))
      const result = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(signedContent))
      if (result) { verified = true; break }
    }

    if (!verified) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  } catch (e) {
    console.error('[webhook] Signature verification failed:', e)
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 })
  }

  const event = JSON.parse(body)
  const eventType: string = event.type

  if (eventType !== 'email.opened' && eventType !== 'email.clicked') {
    return NextResponse.json({ received: true })
  }

  // Extract digest_id from tags
  const tags: { name: string; value: string }[] = event.data?.tags || []
  const digestIdTag = tags.find(t => t.name === 'digest_id')
  if (!digestIdTag?.value) {
    return NextResponse.json({ received: true })
  }

  const digestId = digestIdTag.value

  // Look up the digest to get the user_id
  const { data: digest } = await supabaseAdmin
    .from('digests')
    .select('user_id')
    .eq('id', digestId)
    .single()

  if (!digest) {
    return NextResponse.json({ received: true })
  }

  // Upsert to avoid duplicate events (Resend can fire multiple times)
  await supabaseAdmin.from('email_events').insert({
    digest_id: digestId,
    user_id: digest.user_id,
    event_type: eventType === 'email.opened' ? 'opened' : 'clicked',
  })

  return NextResponse.json({ received: true })
}
