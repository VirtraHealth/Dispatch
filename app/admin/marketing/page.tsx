'use client'

import { useState } from 'react'

type Segment = 'all' | 'active' | 'trialing' | 'canceled'

const SEGMENTS: { value: Segment; label: string }[] = [
  { value: 'all', label: 'All users' },
  { value: 'active', label: 'Active' },
  { value: 'trialing', label: 'Trialing' },
  { value: 'canceled', label: 'Canceled' },
]

export default function AdminMarketingPage() {
  const [segment, setSegment] = useState<Segment>('all')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)
  const [error, setError] = useState('')

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      setError('Subject and body are required.')
      return
    }

    const confirmed = window.confirm(
      `Send to segment "${segment}"?\n\nSubject: ${subject}\n\nThis will send a real email. Continue?`
    )
    if (!confirmed) return

    setSending(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/admin/marketing/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segment, subject, body }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to send.')
      } else {
        setResult(data)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink mb-6">Marketing</h1>

      <div className="max-w-2xl bg-white rounded-2xl border border-gray-100 p-6 space-y-5">

        {/* Segment */}
        <div>
          <label className="block font-sans text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">
            Recipients
          </label>
          <div className="flex gap-2 flex-wrap">
            {SEGMENTS.map(s => (
              <button
                key={s.value}
                onClick={() => setSegment(s.value)}
                className={`font-sans text-sm px-4 py-1.5 rounded-full border transition-colors ${
                  segment === s.value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block font-sans text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Email subject line"
            className="w-full font-sans text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 placeholder-gray-300"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block font-sans text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">
            Body
          </label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write your email here. Line breaks will be preserved."
            rows={10}
            className="w-full font-sans text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 placeholder-gray-300 resize-y leading-relaxed"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 font-sans">{error}</p>
        )}

        {result && (
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 font-sans text-sm text-green-700">
            Sent to {result.sent} recipient{result.sent !== 1 ? 's' : ''}.
            {result.failed > 0 && ` ${result.failed} failed.`}
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={sending}
          className="w-full font-sans text-sm font-semibold bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? 'Sending…' : 'Send email'}
        </button>
      </div>
    </div>
  )
}
