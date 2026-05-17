import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getDriveClient } from '@/lib/google-drive'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, google_access_token, google_refresh_token')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: settings } = await supabaseAdmin
    .from('user_settings')
    .select('folder_ids')
    .eq('user_id', user.id)
    .single()

  const folderIds: string[] = settings?.folder_ids || []
  const drive = await getDriveClient(user.google_access_token, user.google_refresh_token)

  const results: Record<string, unknown>[] = []

  for (const folderId of folderIds) {
    // Get folder metadata
    let folderMeta: unknown = null
    try {
      const meta = await drive.files.get({
        fileId: folderId,
        fields: 'id,name,mimeType',
        supportsAllDrives: true,
      })
      folderMeta = meta.data
    } catch (e: unknown) {
      folderMeta = { error: String(e) }
    }

    // List ALL items directly in folder (no mimeType filter)
    let allItems: unknown[] = []
    try {
      const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id,name,mimeType)',
        pageSize: 50,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      })
      allItems = res.data.files || []
    } catch (e: unknown) {
      allItems = [{ error: String(e) }]
    }

    results.push({ folderId, folderMeta, allItems })
  }

  return NextResponse.json({ folderIds, results })
}
