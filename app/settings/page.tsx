'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FolderPicker } from '@/components/FolderPicker'
import type { DriveFolder, UserSettings } from '@/types'


export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Form state
  const [selectedFolders, setSelectedFolders] = useState<DriveFolder[]>([])
  const [deliveryEmail, setDeliveryEmail] = useState('')
  const [personalInstructions, setPersonalInstructions] = useState('')
  const [onboardingContext, setOnboardingContext] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [frequency] = useState<'daily'>('daily')

  useEffect(() => {
    fetch('/api/user/settings')
      .then(r => r.json())
      .then(data => {
        if (data.settings) {
          const s: UserSettings = data.settings
          setSettings(s)
          setSelectedFolders(
            (s.folder_ids || []).map((id, i) => ({
              id,
              name: s.folder_names?.[i] || id,
            }))
          )
          setDeliveryEmail(s.delivery_email || session?.user?.email || '')
          setPersonalInstructions(s.personal_instructions || '')
          setOnboardingContext(s.onboarding_context || '')
          setIsActive(s.is_active ?? true)

        }
      })
      .finally(() => setLoading(false))
  }, [session])

  async function handleSave() {
    setSaving(true)
    setSaveStatus('idle')

    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder_ids: selectedFolders.map(f => f.id),
          folder_names: selectedFolders.map(f => f.name),
          delivery_email: deliveryEmail,
          frequency,
          delivery_hour: 7,
          timezone: 'America/Los_Angeles',
          personal_instructions: personalInstructions || null,
          onboarding_context: onboardingContext || null,
          is_active: isActive,
        }),
      })

      if (res.ok) {
        setSaveStatus('success')
      } else {
        setSaveStatus('error')
      }
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-sm text-gray-400 font-sans">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-lg mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">My Daily Journal</span>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-400 hover:text-gray-600 font-sans transition-colors"
          >
            ← Dashboard
          </button>
        </div>

        <h1 className="font-serif text-3xl text-ink mb-8">Settings</h1>

        <div className="space-y-10">

          {/* Pause / Resume */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
            <div>
              <div className="text-sm font-semibold text-gray-700 font-sans">Daily digests</div>
              <div className="text-xs text-gray-400 font-sans mt-0.5">Pause without losing your settings</div>
            </div>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`relative w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-indigo-600' : 'bg-gray-200'}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </button>
          </div>

          {/* Folders */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-3 font-sans">
              Writing folders
            </label>
            <FolderPicker selected={selectedFolders} onChange={setSelectedFolders} max={3} />
          </div>

          {/* Delivery email */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 font-sans">
              Delivery email
            </label>
            <input
              type="email"
              value={deliveryEmail}
              onChange={e => setDeliveryEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:border-indigo-400"
            />
          </div>

          {/* Delivery time (fixed) */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
            <div>
              <div className="text-sm font-semibold text-gray-700 font-sans">Delivery time</div>
              <div className="text-xs text-gray-400 font-sans mt-0.5">Every morning at 8:00 AM Pacific</div>
            </div>
            <span className="text-xs text-gray-300 font-sans">Daily</span>
          </div>

          {/* Personal instructions */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 font-sans">
              Instructions for Claude
            </label>
            <textarea
              value={personalInstructions}
              onChange={e => setPersonalInstructions(e.target.value)}
              rows={4}
              placeholder="e.g. Focus more on business implications. Push back harder on my assumptions. Go deeper on philosophy."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-400 resize-none"
            />
          </div>

          {/* Context */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 font-sans">
              Your context
            </label>
            <textarea
              value={onboardingContext}
              onChange={e => setOnboardingContext(e.target.value)}
              rows={4}
              placeholder="What are you working on? What questions keep coming up? What do you want Claude to understand about you?"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-400 resize-none"
            />
            <p className="text-xs text-gray-400 font-sans mt-1">
              Claude reads this every morning to personalize your digest.
            </p>
          </div>

          {/* Save */}
          <div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-ink text-white rounded-xl py-3.5 text-sm font-semibold font-sans hover:bg-gray-800 disabled:opacity-60 transition-colors"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {saveStatus === 'success' && (
              <p className="text-sm text-green-600 text-center mt-2 font-sans">Settings saved.</p>
            )}
            {saveStatus === 'error' && (
              <p className="text-sm text-red-500 text-center mt-2 font-sans">Failed to save. Try again.</p>
            )}
          </div>

          {/* Sign out */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-gray-400 hover:text-gray-600 font-sans transition-colors"
            >
              Sign out
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
