'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Invisible component that lives on the landing page.
 * If the user already has an active session, redirect them to /dashboard
 * so they never land back on the marketing page after signing in.
 */
export function LandingRedirect() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/api/auth/redirect')
    }
  }, [status, router])

  return null
}
