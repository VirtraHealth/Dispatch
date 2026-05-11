import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
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

  const { data: digest } = await supabaseAdmin
    .from('digests')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!digest) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ digest })
}
