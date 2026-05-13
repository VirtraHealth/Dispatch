import { supabaseAdmin } from '@/lib/supabase'
import type { DriveDoc } from '@/types'

export async function getJournalEntriesDoc(userId: string): Promise<DriveDoc | null> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: entries } = await supabaseAdmin
    .from('journal_entries')
    .select('content, created_at')
    .eq('user_id', userId)
    .gte('created_at', sevenDaysAgo)
    .order('created_at', { ascending: false })

  if (!entries || entries.length === 0) return null

  const content = entries
    .map(e => {
      const date = new Date(e.created_at).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
      })
      return `[${date}]\n${e.content}`
    })
    .join('\n\n---\n\n')

  return {
    name: 'My notes (written in-app, last 7 days)',
    modified: entries[0].created_at,
    content,
  }
}
