import { supabaseAdmin } from '@/lib/supabase'
import type { DriveDoc } from '@/types'

export async function getJournalEntriesDoc(userId: string): Promise<DriveDoc | null> {
  const { data } = await supabaseAdmin
    .from('user_journals')
    .select('content, updated_at')
    .eq('user_id', userId)
    .single()

  if (!data?.content?.trim()) return null

  return {
    name: 'My journal (written in-app)',
    content: data.content.trim().slice(0, 12000),
    modified: new Date(data.updated_at).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  }
}
