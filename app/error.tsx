'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const router = useRouter()

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <span className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">
          Dispatch
        </span>
        <h1 className="font-serif text-3xl text-ink mt-6 mb-3">Something went wrong</h1>
        <p className="text-sm text-gray-500 font-sans leading-relaxed mb-8">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={reset}
            className="w-full max-w-xs bg-ink text-white rounded-xl py-3 text-sm font-semibold font-sans hover:bg-gray-800 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full max-w-xs border border-gray-200 text-gray-700 rounded-xl py-3 text-sm font-semibold font-sans hover:border-gray-300 transition-colors"
          >
            Go to dashboard
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm text-gray-400 hover:text-gray-600 font-sans transition-colors mt-1"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
