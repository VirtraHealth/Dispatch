'use client'

import Link from 'next/link'
import { LandingCTA } from '@/components/LandingCTA'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const DIGEST = {
  date: 'Friday, May 16, 2025',
  folders: 'Training Log · Mental Prep · Game Notes',
  sections: [
    {
      header: 'MENTAL PATTERNS',
      content: `You've written about confidence before competition eleven times across the last two months. There's a pattern in it that isn't obvious from any single entry: your confidence doesn't track your training load. It tracks your *sleep* the night before. On days when you slept fewer than six hours, every entry reads with a particular kind of heaviness — not doubt exactly, but a narrowing. The performances that followed weren't always worse. But the entries from those mornings predicted how you'd *interpret* the performance, win or lose.

This matters because you've been trying to solve a confidence problem by training harder. The data in your own notes suggests the intervention is earlier — sleep, and what you do with the two hours before it.

The sports psychology literature on pre-competition arousal regulation is directly relevant here. Hanin's Individual Zones of Optimal Functioning (IZOF) model predicts exactly this: the relationship between emotional state and performance is individual, not universal. Your optimal zone appears to be narrower than average, which is an asset once you know how to protect it.`,
    },
    {
      header: 'WHAT THE RESEARCH SAYS',
      content: `Your notes on visualization from March contain something precise. You wrote: "I don't just picture the action — I feel the weight of it, the timing, the resistance." That's not generic visualization. That's *functional equivalence* — a specific neurological phenomenon where mental rehearsal activates the same motor pathways as physical execution.

The seminal research (Jeannerod, 1994; Lotze et al., 1999) shows that detailed motor imagery — with sensory, proprioceptive, and kinesthetic components — produces measurable neural activation indistinguishable from actual movement. You've been doing this intuitively. What you haven't been doing is doing it consistently, on a schedule, with explicit pre-sleep rehearsal at full sensory resolution.

Elite coaches in precision sports now structure visualization as a technical skill with practice reps, not a vague mental activity. The entries where you describe it working best share a common feature: you wrote them the night before, not the morning of. That sequencing is deliberate, and there's now solid evidence for why it works.`,
    },
    {
      header: 'THIS WEEK\'S EDGE',
      content: `Three days before competition, your entries reliably shift tone. More negative self-assessment. More doubt about preparation. This is documented across eleven competition cycles in your logs. The pattern is so consistent it's probably physiological — pre-competition cortisol elevation is well-documented in competitive athletes and correlates with exactly the type of rumination you describe.

The counterintuitive finding from performance psychology: suppression makes it worse. Athletes who try to neutralize pre-competition anxiety perform worse than those who *channel* it. The intervention that works is *reappraisal* — reframing the arousal as preparation rather than threat. "I'm ready" and "I'm nervous" are the same physiological state with different interpretations.

Here's a specific reframe protocol used at the Olympic level: when you notice the negative self-assessment beginning (for you, that's three days out), don't counter it. Write it down in full. Then write what the same feeling looked like before your best performances. You'll find they're identical. The entries are already there. You don't need to change the feeling. You need to change what you think it means.

Three questions for this week: What does your best performance feel like in the hour before it starts? Where does confidence actually come from for you — and what's the last thing you did that gave you more of it? What would change if you treated the pre-competition anxiety as a reliable sign you care about the outcome?`,
    },
  ],
}

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Mental pattern recognition',
    description: 'Finds what you keep returning to before, during, and after performance — the patterns in your own mind that predict outcomes better than any external metric.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Performance psychology',
    description: 'Connects your personal experience to what the sports science literature actually says — not generic advice, but findings that explain what you\'re already observing in yourself.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Consistency systems',
    description: 'Builds a reflection loop that compounds over time — so every competition cycle makes you more self-aware, not just more experienced.',
  },
]

const TESTIMONIALS = [
  {
    quote: "It found a pattern in my pre-race entries that my coach never noticed. That insight changed my entire warm-up routine.",
    attribution: "Competitive swimmer, national level",
  },
  {
    quote: "I started journaling because people said to. I didn't know how to use it. Now I get a morning brief that tells me what my own writing actually means.",
    attribution: "Collegiate basketball player",
  },
  {
    quote: "The section on what my notes say about sleep and performance was more useful than anything I learned in sports psych class.",
    attribution: "High school athlete, college-bound",
  },
]

