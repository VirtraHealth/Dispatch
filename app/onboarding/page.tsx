'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { StepNav } from '@/components/StepNav'
import { FilePicker } from '@/components/FilePicker'
import type { DriveFolder } from '@/types'

const STEP_LABELS = ['Choose documents', 'Delivery', 'Your context']

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Users always arrive here authenticated (via /api/auth/redirect).
  // 3-step flow: 0 = folders, 1 = delivery, 2 = context
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [selectedFolders, setSelectedFolders] = useState<DriveFolder[]>([])
  const [deliveryEmail, setDeliveryEmail] = useState('')
  const [onboardingContext, setOnboardingContext] = useState('')
  const [personalInstructions, setPersonalInstructions] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/')
    }
    if (status === 'authenticated' && session?.user?.email) {
      setDeliveryEmail(prev => prev || session.user!.email!)
    }
  }, [status, session, router])

  function advanceFromFolders() {
    setStep(1)
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
          personal_instructions: personalInstructions || null,
          onboarding_context: onboardingContext || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to save settings')

      fetch('/api/digest/generate', { method: 'POST' }).catch(console.error)

      router.push('/dashboard')
    } catch (e) {
      setError('Something went wrong. Please try again.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

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
        <div className="mb-10">
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">
            My Daily Journal
          </span>
        </div>

        <StepNav currentStep={step} totalSteps={3} labels={STEP_LABELS} />

        {/* Step 0: Choose documents */}
        {step === 0 && (
          <div>
            <h1 className="font-serif text-3xl text-ink mb-3">Choose your writing documents</h1>
            <p className="text-gray-500 text-base mb-6 font-sans leading-relaxed">
              Select the Google Docs or text files where you keep your notes and journal entries. My Daily Journal reads these every morning.
            </p>
            <FilePicker selected={selectedFolders} onChange={setSelectedFolders} />
            <button
              onClick={advanceFromFolders}
              disabled={selectedFolders.length === 0}
              className="mt-6 w-full bg-ink text-white rounded-xl py-3.5 text-sm font-semibold font-sans hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 1: Delivery email */}
        {step === 1 && (
          <div>
            <h1 className="font-serif text-3xl text-ink mb-3">Where should it land?</h1>
            <p className="text-gray-500 text-base mb-6 font-sans leading-relaxed">
              Your digest arrives every morning at 8 AM Pacific. Confirm where to send it.
            </p>

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

            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full bg-ink text-white rounded-xl py-3.5 text-sm font-semibold font-sans hover:bg-gray-800 transition-colors"
            >
              Continue
            </button>
            <button
              onClick={() => setStep(0)}
              className="mt-3 w-full text-sm text-gray-400 hover:text-gray-600 font-sans py-2 transition-colors"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Step 2: Context + personal instructions */}
        {step === 2 && (
          <div>
            <h1 className="font-serif text-3xl text-ink mb-3">Make it yours</h1>
            <p className="text-gray-500 text-sm mb-6 font-sans">
              Help Claude understand you so your digest feels personal from day one.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2 font-sans">
                  What are you working on right now?
                </label>
                <textarea
                  value={onboardingContext}
                  onChange={e => setOnboardingContext(e.target.value)}
                  rows={4}
                  placeholder="e.g. I'm building a B2B SaaS, wrestling with distribution vs. product. I journal about Stoicism and founder uncertainty."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-400 resize-none"
                />
                <p className="text-xs text-gray-400 font-sans mt-2">
                  Write freely — Claude uses this to understand what you care about most.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2 font-sans">
                  Instructions <span className="text-gray-300 normal-case font-normal tracking-normal">(optional)</span>
                </label>
                <textarea
                  value={personalInstructions}
                  onChange={e => setPersonalInstructions(e.target.value)}
                  rows={3}
                  placeholder="e.g. Keep it to 3 sharp insights. Push back harder. Lean into philosophy."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-500 font-sans">{error}</p>}

            <button
              onClick={handleFinish}
              disabled={loading}
              className="mt-6 w-full bg-indigo-600 text-white rounded-xl py-3.5 text-sm font-semibold font-sans hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Setting up your digest…' : 'Start my first digest'}
            </button>
            <button
              onClick={() => setStep(1)}
              className="mt-3 w-full text-sm text-gray-400 hover:text-gray-600 font-sans py-2 transition-colors"
            >
              ← Back
            </button>

            <p className="text-xs text-gray-400 text-center mt-3 font-sans">
              Your first digest will be sent immediately — check your inbox.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
