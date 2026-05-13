'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const SOCIAL_PROOF = [
  { initials: 'MR', quote: "It found a pattern in my writing I'd been ignoring for months.", name: 'Founder, NYC' },
  { initials: 'SK', quote: 'I finally feel like my journaling actually goes somewhere.', name: 'Product designer' },
  { initials: 'JT', quote: 'The questions at the end of each digest are worth the price alone.', name: 'Writer & strategist' },
]

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Reads everything you write',
    body: 'Connect up to 3 Google Drive folders. Claude reads your notes, journals, and ideas — and actually thinks about them.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Every morning at 8 AM',
    body: 'A personalized digest lands in your inbox each morning — not a summary, a response. It names what you\'re really wrestling with.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Gets smarter over time',
    body: 'The more you write, the better it gets. It finds patterns across weeks of writing that you can\'t see from inside the work.',
  },
]

function JoinFormInner() {
  const searchParams = useSearchParams()
  const source = searchParams.get('ref') || searchParams.get('utm_source') || null

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || status === 'loading') return
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, source }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || 'Something went wrong. Try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Connection error. Check your internet and try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl text-ink mb-3">You&apos;re on the list.</h2>
        <p className="text-gray-500 font-sans text-base mb-8 max-w-sm leading-relaxed">
          We&apos;ll be in touch soon. In the meantime, you can start your free trial now.
        </p>
        <Link
          href="/"
          className="inline-block bg-ink text-white px-6 py-3 rounded-xl text-sm font-semibold font-sans hover:bg-gray-800 transition-colors"
        >
          Start my free trial →
        </Link>
        <p className="text-xs text-gray-400 font-sans mt-3">7 days free · No credit card required</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="max-w-xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">
          My Daily Journal
        </Link>
        <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 font-sans transition-colors">
          Already have an account? Sign in →
        </Link>
      </nav>

      <main className="max-w-xl mx-auto px-6 pb-20">

        {/* Hero */}
        <div className="pt-10 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2 mb-8">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
            <span className="text-xs font-semibold text-indigo-600 font-sans tracking-wide">Free 7-day trial</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl text-ink leading-tight mb-5">
            Your journal,<br />writing back.
          </h1>
          <p className="text-gray-500 font-sans text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
            Every morning, Claude reads your notes and sends you a digest that pushes your thinking forward.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-10 shadow-sm">
          <h2 className="font-serif text-xl text-ink mb-1">Get early access</h2>
          <p className="text-sm text-gray-400 font-sans mb-6">We&apos;ll send you setup details and notify you of new features.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 font-sans mb-1.5">
                First name <span className="font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your first name"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:border-indigo-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 font-sans mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:border-indigo-400 transition-colors"
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-red-500 font-sans">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={!email.trim() || status === 'loading'}
              className="w-full bg-ink text-white rounded-xl py-3.5 text-sm font-semibold font-sans hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? 'Submitting…' : 'Get early access →'}
            </button>

            <p className="text-xs text-gray-400 font-sans text-center">
              No spam. Unsubscribe anytime. You can also{' '}
              <Link href="/" className="text-indigo-600 hover:text-indigo-700">
                start your free trial right now
              </Link>
              .
            </p>
          </form>
        </div>

        {/* Features */}
        <div className="space-y-5 mb-12">
          {FEATURES.map(f => (
            <div key={f.title} className="flex items-start gap-4 bg-white rounded-xl border border-gray-100 px-5 py-4">
              <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 text-indigo-500">
                {f.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-ink font-sans mb-0.5">{f.title}</div>
                <div className="text-sm text-gray-500 font-sans leading-relaxed">{f.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="space-y-3 mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400 font-sans mb-4 text-center">
            What people say
          </p>
          {SOCIAL_PROOF.map(t => (
            <div key={t.name} className="bg-white rounded-xl border border-gray-100 px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-indigo-600 font-sans">{t.initials}</span>
                </div>
                <span className="text-xs text-gray-400 font-sans">{t.name}</span>
              </div>
              <p className="text-sm text-gray-700 font-sans leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-sm text-gray-500 font-sans mb-4">Ready to start right now?</p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-sm font-semibold font-sans hover:bg-indigo-700 transition-colors"
          >
            Start free trial — no credit card needed
          </Link>
          <p className="text-xs text-gray-400 font-sans mt-3">$4.99/mo after 7 days · Cancel anytime</p>
        </div>

      </main>

      <footer className="border-t border-gray-100">
        <div className="max-w-xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-sans">© 2025 My Daily Journal</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Privacy</Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function JoinForm() {
  return (
    <Suspense>
      <JoinFormInner />
    </Suspense>
  )
}
