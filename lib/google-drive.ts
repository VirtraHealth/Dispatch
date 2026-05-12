import { google } from 'googleapis'
import type { DriveDoc, DriveFolder } from '@/types'

export async function getDriveClient(accessToken: string, refreshToken: string) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
  return google.drive({ version: 'v3', auth })
}

export async function listFolders(
  accessToken: string,
  refreshToken: string
): Promise<DriveFolder[]> {
  const drive = await getDriveClient(accessToken, refreshToken)
  const res = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder' and 'me' in owners and trashed=false",
    fields: 'files(id, name)',
    orderBy: 'name',
    pageSize: 200,
  })
  return (res.data.files || []).map(f => ({ id: f.id!, name: f.name! }))
}

export async function createFolder(
  accessToken: string,
  refreshToken: string,
  name: string
): Promise<DriveFolder> {
  const drive = await getDriveClient(accessToken, refreshToken)
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
    },
    fields: 'id, name',
  })
  return { id: res.data.id!, name: res.data.name! }
}

export async function foldersHaveContent(
  accessToken: string,
  refreshToken: string,
  folderIds: string[]
): Promise<boolean> {
  const drive = await getDriveClient(accessToken, refreshToken)
  for (const folderId of folderIds) {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType='application/vnd.google-apps.document' or mimeType='text/plain') and trashed=false`,
      fields: 'files(id)',
      pageSize: 1,
    })
    if ((res.data.files || []).length > 0) return true
  }
  return false
}

export async function readDocsFromFolders(
  accessToken: string,
  refreshToken: string,
  folderIds: string[]
): Promise<DriveDoc[]> {
  const drive = await getDriveClient(accessToken, refreshToken)
  const docs: DriveDoc[] = []

  for (const folderId of folderIds) {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType='application/vnd.google-apps.document' or mimeType='text/plain') and trashed=false`,
      fields: 'files(id, name, modifiedTime, mimeType)',
      orderBy: 'modifiedTime desc',
      pageSize: 20,
    })

    for (const file of res.data.files || []) {
      try {
        let content = ''

        if (file.mimeType === 'application/vnd.google-apps.document') {
          const exported = await drive.files.export({
            fileId: file.id!,
            mimeType: 'text/plain',
          })
          content = exported.data as string
        } else {
          const raw = await drive.files.get({ fileId: file.id!, alt: 'media' })
          content = raw.data as string
        }

        if (content.trim()) {
          docs.push({
            name: file.name!,
            content: content.trim().slice(0, 8000), // cap per-doc to avoid token blowout
            modified: new Date(file.modifiedTime!).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
          })
        }
      } catch (e) {
        console.error(`Could not read ${file.name}:`, e)
      }
    }
  }

  return docs
}
