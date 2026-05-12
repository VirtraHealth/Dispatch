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

  const { data: users } = await supabaseAdmin
    .from('users')
    .select(`
      id,
      email,
      name,
      subscription_status,
      trial_started_at,
      stripe_customer_id,
      created_at
    `)
    .order('created_at', { ascending: false })

  return NextResponse.json({ users: users || [] })
}
