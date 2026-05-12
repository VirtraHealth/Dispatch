'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DigestCard } from '@/components/DigestCard'
import type { Digest, UserSettings } from '@/types'

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [digests, setDigests] = useState<Digest[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Instructions inline editing
  const [instructionsEditing, setInstructionsEditing] = useState(false)
  const [instructionsDraft, setInstructionsDraft] = useState('')
  const [instructionsSaving, setInstructionsSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/user/settings').then(r => r.json()),
      fetch('/api/digest/history').then(r => r.json()),
    ]).then(([settingsData, historyData]) => {
      if (settingsData.settings) {
        setSettings(settingsData.settings)
        setInstructionsDraft(settingsData.settings.personal_instructions || '')
      } else {
        router.replace('/onboarding')
      }
      if (historyData.digests) setDigests(historyData.digests)
    }).finally(() => setLoading(false))
  }, [router])

  async function sendNow() {
    setSending(true)
    setSendStatus('idle')
    try {
      const res = await fetch('/api/digest/generate', { method: 'POST' })
      if (res.ok) {
        setSendStatus('success')
        const data = await fetch('/api/digest/history').then(r => r.json())
        if (data.digests) setDigests(data.digests)
      } else {
        setSendStatus('error')
      }
    } catch {
      setSendStatus('error')
    } finally {
      setSending(false)
      setTimeout(() => setSendStatus('idle'), 4000)
    }
  }

  async function saveInstructions() {
    if (!settings) return
    setInstructionsSaving(true)
    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folder_ids: settings.folder_ids,
          folder_names: settings.folder_names,
          delivery_email: settings.delivery_email,
          frequency: settings.frequency,
          delivery_hour: settings.delivery_hour,
          timezone: settings.timezone,
          onboarding_context: settings.onboarding_context,
          is_active: settings.is_active,
          personal_instructions: instructionsDraft.trim() || null,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings)
        setInstructionsEditing(false)
      }
    } finally {
      setInstructionsSaving(false)
    }
  }

  const totalDocs = digests.reduce((sum, d) => sum + (d.doc_count || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-sm text-gray-400 font-sans">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">Dispatch</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/settings')}
              className="text-sm text-gray-400 hover:text-gray-600 font-sans transition-colors"
            >
              Settings
            </button>
            <span className="text-sm text-gray-400 font-sans">{session?.user?.email}</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-gray-400 text-sm font-sans mb-10">
          Your writing, read deeply. Your ideas, taken further. Every morning.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-2xl font-serif text-ink mb-1">{digests.length}</div>
            <div className="text-xs text-gray-400 font-sans uppercase tracking-wider">Digests sent</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-2xl font-serif text-ink mb-1">{settings?.folder_names?.length || 0}</div>
            <div className="text-xs text-gray-400 font-sans uppercase tracking-wider">Folders</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-2xl font-serif text-ink mb-1">{totalDocs}</div>
            <div className="text-xs text-gray-400 font-sans uppercase tracking-wider">Docs read</div>
          </div>
        </div>

        {/* Value proposition */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-8">
          <div className="grid grid-cols-3 gap-5">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-indigo-600 font-sans mb-2">Goes deeper</div>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Connects your ideas to philosophy, business thinking, and research you didn&apos;t know you needed.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-indigo-600 font-sans mb-2">Reads patterns</div>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Surfaces what you&apos;re returning to again and again — the live question underneath your writing.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-indigo-600 font-sans mb-2">Opens doors</div>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Ends with questions worth sitting with for days, and new directions you hadn&apos;t considered.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-xs font-bold tracking-widest uppercase text-gray-400 font-sans">
                Instructions for Claude
              </span>
            </div>
            {!instructionsEditing && (
              <button
                onClick={() => setInstructionsEditing(true)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-sans font-semibold"
              >
                {settings?.personal_instructions ? 'Edit' : 'Add'}
              </button>
            )}
          </div>

          {instructionsEditing ? (
            <div className="px-5 pb-5">
              <textarea
                value={instructionsDraft}
                onChange={e => setInstructionsDraft(e.target.value)}
                rows={4}
                autoFocus
                placeholder="Guide Claude on how to write your digest — length, tone, focus areas, what to push back on. e.g. Go deeper on philosophy. Make it shorter and more actionable. Push back harder on my assumptions."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-400 resize-none"
              />
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={saveInstructions}
                  disabled={instructionsSaving}
                  className="text-sm bg-ink text-white px-4 py-2 rounded-lg font-sans font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {instructionsSaving ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setInstructionsEditing(false)
                    setInstructionsDraft(settings?.personal_instructions || '')
                  }}
                  className="text-sm text-gray-400 hover:text-gray-600 font-sans"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="px-5 pb-4">
              {settings?.personal_instructions ? (
                <p className="text-sm text-gray-600 font-sans leading-relaxed">
                  {settings.personal_instructions}
                </p>
              ) : (
                <p className="text-sm text-gray-400 font-sans italic">
                  No instructions yet. Add a note to shape how Claude writes — length, tone, what to focus on.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Connected folders */}
        {settings?.folder_names && settings.folder_names.length > 0 ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 font-sans">
                Reading from
              </h2>
              <button
                onClick={() => router.push('/settings')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-sans"
              >
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.folder_names.map((name, i) => (
                <a
                  key={i}
                  href={`https://drive.google.com/drive/folders/${settings.folder_ids?.[i] || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm bg-white border border-gray-100 rounded-lg px-3 py-2 text-gray-700 font-sans hover:border-indigo-200 hover:text-indigo-700 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                  {name}
                  <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
            <div className="text-sm font-semibold text-gray-700 font-sans mb-1">No folders connected yet</div>
            <p className="text-xs text-gray-400 font-sans mb-4">
              Add up to 3 Google Drive folders for Dispatch to read. The more you write, the better it gets.
            </p>
            <button
              onClick={() => router.push('/settings')}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold font-sans px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add folders
            </button>
          </div>
        )}

        {/* Send now */}
        <div className="mb-10">
          <button
            onClick={sendNow}
            disabled={sending || !settings?.folder_ids?.length}
            className="w-full bg-ink text-white rounded-xl py-3.5 text-sm font-semibold font-sans hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? 'Generating your digest…' : 'Send digest now'}
          </button>
          {sendStatus === 'success' && (
            <p className="text-sm text-green-600 text-center mt-2 font-sans">
              Digest sent. Check your inbox.
            </p>
          )}
          {sendStatus === 'error' && (
            <p className="text-sm text-red-500 text-center mt-2 font-sans">
              Something went wrong. Try again.
            </p>
          )}
        </div>

        {/* Digest history */}
        <div>
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4 font-sans">
            Past digests
          </h2>
          {digests.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-sans text-sm">
              No digests yet. Hit &quot;Send digest now&quot; to get your first one.
            </div>
          ) : (
            <div className="space-y-3">
              {digests.map(d => <DigestCard key={d.id} digest={d} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
