import { supabaseAdmin } from './supabase'

export async function getUsersDueForDigest(currentUtcHour: number) {
  const { data: settings, error } = await supabaseAdmin
    .from('user_settings')
    .select(
      `
      *,
      users (
        id,
        email,
        google_access_token,
        google_refresh_token
      )
    `
    )
    .eq('is_active', true)
    .not('folder_ids', 'eq', '{}')

  if (error || !settings) return []

  return settings.filter(s => {
    if (!s.users?.google_access_token) return false

    // Convert user's delivery_hour from their timezone offset to UTC
    // Uses the simple offset approach — for production add date-fns-tz
    const deliveryHourUtc = getUtcHourForTimezone(s.delivery_hour, s.timezone)
    return deliveryHourUtc === currentUtcHour
  })
}

function getUtcHourForTimezone(localHour: number, timezone: string): number {
  try {
    // Create a date at the local hour today, then read its UTC hour
    const now = new Date()
    const localDateStr = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now)

    const [month, day, year] = localDateStr.split('/').map(Number)
    const localDate = new Date(Date.UTC(year, month - 1, day, localHour, 0, 0))

    // Find the UTC offset for this timezone
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
    return localHour // fallback: treat as UTC
  }
}
