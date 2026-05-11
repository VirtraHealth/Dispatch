import { NextResponse } from 'next/server'
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

  const { data: digests } = await supabaseAdmin
    .from('digests')
    .select('id, sent_at, subject, docs_read, doc_count, status')
    .eq('user_id', user.id)
    .order('sent_at', { ascending: false })
    .limit(30)

  return NextResponse.json({ digests: digests || [] })
}
