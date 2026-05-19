'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { StepNav } from '@/components/StepNav'
import { FilePicker } from '@/components/FilePicker'
import type { DriveFolder } from '@/types'

const STEP_LABELS = ['Connect your notes', 'Delivery', 'About you']

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [selectedFolders, setSelectedFolders] = useState<DriveFolder[]>([])
  const [deliveryEmail, setDeliveryEmail] = useState('')
  const [onboardingContext, setOnboardingContext] = useState('')
  const [personalInstructions, setPersonalInstructions] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/')
    if (status === 'authenticated' && session?.user?.email) {
      setDeliveryEmail(prev => prev || session.user!.email!)
    }
  }, [status, session, router])

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
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        <div className="mb-10">
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">
            My Daily Journal
          </span>
        </div>

        <StepNav currentStep={step} totalSteps={3} labels={STEP_LABELS} />

        {/* ── Step 0: Connect documents ── */}
        {step === 0 && (
          <div>
            <h1 className="font-serif text-3xl text-ink mb-3">
              Connect where your thinking lives
            </h1>
            <p className="text-gray-500 text-base mb-2 font-sans leading-relaxed">
              Claude reads your notes each morning and sends you a sharp digest — patterns you missed, questions worth asking, threads worth pulling.
            </p>
            <p className="text-gray-400 text-sm mb-6 font-sans">
              Add a Google Drive folder or individual docs below.
            </p>

            <FilePicker selected={selectedFolders} onChange={setSelectedFolders} />

            <button
              onClick={() => setStep(1)}
              disabled={selectedFolders.length === 0}
              className="mt-6 w-full bg-ink text-white rounded-xl py-3.5 text-sm font-semibold font-sans hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>

            {/* Escape hatch when nothing selected */}
            {selectedFolders.length === 0 && (
              <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4">
                <p className="text-sm font-semibold text-indigo-800 font-sans mb-1">
                  Don&apos;t have any docs yet?
                </p>
                <p className="text-xs text-indigo-600 font-sans mb-3 leading-relaxed">
                  Start a new Google Doc, write a few lines — even rough notes work. Then come back here and add it.
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://docs.new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold font-sans px-3.5 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Create a Google Doc
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-sans transition-colors"
                  >
                    Open Drive ↗
                  </a>
                </div>
                <p className="text-xs text-indigo-400 font-sans mt-3">
                  Or{' '}
                  <button
                    onClick={() => setStep(1)}
                    className="underline hover:text-indigo-600 transition-colors"
                  >
                    skip for now
                  </button>
                  {' '}and add documents later from Settings.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Delivery email ── */}
        {step === 1 && (
          <div>
            <h1 className="font-serif text-3xl text-ink mb-3">Where should it land?</h1>
            <p className="text-gray-500 text-base mb-6 font-sans leading-relaxed">
              Your digest arrives every morning at 8 AM Pacific. We&apos;ll send your first one the moment you finish setup.
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
              <p className="text-xs text-gray-400 font-sans mt-2">
                Use any inbox — doesn&apos;t have to be your Google account.
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!deliveryEmail.trim()}
              className="mt-6 w-full bg-ink text-white rounded-xl py-3.5 text-sm font-semibold font-sans hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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

        {/* ── Step 2: Context ── */}
        {step === 2 && (
          <div>
            <h1 className="font-serif text-3xl text-ink mb-2">Make it yours</h1>
            <p className="text-gray-500 text-sm mb-6 font-sans leading-relaxed">
              The more Claude knows about you, the sharper your digest gets from day one. This takes 60 seconds.
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
                  placeholder="e.g. Building a B2B SaaS, wrestling with distribution vs. product. I journal about Stoicism and founder uncertainty. Reading a lot about decision-making."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-400 resize-none"
                />
                <p className="text-xs text-gray-400 font-sans mt-1.5">
                  Write freely — the messier and more honest, the better.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2 font-sans">
                  How should Claude talk to you?{' '}
                  <span className="text-gray-300 normal-case font-normal tracking-normal">(optional)</span>
                </label>
                <textarea
                  value={personalInstructions}
                  onChange={e => setPersonalInstructions(e.target.value)}
                  rows={3}
                  placeholder="e.g. Keep it to 3 sharp insights. Push back harder on my assumptions. Lean into philosophy over tactics."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-500 font-sans">{error}</p>}

            <button
              onClick={handleFinish}
              disabled={loading}
              className="mt-6 w-full bg-indigo-600 text-white rounded-xl py-4 text-sm font-semibold font-sans hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Setting up your digest…
                </span>
              ) : (
                'Send my first digest →'
              )}
            </button>

            <button
              onClick={() => setStep(1)}
              className="mt-3 w-full text-sm text-gray-400 hover:text-gray-600 font-sans py-2 transition-colors"
            >
              ← Back
            </button>

            <div className="mt-4 flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-green-700 font-sans leading-relaxed">
                Your first digest will be sent immediately — check your inbox. After that, it arrives every morning at 8 AM Pacific.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
