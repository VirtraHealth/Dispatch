'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = 'landing' | 'persona' | 'topic' | 'thought' | 'generating' | 'briefing' | 'capture' | 'success'

type PersonaDef = { id: string; label: string; symbol: string; desc: string }
type DemoResult = { subject: string; body: string; sessionId: string | null }

// ── Design tokens ─────────────────────────────────────────────────────────────

const C = {
  bg: '#0c0a08',
  surface: '#181310',
  surfaceHover: '#201a14',
  border: 'rgba(240, 228, 200, 0.07)',
  borderHover: 'rgba(200, 169, 110, 0.35)',
  borderFocus: 'rgba(200, 169, 110, 0.6)',
  text: '#ede8da',
  muted: '#8a7d6b',
  faint: '#352d22',
  gold: '#c8a96e',
  goldBright: '#dfc08a',
}

// ── Data ──────────────────────────────────────────────────────────────────────

const PERSONAS: PersonaDef[] = [
  { id: 'founder', label: 'Founder', symbol: '⌘', desc: 'Building something from nothing' },
  { id: 'philosopher', label: 'Philosopher', symbol: '∞', desc: 'Ideas and their implications' },
  { id: 'writer', label: 'Writer', symbol: '"', desc: 'Craft, voice, and the page' },
  { id: 'student', label: 'Student', symbol: '◎', desc: 'Learning and connecting ideas' },
  { id: 'designer', label: 'Designer', symbol: '◈', desc: 'Form, function, and feeling' },
  { id: 'strategist', label: 'Strategist', symbol: '◇', desc: 'Systems and decisions' },
]

const TOPICS: Record<string, string[]> = {
  founder: [
    'The right problem to solve',
    'Building a team that lasts',
    'Growing without losing what matters',
    'Making decisions with incomplete information',
    'What I actually believe about this market',
  ],
  philosopher: [
    'A contradiction I cannot resolve',
    'What I believe and why I believe it',
    'The nature of consciousness or language',
    'Ethics and what we owe each other',
    'The limits of what can be known',
  ],
  writer: [
    'What I am actually trying to say',
    'Finding and keeping my voice',
    'Structure, form, and what they mean',
    'What I am reading and how it is changing me',
    'The story I keep coming back to',
  ],
  student: [
    'Something I am struggling to understand',
    'Two ideas I have been learning that might connect',
    'A thesis or argument I am developing',
    'Why this subject matters to me',
    'What I do not understand yet',
  ],
  designer: [
    'Why something I made feels wrong',
    'What makes something feel right',
    'A problem I cannot solve',
    'The gap between my vision and execution',
    'Systems and how they fail',
  ],
  strategist: [
    'Where I think value is being created',
    'A contrarian view I hold',
    'Risk and how to think about it',
    'A mental model I am testing',
    'Long-term vs. short-term thinking',
  ],
}

const PLACEHOLDERS: Record<string, string> = {
  founder: 'e.g. I keep building features when I should be talking to customers. I know this — and I keep doing it anyway. I think I am afraid of what I will hear.',
  philosopher: 'e.g. I have been thinking about whether attention is a moral act — whether what we choose to notice is itself an ethical choice. I cannot find the counterargument.',
  writer: 'e.g. I have a character who does something I find hard to understand, and I think that is why I keep writing her. I do not understand myself when I am her.',
  student: 'e.g. I am trying to understand why velocity of money mattered so much to Keynes, and I think it connects to something in network theory — but I cannot find the bridge.',
  designer: 'e.g. The prototype works but it does not feel right. I can measure everything about it. I cannot articulate what is wrong.',
  strategist: 'e.g. I think the consensus view on this sector is wrong in a specific way. Too focused on unit economics, not enough on network effects that compound over time.',
}

const LOADING_STEPS = [
  'Reading what you wrote…',
  'Tracing the thread…',
  'Finding the tradition…',
  'Writing your briefing…',
]

// ── Briefing renderer ─────────────────────────────────────────────────────────

