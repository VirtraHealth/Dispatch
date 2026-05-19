import { supabaseAdmin } from './supabase'
import { isSubscriptionActive } from './stripe'

export async function getUsersDueForDigest() {
  const { data: settings, error } = await supabaseAdmin
    .from('user_settings')
    .select(`
      *,
      users (
        id,
        email,
        google_access_token,
        google_refresh_token,
        subscription_status,
        trial_started_at
      )
    `)
    .eq('is_active', true)

  if (error || !settings) return []

  return settings.filter(s => {
    if (!s.users?.google_access_token) return false
    return isSubscriptionActive(s.users.subscription_status, s.users.trial_started_at)
  })
}
