import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendDemoWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { email, name, sessionId, source } = await req.json()

  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  const normalized = email.trim().toLowerCase()

  let briefingSubject = 'Your morning briefing'
  let briefingBody = ''

  if (sessionId) {
    const { data: session } = await supabaseAdmin
      .from('demo_sessions')
      .select('briefing_subject, briefing_body')
      .eq('id', sessionId)
      .single()

    if (session) {
      briefingSubject = session.briefing_subject || briefingSubject
      briefingBody = session.briefing_body || ''
      await supabaseAdmin
        .from('demo_sessions')
        .update({ email: normalized })
        .eq('id', sessionId)
    }
  }

  await supabaseAdmin
    .from('leads')
    .upsert(
      { email: normalized, name: name?.trim() || null, source: source || null },
      { onConflict: 'email', ignoreDuplicates: false }
    )

  try {
    await sendDemoWelcomeEmail({ to: normalized, name: name?.trim() || null, briefingSubject, briefingBody })
  } catch (e) {
    console.error('[demo/claim] Email failed:', e)
  }

  return NextResponse.json({ success: true })
}
