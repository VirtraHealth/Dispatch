import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { listFolders, createFolder } from '@/lib/google-drive'
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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Folder name required' }, { status: 400 })
  }

  const user = await getTokens(session.user.email)
  if (!user?.google_access_token || !user?.google_refresh_token) {
    return NextResponse.json({ error: 'No Google tokens found' }, { status: 400 })
  }

  try {
    const folder = await createFolder(user.google_access_token, user.google_refresh_token, name.trim())
    return NextResponse.json({ folder })
  } catch (e) {
    console.error('Failed to create folder:', e)
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 })
  }
}
