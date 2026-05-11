'use client'

import { useState } from 'react'

const OPTIONS = [
  { value: 'perfect', label: 'This was perfect' },
  { value: 'longer', label: 'Make it longer' },
  { value: 'shorter', label: 'Make it shorter' },
  { value: 'more_philosophy', label: 'More philosophy' },
  { value: 'more_business', label: 'More business' },
  { value: 'more_questions', label: 'More questions' },
  { value: 'different_tone', label: 'Different tone' },
  { value: 'other', label: 'Other' },
]

const LABELS: Record<string, string> = {
  perfect: 'This was perfect',
  longer: 'Make it longer',
  shorter: 'Make it shorter',
  more_philosophy: 'More philosophy',
  more_business: 'More business',
  more_questions: 'More questions',
  different_tone: 'Different tone',
}

interface DigestFeedbackProps {
  digestId: string
  existingFeedback?: string | null
}

export function DigestFeedback({ digestId, existingFeedback }: DigestFeedbackProps) {
  const [selected, setSelected] = useState('')
  const [otherText, setOtherText] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(!!existingFeedback)
  const [savedText, setSavedText] = useState(existingFeedback || '')

  async function handleSave() {
    const feedback = selected === 'other' ? otherText.trim() : selected
    if (!feedback) return

    setSaving(true)
    try {
      await fetch(`/api/digest/${digestId}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      })
      setSavedText(feedback)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  if (saved) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-gray-400 font-sans mb-1">
              Your feedback
            </div>
            <div className="text-sm text-gray-600 font-sans">
              {LABELS[savedText] || savedText}
            </div>
          </div>
          <button
            onClick={() => { setSaved(false); setSelected(''); setOtherText('') }}
            className="text-xs text-indigo-500 hover:text-indigo-600 font-sans"
          >
            Change
          </button>
        </div>
        <p className="text-xs text-gray-400 font-sans mt-2">
          Claude will apply this to your next digest.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <div className="text-xs font-bold tracking-widest uppercase text-gray-400 font-sans mb-4">
        How was this digest?
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setSelected(opt.value)}
            className={`text-sm px-3.5 py-2 rounded-lg font-sans border transition-colors ${
              selected === opt.value
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {selected === 'other' && (
        <textarea
          value={otherText}
          onChange={e => setOtherText(e.target.value)}
          rows={3}
          placeholder="Tell Claude what you'd like to see differently in future digests…"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans leading-relaxed focus:outline-none focus:border-indigo-400 resize-none mb-3"
          autoFocus
        />
      )}

      {selected && (
        <button
          onClick={handleSave}
          disabled={saving || (selected === 'other' && !otherText.trim())}
          className="text-sm bg-ink text-white px-5 py-2.5 rounded-lg font-sans font-semibold hover:bg-gray-800 disabled:opacity-40 transition-colors"
        >
          {saving ? 'Saving…' : 'Save feedback'}
        </button>
      )}
    </div>
  )
}
