import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

function isAdmin(email: string) {
  return email === process.env.ADMIN_EMAIL
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const allowed = ['trialing', 'active', 'canceled', 'complimentary']

  if (!allowed.includes(body.subscription_status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const update: Record<string, unknown> = { subscription_status: body.subscription_status }

  // Reset trial clock if manually setting back to trialing
  if (body.subscription_status === 'trialing') {
    update.trial_started_at = new Date().toISOString()
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update(update)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })

  return NextResponse.json({ user: data })
}
