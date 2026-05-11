import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { origin } = new URL(req.url)

  // Explicitly use secure cookie in production (HTTPS) — required for getToken
  // to look for __Secure-next-auth.session-token instead of next-auth.session-token
  const secureCookie = origin.startsWith('https://')

  const cookieNames = req.cookies.getAll().map(c => c.name)
  console.log('[redirect] origin:', origin)
  console.log('[redirect] secureCookie:', secureCookie)
  console.log('[redirect] cookies present:', cookieNames)
  console.log('[redirect] secret set:', !!process.env.NEXTAUTH_SECRET)

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie,
  })

  console.log('[redirect] token:', token ? `found (${token.email})` : 'null')

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
