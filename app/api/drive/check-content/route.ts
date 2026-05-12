import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { foldersHaveContent } from '@/lib/google-drive'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { folderIds } = await req.json()

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('google_access_token, google_refresh_token')
    .eq('email', session.user.email)
    .single()

  if (!user?.google_access_token) {
    return NextResponse.json({ error: 'No Google tokens' }, { status: 400 })
  }

  try {
    const hasContent = await foldersHaveContent(
      user.google_access_token,
      user.google_refresh_token,
      folderIds
    )
    return NextResponse.json({ hasContent })
  } catch {
    return NextResponse.json({ hasContent: true }) // fail open — don't block the user
  }
}
