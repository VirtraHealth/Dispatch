'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DigestCard } from '@/components/DigestCard'
import type { Digest, UserSettings, JournalEntry } from '@/types'

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [digests, setDigests] = useState<Digest[]>([])
  const [loading, setLoading] = useState(true)
  const [instantThisWeek, setInstantThisWeek] = useState(0)
  const [sending, setSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error' | 'limit'>('idle')
  const [sendError, setSendError] = useState('')
  const [accessStatus, setAccessStatus] = useState<{ active: boolean; trialing: boolean; daysLeft: number; isAdmin: boolean } | null>(null)
  const isAdmin = accessStatus?.isAdmin ?? false
  const [subscribing, setSubscribing] = useState(false)

  // Journal
  const [journalText, setJournalText] = useState('')
  const [journalSaving, setJournalSaving] = useState(false)
  const [journalSaved, setJournalSaved] = useState(false)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])

  // Setup section — instructions inline editing
  const [instructionsEditing, setInstructionsEditing] = useState(false)
  const [instructionsDraft, setInstructionsDraft] = useState('')
  const [instructionsSaving, setInstructionsSaving] = useState(false)

  // Setup section — context inline editing
  const [contextEditing, setContextEditing] = useState(false)
  const [contextDraft, setContextDraft] = useState('')
  const [contextSaving, setContextSaving] = useState(false)

  // Feature request
  const [featureText, setFeatureText] = useState('')
  const [featureSending, setFeatureSending] = useState(false)
  const [featureStatus, setFeatureStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    Promise.all([
      fetch('/api/user/settings').then(r => r.json()),
      fetch('/api/digest/history').then(r => r.json()),
      fetch('/api/billing/status').then(r => r.json()),
      fetch('/api/journal/entries').then(r => r.json()),
    ]).then(([settingsData, historyData, billingData, journalData]) => {
      if (settingsData.settings) {
        setSettings(settingsData.settings)
        setInstructionsDraft(settingsData.settings.personal_instructions || '')
        setContextDraft(settingsData.settings.onboarding_context || '')
      } else {
        router.replace('/onboarding')
      }
      if (historyData.digests) setDigests(historyData.digests)
      if (typeof historyData.instantThisWeek === 'number') setInstantThisWeek(historyData.instantThisWeek)
      if (billingData) setAccessStatus(billingData)
      if (journalData.entries) setJournalEntries(journalData.entries)
    }).finally(() => setLoading(false))
  }, [router])

  async function subscribe() {
    setSubscribing(true)
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setSubscribing(false)
    }
  }

  async function manageSubscription() {
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  async function sendNow() {
    setSending(true)
    setSendStatus('idle')
    setSendError('')
    try {
      const res = await fetch('/api/digest/generate', { method: 'POST' })
      if (res.ok) {
        setSendStatus('success')
        const data = await fetch('/api/digest/history').then(r => r.json())
        if (data.digests) setDigests(data.digests)
        if (typeof data.instantThisWeek === 'number') setInstantThisWeek(data.instantThisWeek)
      } else if (res.status === 429) {
        setSendStatus('limit')
      } else {
        const data = await res.json().catch(() => ({}))
        setSendError(data.error || 'Something went wrong. Try again.')
        setSendStatus('error')
      }
    } catch {
      setSendError('Connection error. Please try again.')
      setSendStatus('error')
    } finally {
      setSending(false)
      setTimeout(() => { setSendStatus('idle'); setSendError('') }, 4000)
    }
  }

  async function saveJournalEntry() {
    if (!journalText.trim() || journalSaving) return
    setJournalSaving(true)
    try {
      const res = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: journalText }),
      })
      if (res.ok) {
        const { entry } = await res.json()
        setJournalEntries(prev => [entry, ...prev])
        setJournalText('')
        setJournalSaved(true)
        setTimeout(() => setJournalSaved(false), 2500)
      }
    } finally {
      setJournalSaving(false)
    }
  }

  const handleJournalKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      saveJournalEntry()
    }
  }, [journalText, journalSaving]) // eslint-disable-line react-hooks/exhaustive-deps

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

  async function saveContext() {
    if (!settings) return
    setContextSaving(true)
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
          onboarding_context: contextDraft.trim() || null,
          is_active: settings.is_active,
          personal_instructions: settings.personal_instructions,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings)
        setContextEditing(false)
      }
    } finally {
      setContextSaving(false)
    }
  }

  async function submitFeatureRequest() {
    if (!featureText.trim()) return
    setFeatureSending(true)
    setFeatureStatus('idle')
    try {
      const res = await fetch('/api/feedback/feature-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: featureText }),
      })
      if (res.ok) {
        setFeatureStatus('success')
        setFeatureText('')
        setTimeout(() => setFeatureStatus('idle'), 4000)
      } else {
        setFeatureStatus('error')
      }
    } catch {
      setFeatureStatus('error')
    } finally {
      setFeatureSending(false)
    }
  }

  function formatEntryDate(dateStr: string) {
    const d = new Date(dateStr)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    const isYesterday = d.toDateString() === new Date(now.getTime() - 86400000).toDateString()
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    if (isToday) return `Today · ${time}`
    if (isYesterday) return `Yesterday · ${time}`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` · ${time}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const canSend = !sending && !!settings?.folder_ids?.length && instantThisWeek < 4
  const sendsLeft = 4 - instantThisWeek

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">
            My Daily Journal
          </span>
          <nav className="flex items-center gap-4">
            {isAdmin && (
              <button onClick={() => router.push('/admin')} className="text-sm text-gray-400 hover:text-gray-600 font-sans transition-colors">
                Admin
              </button>
            )}
            {accessStatus?.active && !accessStatus?.trialing && (
              <button onClick={manageSubscription} className="text-sm text-gray-400 hover:text-gray-600 font-sans transition-colors">
                Billing
              </button>
            )}
            <button onClick={() => router.push('/settings')} className="text-sm text-gray-400 hover:text-gray-600 font-sans transition-colors">
              Settings
            </button>
            <span className="text-sm text-gray-300 font-sans hidden sm:block">{session?.user?.email}</span>
          </nav>
        </header>

        {/* Trial banner */}
        {accessStatus?.trialing && accessStatus?.daysLeft > 0 && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
            <p className="text-sm text-indigo-700 font-sans">
              {accessStatus.daysLeft === 1
                ? 'Last day of your free trial'
                : `${accessStatus.daysLeft} days left in your free trial`}
            </p>
            <button
              onClick={subscribe}
              disabled={subscribing}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 font-sans disabled:opacity-50"
            >
              {subscribing ? 'Loading…' : 'Subscribe — $4.99/mo'}
            </button>
          </div>
        )}

        {/* Paywall */}
        {accessStatus && !accessStatus.active && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-8 text-center">
            <h2 className="font-serif text-2xl text-ink mb-2">Your trial has ended</h2>
            <p className="text-gray-500 font-sans text-sm mb-6 leading-relaxed">
              Your daily digest is paused. Subscribe to keep your thinking sharp every morning.
            </p>
            <button
              onClick={subscribe}
              disabled={subscribing}
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-sm font-semibold font-sans hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {subscribing ? 'Loading…' : 'Resume my digest — $4.99/mo'}
            </button>
            <p className="text-xs text-gray-400 font-sans mt-3">Cancel anytime.</p>
          </div>
        )}

        {/* ─── WRITE ─── */}
        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 font-sans mb-3">
            Write
          </h2>
          <div className={`bg-white rounded-xl border transition-colors ${journalSaved ? 'border-green-200' : 'border-gray-100'}`}>
            <textarea
              value={journalText}
              onChange={e => setJournalText(e.target.value)}
              onKeyDown={handleJournalKeyDown}
              rows={5}
              placeholder="What's on your mind today? Observations, ideas, questions, anything…"
              className="w-full px-5 pt-5 pb-3 text-sm font-sans text-gray-700 leading-relaxed focus:outline-none bg-transparent resize-none rounded-xl placeholder-gray-300"
            />
            <div className="flex items-center justify-between px-5 pb-4">
              <span className="text-xs text-gray-300 font-sans">
                {journalSaved
                  ? <span className="text-green-500">Saved to your notes</span>
                  : journalText.length > 0
                    ? <span>⌘↵ to save</span>
                    : 'Claude reads these with your digest'}
              </span>
              <button
                onClick={saveJournalEntry}
                disabled={!journalText.trim() || journalSaving}
                className="text-xs font-semibold font-sans bg-ink text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {journalSaving ? 'Saving…' : 'Save entry'}
              </button>
            </div>
          </div>

          {/* Recent entries */}
          {journalEntries.length > 0 && (
            <div className="mt-3 space-y-2">
              {journalEntries.slice(0, 5).map(entry => (
                <div key={entry.id} className="bg-white/60 rounded-lg border border-gray-50 px-4 py-3">
                  <div className="text-xs text-gray-400 font-sans mb-1">{formatEntryDate(entry.created_at)}</div>
                  <p className="text-sm text-gray-600 font-sans leading-relaxed line-clamp-2">{entry.content}</p>
                </div>
              ))}
              {journalEntries.length > 5 && (
                <p className="text-xs text-gray-400 font-sans text-center pt-1">
                  {journalEntries.length - 5} older {journalEntries.length - 5 === 1 ? 'entry' : 'entries'} not shown
                </p>
              )}
            </div>
          )}
        </section>

        {/* ─── DIGEST ─── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 font-sans">
              Your digests
            </h2>
            <div className="flex items-center gap-3">
              {sendStatus === 'success' && (
                <span className="text-xs text-green-600 font-sans">Sent. Check your inbox.</span>
              )}
              {sendStatus === 'error' && (
                <span className="text-xs text-red-500 font-sans">{sendError || 'Something went wrong.'}</span>
              )}
              {sendStatus === 'limit' && (
                <span className="text-xs text-amber-600 font-sans">Weekly limit reached.</span>
              )}
              <button
                onClick={sendNow}
                disabled={!canSend}
                title={!settings?.folder_ids?.length ? 'Add a folder first' : instantThisWeek >= 4 ? 'Weekly limit reached' : ''}
                className="text-xs font-semibold font-sans bg-ink text-white px-3.5 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? 'Generating…' : 'Send now'}
              </button>
            </div>
          </div>

          {!sending && sendStatus === 'idle' && (
            <p className="text-xs text-gray-400 font-sans mb-4 -mt-2">
              {instantThisWeek >= 4
                ? 'Weekly instant limit reached — resets in 7 days'
                : `${sendsLeft} instant send${sendsLeft === 1 ? '' : 's'} remaining this week · Arrives at 8 AM Pacific`}
            </p>
          )}

          {digests.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 px-6 py-12 text-center">
              <p className="text-sm text-gray-400 font-sans">
                No digests yet.{' '}
                {settings?.folder_ids?.length
                  ? 'Hit "Send now" to get your first one.'
                  : 'Add a Google Drive folder below first.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {digests.map(d => <DigestCard key={d.id} digest={d} />)}
            </div>
          )}
        </section>

        {/* ─── SETUP ─── */}
        <section className="border-t border-gray-100 pt-10 mb-10">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 font-sans mb-4">
            Your setup
          </h2>

          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">

            {/* Folders */}
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-400 font-sans">Reading from</span>
                <button
                  onClick={() => router.push('/settings')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-sans font-semibold"
                >
                  {settings?.folder_names?.length ? 'Edit' : 'Add folders'}
                </button>
              </div>
              {settings?.folder_names?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {settings.folder_names.map((name, i) => (
                    <a
                      key={i}
                      href={`https://drive.google.com/drive/folders/${settings.folder_ids?.[i] || ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs bg-gray-50 border border-gray-100 rounded-md px-2.5 py-1.5 text-gray-600 font-sans hover:border-indigo-200 hover:text-indigo-700 transition-colors"
                    >
                      <svg className="w-3 h-3 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                      </svg>
                      {name}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 font-sans italic">No folders connected — Claude needs at least one to read from.</p>
              )}
            </div>

            {/* Instructions */}
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-400 font-sans">Instructions for Claude</span>
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
                <>
                  <textarea
                    value={instructionsDraft}
                    onChange={e => setInstructionsDraft(e.target.value)}
                    rows={3}
                    autoFocus
                    placeholder="Guide Claude on tone, focus, length… e.g. Go deeper on philosophy. Push back harder on my assumptions."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-400 resize-none bg-gray-50"
                  />
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={saveInstructions}
                      disabled={instructionsSaving}
                      className="text-xs bg-ink text-white px-3 py-1.5 rounded-lg font-sans font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                      {instructionsSaving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setInstructionsEditing(false); setInstructionsDraft(settings?.personal_instructions || '') }}
                      className="text-xs text-gray-400 hover:text-gray-600 font-sans"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p className={`text-sm font-sans leading-relaxed ${settings?.personal_instructions ? 'text-gray-600' : 'text-gray-300 italic'}`}>
                  {settings?.personal_instructions || 'None — Claude will use its best judgement.'}
                </p>
              )}
            </div>

            {/* Context */}
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-400 font-sans">Your context</span>
                {!contextEditing && (
                  <button
                    onClick={() => setContextEditing(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-sans font-semibold"
                  >
                    {settings?.onboarding_context ? 'Edit' : 'Add'}
                  </button>
                )}
              </div>
              {contextEditing ? (
                <>
                  <textarea
                    value={contextDraft}
                    onChange={e => setContextDraft(e.target.value)}
                    rows={3}
                    autoFocus
                    placeholder="What are you working on? What questions keep coming up? What do you want Claude to understand about you?"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-400 resize-none bg-gray-50"
                  />
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={saveContext}
                      disabled={contextSaving}
                      className="text-xs bg-ink text-white px-3 py-1.5 rounded-lg font-sans font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                      {contextSaving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setContextEditing(false); setContextDraft(settings?.onboarding_context || '') }}
                      className="text-xs text-gray-400 hover:text-gray-600 font-sans"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p className={`text-sm font-sans leading-relaxed ${settings?.onboarding_context ? 'text-gray-600' : 'text-gray-300 italic'}`}>
                  {settings?.onboarding_context || 'No context yet — tell Claude what you\'re working on.'}
                </p>
              )}
            </div>

          </div>
        </section>

        {/* ─── FEATURE REQUEST ─── */}
        <div className="border-t border-gray-100 pt-8 pb-6">
          <p className="text-xs text-gray-400 font-sans mb-3">Have a feature idea or feedback?</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={featureText}
              onChange={e => setFeatureText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitFeatureRequest() }}
              placeholder="What would make this better?"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-indigo-400"
            />
            <button
              onClick={submitFeatureRequest}
              disabled={featureSending || !featureText.trim()}
              className="text-sm font-semibold font-sans text-gray-500 hover:text-gray-700 px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {featureSending ? '…' : 'Send'}
            </button>
          </div>
          {featureStatus === 'success' && <p className="text-xs text-green-600 font-sans mt-2">Thanks — we&apos;ll look at this.</p>}
          {featureStatus === 'error' && <p className="text-xs text-red-500 font-sans mt-2">Couldn&apos;t send. Try again.</p>}
        </div>

      </div>
    </div>
  )
}
