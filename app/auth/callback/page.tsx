'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function AuthCallbackPage() {
  const { status } = useSession()
  const router = useRouter()
  const called = useRef(false)
  const [showEscape, setShowEscape] = useState(false)

  // Show an escape link if loading takes more than 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowEscape(true), 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (called.current) return

    if (status === 'unauthenticated') {
      router.replace('/')
      return
    }

    if (status !== 'authenticated') return

    called.current = true
    setShowEscape(false) // redirect is happening — hide escape
    fetch('/api/auth/check-onboarding')
      .then(r => r.json())
      .then(({ destination }) => router.replace(destination))
      .catch(() => router.replace('/dashboard'))
  }, [status, router])

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      {showEscape && (
        <p className="text-xs text-gray-400 font-sans text-center">
          Taking too long?{' '}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-indigo-500 hover:text-indigo-700 underline"
          >
            Sign out and try again
          </button>
        </p>
      )}
    </div>
  )
}