function DarkCTA() {
  const { data: session } = useSession()
  const router = useRouter()

  function handleClick() {
    if (session) {
      router.push('/dashboard')
    } else {
      signIn('google', { callbackUrl: '/auth/callback' })
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-3 bg-white text-ink px-7 py-4 rounded-xl text-sm font-semibold font-sans hover:bg-cream transition-colors shadow-sm"
    >
      {!session && (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="currentColor" opacity="0.8" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" opacity="0.8" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" opacity="0.8" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" opacity="0.8" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )}
      {session ? 'Go to dashboard →' : 'Start your free trial'}
    </button>
  )
}

export default function AthletesPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Nav — on cream */}
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors">
          My Daily Journal
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/about" className="text-sm font-sans text-gray-500 hover:text-gray-700 transition-colors">About</Link>
          <LandingCTA variant="nav" />
        </div>
      </nav>

      {/* Dark hero */}
      <div className="bg-ink">
        <section className="max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
          <div className="inline-block text-xs font-sans font-semibold tracking-widest uppercase text-white/60 bg-white/10 px-4 py-1.5 rounded-full mb-8">
            For athletes
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight mb-6">
            Train your mind like you train your body.
          </h1>
          <p className="text-lg text-white/60 font-sans leading-relaxed max-w-xl mx-auto mb-10">
            Every morning, Claude reads your training logs, performance notes, and mental prep — and sends you the briefing that closes the gap between how you&rsquo;re thinking and how you&rsquo;re competing.
          </p>
          <DarkCTA />
          <p className="text-xs text-white/30 mt-4 font-sans">
            7-day free trial · No credit card · Your docs stay private
          </p>
        </section>
      </div>

      {/* Feature callouts */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 font-sans mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Digest preview */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl text-ink mb-3">What a performance briefing looks like</h2>
          <p className="text-gray-500 font-sans text-base">Generated from actual training journals. Every briefing is built from your own patterns.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-8 py-5">
            <div className="text-xs font-sans font-bold tracking-widest uppercase text-indigo-600 mb-1">My Daily Journal</div>
            <div className="font-serif text-xl text-ink">{DIGEST.date}</div>
            <div className="text-xs text-gray-400 font-sans mt-1">Reading from: {DIGEST.folders}</div>
          </div>

          <div className="px-8 py-6 space-y-8">
            {DIGEST.sections.map((section, i) => (
              <div key={i}>
                <div className="text-xs font-sans font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
                  {section.header}
                </div>
                <div className="font-serif text-sm text-ink leading-[1.9] space-y-3">
                  {section.content.split('\n\n').map((para, j) => (
                    <p key={j} dangerouslySetInnerHTML={{ __html: para.replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl text-ink mb-3">From competitors who journal with purpose</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="font-serif text-sm text-ink leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-xs text-gray-400 font-sans uppercase tracking-wider">{t.attribution}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl text-ink mb-3">How it works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Connect your training logs', body: 'Point it at the folders where you write — training notes, mental prep, competition journals. Read-only. Nothing is edited or deleted.' },
            { step: '02', title: 'Claude finds the patterns', body: 'Overnight, Claude reads across your full history — finding the mental patterns, the performance correlations, the things your notes have been trying to tell you.' },
            { step: '03', title: 'Briefing arrives at 8am', body: 'A personalized performance briefing lands in your inbox: patterns, psychology research that connects to your experience, and a mental edge for the day ahead.' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="text-xs font-sans font-bold tracking-widest uppercase text-indigo-600 mb-3">{s.step}</div>
              <h3 className="font-semibold text-gray-900 font-sans mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dark final CTA */}
      <section className="bg-ink">
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <h2 className="font-serif text-3xl text-white mb-4">Build your mental performance system</h2>
          <p className="text-white/60 font-sans mb-8 leading-relaxed">
            Connect Google Drive in under two minutes. Your first briefing arrives the same morning.
          </p>
          <DarkCTA />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-gray-300">My Daily Journal</span>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-xs text-gray-400 font-sans hover:text-gray-600 transition-colors">About</Link>
            <Link href="/privacy" className="text-xs text-gray-400 font-sans hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-400 font-sans hover:text-gray-600 transition-colors">Terms of Service</Link>
          </div>
          <p className="text-xs text-gray-400 font-sans">Your thinking, amplified.</p>
        </div>
      </footer>
    </div>
  )
}
