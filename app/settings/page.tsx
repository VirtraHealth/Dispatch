'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FolderPicker } from '@/components/FolderPicker'
import { FrequencyPicker } from '@/components/FrequencyPicker'
import type { DriveFolder, UserSettings } from '@/types'

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
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('daily')
  const [deliveryHour, setDeliveryHour] = useState(7)
  const [timezone, setTimezone] = useState('America/Los_Angeles')
  const [personalInstructions, setPersonalInstructions] = useState('')
  const [isActive, setIsActive] = useState(true)

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
          setFrequency(s.frequency || 'daily')
          setDeliveryHour(s.delivery_hour ?? 7)
          setTimezone(s.timezone || 'America/Los_Angeles')
          setPersonalInstructions(s.personal_instructions || '')
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
          delivery_hour: deliveryHour,
          timezone,
          personal_instructions: personalInstructions || null,
          onboarding_context: settings?.onboarding_context ?? null,
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
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">Dispatch</span>
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

          {/* Frequency */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-3 font-sans">
              Frequency
            </label>
            <FrequencyPicker value={frequency} onChange={setFrequency} />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 font-sans">
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
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 font-sans">
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
