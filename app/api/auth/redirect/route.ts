import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

const base = process.env.NEXTAUTH_URL!

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/', base))
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!user) {
    return NextResponse.redirect(new URL('/onboarding', base))
  }

  const { data: settings } = await supabaseAdmin
    .from('user_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()

  return NextResponse.redirect(new URL(settings ? '/dashboard' : '/onboarding', base))
}
