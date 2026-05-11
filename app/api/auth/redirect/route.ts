import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { origin } = new URL(req.url)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token?.email) {
    console.log('[redirect] no token — returning to /')
    return NextResponse.redirect(new URL('/', origin))
  }

  const email = token.email as string

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (!user) {
    console.log('[redirect] no user — sending to /onboarding')
    return NextResponse.redirect(new URL('/onboarding', origin))
  }

  const { data: settings } = await supabaseAdmin
    .from('user_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const dest = settings ? '/dashboard' : '/onboarding'
  console.log(`[redirect] ${email} → ${dest}`)
  return NextResponse.redirect(new URL(dest, origin))
}
