import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { listFolders } from '@/lib/google-drive'
import { supabaseAdmin } from '@/lib/supabase'

async function getTokens(email: string) {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('google_access_token, google_refresh_token')
    .eq('email', email)
    .single()
  return user
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await getTokens(session.user.email)

  if (!user?.google_access_token || !user?.google_refresh_token) {
    return NextResponse.json({ error: 'No Google tokens found' }, { status: 400 })
  }

  try {
    const folders = await listFolders(user.google_access_token, user.google_refresh_token)
    return NextResponse.json({ folders })
  } catch (e) {
    console.error('Failed to list Drive folders:', e)
    return NextResponse.json({ error: 'Failed to access Google Drive' }, { status: 500 })
  }
}

