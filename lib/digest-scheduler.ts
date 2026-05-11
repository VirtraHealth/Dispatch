import { supabaseAdmin } from './supabase'

export async function getUsersDueForDigest(currentUtcHour: number) {
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

  // Get last digest date for each user
  const userIds = settings.map(s => s.user_id)
  const { data: lastDigests } = await supabaseAdmin
    .from('digests')
    .select('user_id, sent_at')
    .in('user_id', userIds)
    .eq('status', 'sent')
    .order('sent_at', { ascending: false })

  // Build a map of user_id → last sent date
  const lastSentMap: Record<string, Date> = {}
  for (const d of lastDigests || []) {
    if (!lastSentMap[d.user_id]) {
      lastSentMap[d.user_id] = new Date(d.sent_at)
    }
  }

  const now = new Date()

  return settings.filter(s => {
    if (!s.users?.google_access_token) return false

    // Check if delivery hour matches
    const deliveryHourUtc = getUtcHourForTimezone(s.delivery_hour, s.timezone)
    if (deliveryHourUtc !== currentUtcHour) return false

    // Check frequency — is the user due for a digest today?
    const lastSent = lastSentMap[s.user_id]
    if (!lastSent) return true // never received one, always due

    const daysSinceLastSent = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24)

    switch (s.frequency) {
      case 'daily':    return daysSinceLastSent >= 1
      case 'weekly':   return daysSinceLastSent >= 7
      case 'biweekly': return daysSinceLastSent >= 14
      case 'monthly':  return daysSinceLastSent >= 30
      default:         return daysSinceLastSent >= 1
    }
  })
}

function getUtcHourForTimezone(localHour: number, timezone: string): number {
  try {
    const now = new Date()
    const localDateStr = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now)

    const [month, day, year] = localDateStr.split('/').map(Number)
    const localDate = new Date(Date.UTC(year, month - 1, day, localHour, 0, 0))

    const utcFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      hour: 'numeric',
      hour12: false,
    })
    const tzFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    })

    const utcHour = parseInt(utcFormatter.format(localDate))
    const tzHour = parseInt(tzFormatter.format(localDate))
    const offset = tzHour - utcHour

    return ((localHour - offset) + 24) % 24
  } catch {
    return localHour
  }
}
