import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: settings } = await supabaseAdmin
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({ settings })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Enforce 3-folder max
  if (body.folder_ids && body.folder_ids.length > 3) {
    return NextResponse.json({ error: 'Maximum 3 folders allowed' }, { status: 400 })
  }

  const settingsData = {
    user_id: user.id,
    folder_ids: body.folder_ids ?? [],
    folder_names: body.folder_names ?? [],
    delivery_email: body.delivery_email ?? session.user.email,
    frequency: body.frequency ?? 'daily',
    delivery_hour: body.delivery_hour ?? 7,
    timezone: body.timezone ?? 'America/Los_Angeles',
    personal_instructions: body.personal_instructions ?? null,
    onboarding_context: body.onboarding_context ?? null,
    is_active: body.is_active ?? true,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabaseAdmin
    .from('user_settings')
    .upsert(settingsData, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) {
    console.error('Failed to save settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }

  return NextResponse.json({ settings: data })
}