function BriefingRenderer({ body }: { body: string }) {
  const headerRegex = /^\*\*([^*\n]+)\*\*\s*$/gm
  type Pos = { header: string; index: number; end: number }
  const positions: Pos[] = []
  let m
  const re = new RegExp(headerRegex.source, headerRegex.flags)
  while ((m = re.exec(body)) !== null) {
    positions.push({ header: m[1].trim(), index: m.index, end: m.index + m[0].length })
  }

  if (positions.length === 0) {
    return (
      <>{body.split('\n\n').filter(Boolean).map((p, i) => (
        <p key={i} style={{ fontSize: 15, lineHeight: 1.9, color: '#1a1a2e', marginBottom: 20 }}>{p}</p>
      ))}</>
    )
  }

  const preamble = positions[0].index > 0 ? body.slice(0, positions[0].index).trim() : ''
  const sections = positions.map((pos, i) => {
    const start = pos.end
    const end = i + 1 < positions.length ? positions[i + 1].index : body.length
    return {
      header: pos.header,
      paragraphs: body.slice(start, end).trim().split(/\n\n+/).filter(p => p.trim()),
    }
  })

  return (
    <>
      {preamble && (
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#555', marginBottom: 28, fontStyle: 'italic' }}>{preamble}</p>
      )}
      {sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: '-apple-system, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#4a3f8f', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #eeedfe' }}>
            {s.header}
          </div>
          {s.paragraphs.map((p, j) => (
            <p key={j} style={{ fontSize: 15, lineHeight: 1.9, color: '#1a1a2e', margin: '0 0 18px' }}>{p}</p>
          ))}
        </div>
      ))}
    </>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

