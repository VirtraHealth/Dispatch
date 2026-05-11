'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { StepNav } from '@/components/StepNav'
import { FolderPicker } from '@/components/FolderPicker'
import { FrequencyPicker } from '@/components/FrequencyPicker'
import type { DriveFolder } from '@/types'

const STEP_LABELS = ['Connect Google', 'Choose folders', 'Delivery', 'Your context']
const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
]

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 || 12
  const ampm = i < 12 ? 'AM' : 'PM'
  return { value: i, label: `${h}:00 ${ampm}` }
})

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  // Start at step 0; the effect below advances to step 1 once authenticated.
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 2 state
  const [selectedFolders, setSelectedFolders] = useState<DriveFolder[]>([])

  // Step 3 state — initialized to '' then synced once session loads
  const [deliveryEmail, setDeliveryEmail] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('daily')
  const [deliveryHour, setDeliveryHour] = useState(7)
  const [timezone, setTimezone] = useState('America/Los_Angeles')

  // Step 4 state
  const [onboardingContext, setOnboardingContext] = useState('')
  const [personalInstructions, setPersonalInstructions] = useState('')

  // Advance to step 1 whenever the session becomes authenticated (handles
  // both: arriving already signed-in, and returning from the OAuth popup).
  // No stepInitialized guard — we want this to fire every time status changes
  // to 'authenticated' so it works after the OAuth redirect too.
  useEffect(() => {
    if (status !== 'authenticated') return
    setStep(prev => (prev === 0 ? 1 : prev))
    if (session?.user?.email) {
      setDeliveryEmail(prev => prev || session.user!.email!)
    }
  }, [status, session])

  async function handleGoogleSignIn() {
    await signIn('google', { callbackUrl: '/onboarding' })
  }

  async function handleFinish() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder_ids: selectedFolders.map(f => f.id),
          folder_names: selectedFolders.map(f => f.name),
          delivery_email: deliveryEmail || session?.user?.email,
          frequency,
          delivery_hour: deliveryHour,
          timezone,
          personal_instructions: personalInstructions || null,
          onboarding_context: onboardingContext || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to save settings')

      // Fire first digest immediately — don't await
      fetch('/api/digest/generate', { method: 'POST' }).catch(console.error)

      router.push('/dashboard')
    } catch (e) {
      setError('Something went wrong. Please try again.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // While NextAuth is still resolving the session, show a neutral spinner so
  // we never flash the "Connect Google" step at an already-authenticated user.
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-10">
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">
            Dispatch
          </span>
        </div>

        <StepNav currentStep={step} totalSteps={4} labels={STEP_LABELS} />

        {/* Step 0: Connect Google */}
        {step === 0 && (
          <div>
            <h1 className="font-serif text-3xl text-ink mb-3">Connect your Google account</h1>
            <p className="text-gray-500 text-base mb-8 font-sans leading-relaxed">
              Dispatch needs read-only access to your Google Drive to read your notes and docs. We never edit or delete anything.
            </p>
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl px-6 py-4 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all font-sans"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        {/* Step 1: Choose folders */}
        {step === 1 && (
          <div>
            <h1 className="font-serif text-3xl text-ink mb-3">Choose your writing folders</h1>
            <p className="text-gray-500 text-base mb-6 font-sans leading-relaxed">
              Select up to 3 folders containing your notes, journal entries, or docs. These are what Dispatch will read each morning.
            </p>
            <FolderPicker selected={selectedFolders} onChange={setSelectedFolders} max={3} />
            <button
              onClick={() => setStep(2)}
              disabled={selectedFolders.length === 0}
              className="mt-6 w-full bg-ink text-white rounded-xl py-3.5 text-sm font-semibold font-sans hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Delivery settings */}
        {step === 2 && (
          <div>
            <h1 className="font-serif text-3xl text-ink mb-3">When should it arrive?</h1>
            <p className="text-gray-500 text-base mb-6 font-sans leading-relaxed">
              Your digest will land in your inbox at the time you choose.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2 font-sans">
                  Delivery email
                </label>
                <input
                  type="email"
                  value={deliveryEmail}
                  onChange={e => setDeliveryEmail(e.target.value)}
                  placeholder={session?.user?.email || 'you@email.com'}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2 font-sans">
                  Frequency
                </label>
                <FrequencyPicker value={frequency} onChange={setFrequency} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2 font-sans">
                    Delivery time
                  </label>
                  <select
                    value={deliveryHour}
                    onChange={e => setDeliveryHour(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm font-sans focus:outline-none focus:border-indigo-400 bg-white"
                  >
                    {HOURS.map(h => (
                      <option key={h.value} value={h.value}>{h.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2 font-sans">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm font-sans focus:outline-none focus:border-indigo-400 bg-white"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="mt-6 w-full bg-ink text-white rounded-xl py-3.5 text-sm font-semibold font-sans hover:bg-gray-800 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Context + personal instructions */}
        {step === 3 && (
          <div>
            <h1 className="font-serif text-3xl text-ink mb-3">Tell Claude about yourself</h1>
            <p className="text-gray-500 text-base mb-6 font-sans leading-relaxed">
              This context helps Claude write more relevant, personal digests from day one.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2 font-sans">
                  What are you thinking about lately?
                </label>
                <textarea
                  value={onboardingContext}
                  onChange={e => setOnboardingContext(e.target.value)}
                  rows={4}
                  placeholder="What projects, questions, or ideas are you currently wrestling with? What are you trying to figure out? This is just for Claude — write freely."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2 font-sans">
                  Any instructions for Claude? <span className="text-gray-300 normal-case font-normal tracking-normal">(optional)</span>
                </label>
                <textarea
                  value={personalInstructions}
                  onChange={e => setPersonalInstructions(e.target.value)}
                  rows={3}
                  placeholder="e.g. Focus more on business implications. Push back on my assumptions. Go deeper on philosophy than business."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-500 font-sans">{error}</p>}

            <button
              onClick={handleFinish}
              disabled={loading}
              className="mt-6 w-full bg-indigo-600 text-white rounded-xl py-3.5 text-sm font-semibold font-sans hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Setting up your digest…' : 'Start my first digest'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3 font-sans">
              Your first digest will be sent immediately after you finish.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
