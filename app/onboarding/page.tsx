'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { StepNav } from '@/components/StepNav'
import { FolderPicker } from '@/components/FolderPicker'
import type { DriveFolder } from '@/types'

const STEP_LABELS = ['Choose folders', 'Delivery', 'Your context']

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
  const [foldersHaveContent, setFoldersHaveContent] = useState<boolean | null>(null)
  const [checkingContent, setCheckingContent] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/')
    }
    if (status === 'authenticated' && session?.user?.email) {
      setDeliveryEmail(prev => prev || session.user!.email!)
    }
  }, [status, session, router])

  async function advanceFromFolders() {
    setCheckingContent(true)
    try {
      const res = await fetch('/api/drive/check-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderIds: selectedFolders.map(f => f.id) }),
      })
      const data = await res.json()
      setFoldersHaveContent(data.hasContent ?? true)
    } catch {
      setFoldersHaveContent(true)
    } finally {
      setCheckingContent(false)
    }
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
            Dispatch
          </span>
        </div>

        <StepNav currentStep={step} totalSteps={3} labels={STEP_LABELS} />

        {/* Step 0: Choose folders */}
        {step === 0 && (
          <div>
            <h1 className="font-serif text-3xl text-ink mb-3">Choose your writing folders</h1>
            <p className="text-gray-500 text-base mb-6 font-sans leading-relaxed">
              Select up to 3 folders containing your notes, journal entries, or docs. These are what Dispatch will read each morning.
            </p>
            <FolderPicker selected={selectedFolders} onChange={setSelectedFolders} max={3} />
            <button
              onClick={advanceFromFolders}
              disabled={selectedFolders.length === 0 || checkingContent}
              className="mt-6 w-full bg-ink text-white rounded-xl py-3.5 text-sm font-semibold font-sans hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {checkingContent ? 'Checking folders…' : 'Continue'}
            </button>
          </div>
        )}

        {/* Step 1: Delivery email */}
        {step === 1 && (
          <div>
            <h1 className="font-serif text-3xl text-ink mb-3">Where should it land?</h1>
            <p className="text-gray-500 text-base mb-6 font-sans leading-relaxed">
              Your digest arrives every morning at 7 AM. Confirm where to send it.
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
          </div>
        )}

        {/* Step 2: Context + personal instructions */}
        {step === 2 && (
          <div>
            <h1 className="font-serif text-3xl text-ink mb-3">Make it yours</h1>
            <p className="text-gray-500 text-base mb-2 font-sans leading-relaxed">
              This is what separates a generic digest from one that feels written for you. The more you share, the more useful every digest becomes.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2 font-sans">
                  What are you working on right now?
                  {foldersHaveContent === false && (
                    <span className="ml-2 text-amber-500 normal-case font-normal tracking-normal">required — your folders appear empty</span>
                  )}
                </label>
                <textarea
                  value={onboardingContext}
                  onChange={e => setOnboardingContext(e.target.value)}
                  rows={6}
                  placeholder={"e.g. I'm building a B2B SaaS and constantly second-guessing whether to go broad or stay niche. I keep coming back to the question of whether great product can overcome poor distribution — or whether distribution is the actual product. I also journal a lot about Stoicism and how to think about uncertainty as a founder. I'm reading a lot of Marcus Aurelius and Nassim Taleb lately and trying to connect those ideas to what I'm building."}
                  className={`w-full border rounded-lg px-4 py-3 text-sm font-sans leading-relaxed focus:outline-none resize-none ${
                    foldersHaveContent === false && onboardingContext.length > 0 && onboardingContext.length < 100
                      ? 'border-amber-300 focus:border-amber-400'
                      : 'border-gray-200 focus:border-indigo-400'
                  }`}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400 font-sans">
                    {foldersHaveContent === false
                      ? 'Your folders are empty — tell Claude what you\'re thinking about so your first digest feels personal.'
                      : 'Write freely — Claude uses this to understand what you care about most.'}
                  </p>
                  {foldersHaveContent === false && (
                    <p className={`text-xs font-sans ml-4 flex-shrink-0 ${onboardingContext.length >= 100 ? 'text-green-500' : 'text-amber-500'}`}>
                      {onboardingContext.length}/100
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-gray-500 mb-2 font-sans">
                  Any instructions for Claude? <span className="text-gray-300 normal-case font-normal tracking-normal">(optional)</span>
                </label>
                <textarea
                  value={personalInstructions}
                  onChange={e => setPersonalInstructions(e.target.value)}
                  rows={3}
                  placeholder={"e.g. Keep it shorter — 3 sharp insights rather than 4 long sections. Push back harder when I'm being vague. Lean more into philosophy than business. End with one big question, not five."}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-500 font-sans">{error}</p>}

            <button
              onClick={handleFinish}
              disabled={loading || (foldersHaveContent === false && onboardingContext.length < 100)}
              className="mt-6 w-full bg-indigo-600 text-white rounded-xl py-3.5 text-sm font-semibold font-sans hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Setting up your digest…' : 'Start my first digest'}
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
