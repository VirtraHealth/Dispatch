import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { feedback } = await req.json()
  if (!feedback || typeof feedback !== 'string') {
    return NextResponse.json({ error: 'Invalid feedback' }, { status: 400 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: digest } = await supabaseAdmin
    .from('digests')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!digest) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await supabaseAdmin
    .from('digests')
    .update({ feedback })
    .eq('id', params.id)

  return NextResponse.json({ success: true })
}
