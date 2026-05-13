import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, name, source } = await req.json()

  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('leads')
    .upsert(
      { email: email.trim().toLowerCase(), name: name?.trim() || null, source: source || null },
      { onConflict: 'email', ignoreDuplicates: false }
    )

  if (error) {
    console.error('[leads] Upsert failed:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