function JoinPageInner() {
  const searchParams = useSearchParams()
  const source = searchParams.get('ref') || searchParams.get('utm_source') || null

  const [step, setStep] = useState<Step>('landing')
  const [persona, setPersona] = useState('')
  const [topic, setTopic] = useState('')
  const [thought, setThought] = useState('')
  const [demo, setDemo] = useState<DemoResult | null>(null)
  const [alreadyUsed, setAlreadyUsed] = useState(false)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [claimStatus, setClaimStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [claimError, setClaimError] = useState('')

  // Cycle loading messages
  useEffect(() => {
    if (step !== 'generating') return
    const t = setInterval(() => setLoadingMsgIdx(i => (i + 1) % LOADING_STEPS.length), 1900)
    return () => clearInterval(t)
  }, [step])

  async function generate() {
    setStep('generating')
    setLoadingMsgIdx(0)
    try {
      const res = await fetch('/api/demo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona, topic, thought, source }),
      })
      if (res.status === 429) {
        setAlreadyUsed(true)
        setStep('briefing')
        return
      }
      if (!res.ok) {
        setStep('thought')
        return
      }
      const data = await res.json()
      setDemo(data)
      if (typeof window !== 'undefined') localStorage.setItem('mdj_demo_done', '1')
      setStep('briefing')
    } catch {
      setStep('thought')
    }
  }

  async function claim() {
    if (!email.trim() || claimStatus === 'loading') return
    setClaimStatus('loading')
    setClaimError('')
    try {
      const res = await fetch('/api/demo/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, sessionId: demo?.sessionId, source }),
      })
      if (res.ok) {
        setStep('success')
      } else {
        const d = await res.json().catch(() => ({}))
        setClaimError(d.error || 'Something went wrong. Try again.')
        setClaimStatus('error')
      }
    } catch {
      setClaimError('Connection error. Try again.')
      setClaimStatus('error')
    }
  }

  // ── Shared ──────────────────────────────────────────────────────────────────

  const backBtn = (to: Step, label = '← back') => (
    <button
      onClick={() => setStep(to)}
      style={{ color: C.faint, fontFamily: '-apple-system, sans-serif', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 40, display: 'block' }}
    >
      {label}
    </button>
  )

  // ── Steps ────────────────────────────────────────────────────────────────────

  const stepContent: Record<Step, React.ReactNode> = {

    landing: (
      <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto', padding: '80px 24px 60px' }}>
        <div style={{ color: C.gold, fontFamily: '-apple-system, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 40 }}>
          My Daily Journal
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(44px, 9vw, 72px)', fontWeight: 400, color: C.text, lineHeight: 1.1, marginBottom: 28, letterSpacing: '-0.5px' }}>
          Your thinking,<br />amplified.
        </h1>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 17, color: C.muted, lineHeight: 1.75, maxWidth: 380, margin: '0 auto 56px' }}>
          Connect your notes. Every morning, Claude reads everything you wrote and writes back — a briefing that pushes your thinking forward.
        </p>
        <button
          onClick={() => setStep('persona')}
          style={{ background: C.gold, color: '#0c0a08', fontFamily: '-apple-system, sans-serif', fontSize: 15, fontWeight: 700, padding: '17px 44px', borderRadius: 12, border: 'none', cursor: 'pointer', letterSpacing: 0.5 }}
        >
          See what it feels like →
        </button>
        <div style={{ marginTop: 14, fontFamily: '-apple-system, sans-serif', fontSize: 12, color: C.faint }}>
          Live demo powered by Claude · 30 seconds
        </div>
        <div style={{ marginTop: 64, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {['Reads your actual notes', 'Arrives at 8 AM daily', '7-day free trial'].map(f => (
            <div key={f} style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12, color: C.faint, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: C.gold }}>·</span> {f}
            </div>
          ))}
        </div>
      </div>
    ),

    persona: (
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px 60px' }}>
        {backBtn('landing')}
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 34, color: C.text, marginBottom: 8, fontWeight: 400 }}>Who are you?</h2>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 14, color: C.muted, marginBottom: 36 }}>This shapes how the briefing reads.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {PERSONAS.map(p => (
            <button
              key={p.id}
              onClick={() => { setPersona(p.id); setStep('topic') }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '22px 18px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = C.borderHover; el.style.background = C.surfaceHover }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = C.border; el.style.background = C.surface }}
            >
              <div style={{ fontSize: 22, marginBottom: 10, color: C.gold, fontFamily: 'Georgia, serif' }}>{p.symbol}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: C.text, marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12, color: C.muted, lineHeight: 1.45 }}>{p.desc}</div>
            </button>
          ))}
        </div>
      </div>
    ),

    topic: (
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px 60px' }}>
        {backBtn('persona')}
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 34, color: C.text, marginBottom: 8, fontWeight: 400 }}>What&apos;s on your mind?</h2>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 14, color: C.muted, marginBottom: 36 }}>Pick what feels most alive right now.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(TOPICS[persona] || []).map(t => (
            <button
              key={t}
              onClick={() => { setTopic(t); setStep('thought') }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 20px', textAlign: 'left', fontFamily: 'Georgia, serif', fontSize: 15, color: C.text, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = C.borderHover; el.style.color = C.goldBright; el.style.background = C.surfaceHover }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = C.border; el.style.color = C.text; el.style.background = C.surface }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    ),

    thought: (
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px 60px' }}>
        {backBtn('topic')}
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 34, color: C.text, marginBottom: 8, fontWeight: 400 }}>In your own words…</h2>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 14, color: C.muted, marginBottom: 6, lineHeight: 1.6 }}>
          Write it like a journal entry. The more specific, the better the briefing.
        </p>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12, color: C.faint, marginBottom: 28 }}>
          On: <span style={{ color: C.muted }}>{topic}</span>
        </p>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
          <textarea
            value={thought}
            onChange={e => setThought(e.target.value.slice(0, 400))}
            placeholder={PLACEHOLDERS[persona] || 'Write what is actually on your mind…'}
            rows={7}
            autoFocus
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', padding: '22px 22px 10px', fontFamily: 'Georgia, serif', fontSize: 15, color: C.text, lineHeight: 1.75, resize: 'none', boxSizing: 'border-box' }}
          />
          <div style={{ padding: '0 22px 16px', display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: '-apple-system, sans-serif', fontSize: 11, color: thought.length > 340 ? C.gold : C.faint }}>
              {thought.length}/400
            </span>
          </div>
        </div>
        <button
          onClick={generate}
          disabled={thought.trim().length < 20}
          style={{ width: '100%', background: thought.trim().length >= 20 ? C.gold : C.faint, color: thought.trim().length >= 20 ? '#0c0a08' : C.muted, fontFamily: '-apple-system, sans-serif', fontSize: 15, fontWeight: 700, padding: '17px', borderRadius: 12, border: 'none', cursor: thought.trim().length >= 20 ? 'pointer' : 'not-allowed', transition: 'all 0.2s', letterSpacing: 0.5 }}
        >
          Generate my briefing →
        </button>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 11, color: C.faint, textAlign: 'center', marginTop: 10 }}>
          Powered by Claude · Usually takes 10–20 seconds
        </p>
      </div>
    ),

    generating: (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: `2px solid ${C.faint}`, borderTopColor: C.gold, animation: 'spin 1.2s linear infinite', marginBottom: 40 }} />
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: C.text, fontWeight: 400, marginBottom: 12 }}>
          {LOADING_STEPS[loadingMsgIdx]}
        </p>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 13, color: C.faint }}>
          On: <span style={{ color: C.muted }}>{topic}</span>
        </p>
      </div>
    ),

    briefing: alreadyUsed ? (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 30, color: C.text, marginBottom: 16, fontWeight: 400 }}>
          You&apos;ve already seen the demo.
        </p>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 15, color: C.muted, marginBottom: 40, lineHeight: 1.7 }}>
          Ready to start with your real notes?
        </p>
        <Link href="/" style={{ display: 'inline-block', background: C.gold, color: '#0c0a08', fontFamily: '-apple-system, sans-serif', fontSize: 15, fontWeight: 700, padding: '15px 36px', borderRadius: 12, textDecoration: 'none' }}>
          Start free trial →
        </Link>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12, color: C.faint, marginTop: 10 }}>7 days free · No credit card required</p>
      </div>
    ) : demo ? (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px 60px' }}>

        {/* Email mockup */}
        <div style={{ background: '#f8f7f3', borderRadius: 16, overflow: 'hidden', boxShadow: '0 32px 100px rgba(0,0,0,0.7)' }}>

          {/* Traffic lights */}
          <div style={{ background: '#e4e0d8', padding: '11px 18px', display: 'flex', alignItems: 'center', gap: 7 }}>
            {['#ff6159', '#ffbc30', '#29c940'].map((c, i) => (
              <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
            ))}
          </div>

          {/* Email header */}
          <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid #e0ddd4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#4a3f8f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontFamily: '-apple-system, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>MDJ</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: '-apple-system, sans-serif', fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>My Daily Journal</div>
                <div style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12, color: '#aaa' }}>digest@mydailyjournal.net → you</div>
              </div>
              <div style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12, color: '#bbb', flexShrink: 0 }}>
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1a1a2e', fontWeight: 400, lineHeight: 1.35 }}>{demo.subject}</div>
          </div>

          {/* Body */}
          <div style={{ padding: '36px 32px 44px' }}>
            <BriefingRenderer body={demo.body} />
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 56, padding: '0 16px' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: C.text, marginBottom: 10, fontWeight: 400 }}>
            This is what you&apos;d wake up to every morning.
          </p>
          <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 36 }}>
            Connect your actual notes and Claude reads everything you write.<br />
            A personalized briefing arrives at 8 AM, built from what you&apos;ve been thinking about.
          </p>
          <button
            onClick={() => setStep('capture')}
            style={{ background: C.gold, color: '#0c0a08', fontFamily: '-apple-system, sans-serif', fontSize: 16, fontWeight: 700, padding: '18px 52px', borderRadius: 14, border: 'none', cursor: 'pointer', letterSpacing: 0.5 }}
          >
            Get mine — it&apos;s free →
          </button>
          <div style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12, color: C.faint, marginTop: 12 }}>
            7-day free trial · No credit card required
          </div>
        </div>
      </div>
    ) : null,

    capture: (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px 60px' }}>
        {backBtn('briefing', '← back to briefing')}
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 34, color: C.text, marginBottom: 10, fontWeight: 400 }}>
          Where should we send yours?
        </h2>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 40 }}>
          Your first email from us will be this briefing — written from what you shared. Tomorrow morning, you&apos;d get one built from your actual notes.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ fontFamily: '-apple-system, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>
              First name <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 18px', fontFamily: 'Georgia, serif', fontSize: 15, color: C.text, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              onFocus={e => { e.currentTarget.style.borderColor = C.borderFocus }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border }}
            />
          </div>
          <div>
            <label style={{ fontFamily: '-apple-system, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 8 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') claim() }}
              placeholder="you@example.com"
              autoFocus
              style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 18px', fontFamily: 'Georgia, serif', fontSize: 15, color: C.text, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              onFocus={e => { e.currentTarget.style.borderColor = C.borderFocus }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border }}
            />
          </div>
        </div>

        {claimError && (
          <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 13, color: '#e05757', marginBottom: 14 }}>{claimError}</p>
        )}

        <button
          onClick={claim}
          disabled={!email.trim() || claimStatus === 'loading'}
          style={{ width: '100%', background: email.trim() ? C.gold : C.faint, color: email.trim() ? '#0c0a08' : C.muted, fontFamily: '-apple-system, sans-serif', fontSize: 15, fontWeight: 700, padding: '17px', borderRadius: 12, border: 'none', cursor: email.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s', letterSpacing: 0.5 }}
        >
          {claimStatus === 'loading' ? 'Sending…' : 'Send me my briefing →'}
        </button>

        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 11, color: C.faint, textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
          No spam. You can also{' '}
          <Link href="/" style={{ color: C.muted }}>start your free trial right now</Link>.
        </p>
      </div>
    ),

    success: (
      <div style={{ maxWidth: 460, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', border: `1px solid ${C.gold}`, background: 'rgba(200, 169, 110, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 36px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 38, color: C.text, marginBottom: 14, fontWeight: 400, lineHeight: 1.2 }}>
          Check your inbox.
        </h2>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 15, color: C.muted, lineHeight: 1.75, marginBottom: 52 }}>
          Your briefing is already there. That&apos;s what every morning would look like — except built from your actual notes, your actual thinking.
        </p>
        <Link href="/" style={{ display: 'inline-block', background: C.gold, color: '#0c0a08', fontFamily: '-apple-system, sans-serif', fontSize: 15, fontWeight: 700, padding: '16px 44px', borderRadius: 12, textDecoration: 'none', letterSpacing: 0.5 }}>
          Start my free trial →
        </Link>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12, color: C.faint, marginTop: 12 }}>
          7 days free · $4.99/mo after · Cancel anytime
        </p>
      </div>
    ),
  }

  const showProgress = ['persona', 'topic', 'thought'].includes(step)
  const progressSteps = ['persona', 'topic', 'thought']

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>

      {/* Nav */}
      {step !== 'generating' && (
        <nav style={{ borderBottom: `1px solid ${C.border}`, padding: '15px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setStep('landing')}
            style={{ fontFamily: '-apple-system, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: C.gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            My Daily Journal
          </button>
          <Link href="/" style={{ fontFamily: '-apple-system, sans-serif', fontSize: 13, color: C.muted, textDecoration: 'none' }}>
            Sign in →
          </Link>
        </nav>
      )}

      {/* Progress dots */}
      {showProgress && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, paddingTop: 28 }}>
          {progressSteps.map(s => (
            <div key={s} style={{ width: 6, height: 6, borderRadius: '50%', background: s === step ? C.gold : C.faint, transition: 'background 0.25s' }} />
          ))}
        </div>
      )}

      {/* Step content */}
      <div key={step} style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
        {stepContent[step]}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::placeholder { color: ${C.faint} !important; opacity: 1; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
      `}</style>
    </div>
  )
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinPageInner />
    </Suspense>
  )
}
