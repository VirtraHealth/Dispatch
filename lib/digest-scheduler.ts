import { supabaseAdmin } from './supabase'

export async function getUsersDueForDigest() {
  const { data: settings, error } = await supabaseAdmin
    .from('user_settings')
    .select(`
      *,
      users (
        id,
        email,
        google_access_token,
        google_refresh_token
      )
    `)
    .eq('is_active', true)
    .not('folder_ids', 'eq', '{}')

  if (error || !settings) return []

  return settings.filter(s => !!s.users?.google_access_token)
}
