import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export function isSubscriptionActive(
  status: string | null,
  trialStartedAt: string | null
): boolean {
  if (status === 'active') return true
  if (status === 'trialing' && trialStartedAt) {
    const trialEnd = new Date(trialStartedAt).getTime() + 7 * 24 * 60 * 60 * 1000
    return Date.now() < trialEnd
  }
  return false
}

export function trialDaysRemaining(trialStartedAt: string | null): number {
  if (!trialStartedAt) return 0
  const trialEnd = new Date(trialStartedAt).getTime() + 7 * 24 * 60 * 60 * 1000
  const ms = trialEnd - Date.now()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}
