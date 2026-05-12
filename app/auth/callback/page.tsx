'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function AuthCallbackPage() {
  const { status } = useSession()
  const router = useRouter()
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return

    if (status === 'unauthenticated') {
      router.replace('/')
      return
    }

    if (status !== 'authenticated') return

    called.current = true
    fetch('/api/auth/check-onboarding')
      .then(r => r.json())
      .then(({ destination }) => router.replace(destination))
      .catch(() => router.replace('/dashboard'))
  }, [status, router])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
