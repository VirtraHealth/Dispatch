import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request) {
  // Use the actual request origin so redirects work regardless of NEXTAUTH_URL value
  const { origin } = new URL(req.url)

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    console.log('[redirect] no session — returning to /')
    return NextResponse.redirect(new URL('/', origin))
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!user) {
    console.log('[redirect] no user record — sending to /onboarding')
    return NextResponse.redirect(new URL('/onboarding', origin))
  }

  const { data: settings } = await supabaseAdmin
    .from('user_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const dest = settings ? '/dashboard' : '/onboarding'
  console.log(`[redirect] user=${session.user.email} settings=${!!settings} → ${dest}`)
  return NextResponse.redirect(new URL(dest, origin))
}
