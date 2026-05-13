import Link from 'next/link'
import type { Metadata } from 'next'
import { LandingCTA } from '@/components/LandingCTA'

export const metadata: Metadata = {
  title: 'My Daily Journal for Founders — Turn Your Notes Into Strategic Intelligence',
  description: 'Every morning, Claude reads your thinking, finds the patterns, surfaces the market analogs, and sends you the strategic briefing your notes were always trying to become.',
}

const DIGEST = {
  date: 'Monday, May 12, 2025',
  folders: 'Strategy · Notes · Investor Updates',
  sections: [
    {
      header: 'THE STRATEGIC QUESTION',
      content: `You've circled pricing psychology six times across your last three weeks of notes. Each time you approach it from a different angle — willingness to pay, competitive anchoring, value-based vs. cost-plus — but you keep arriving at the same impasse. Here's what the notes are actually pointing toward: you're not solving a pricing problem. You're solving a *perceived switching cost* problem.

The reason customers balk at your current price isn't the number. It's that the cost of leaving their current solution feels invisible to them right now. Peter Thiel's monopoly framework applies directly: a business with genuine pricing power is one where the *exit cost* exceeds the *entry benefit* of alternatives. Your notes from last Thursday come closest to this — "they don't know what they'd lose until it's gone" — but you haven't followed that thread yet.

Worth reading: Thiel's *Zero to One* Chapter 3 on monopoly characteristics, and Hamilton Helmer's *7 Powers* on switching costs as a structural moat.`,
    },
    {
      header: 'MARKET ANALOGS',
      content: `What you described in last Tuesday's strategy session — a marketplace where trust is the product, not the transaction — maps almost exactly onto Airbnb's inflection point in 2011. They weren't losing to hotels on price or amenities. They were losing on *anxiety*. The product breakthrough wasn't the algorithm or the photos. It was identity verification and the insurance policy that made a stranger's home feel safe enough to book.

Your notes suggest a similar pattern: users engage deeply once they're in, but acquisition stalls because the first step feels too opaque. The Airbnb analog suggests the intervention isn't marketing — it's reducing the psychological cost of the first action. What is the equivalent of "verified ID + host guarantee" in your product?

A second analog worth considering: Stripe's developer onboarding in 2012. Seven lines of code. The entire value proposition made legible in the time it took to read a README.`,
    },
    {
      header: 'WHAT TO TEST NEXT',
      content: `Your hypothesis about B2B vs. prosumer positioning has a clean experiment hiding inside it. You've written about it indirectly — the tension between "designed for teams" and "people buy it for themselves first." This is actually a well-understood pattern: Slack, Notion, Figma, Linear all started as personal tools that became team tools through bottoms-up adoption.

The experiment: run two landing pages simultaneously for 30 days. One frames the product as personal ("your notes, your intelligence"). One frames it as team infrastructure ("shared strategic memory"). Track not just conversion but *activation* — who actually connects their data and comes back the next day. The answer is probably already in your existing user base if you segment by how they signed up.

Three questions worth holding: What would you need to believe for the prosumer path to be wrong? Who is the single person at a company who would fight to keep this tool if IT tried to remove it? What does "obviously sticky" look like at 12 months?`,
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
    title: 'Pattern recognition',
    description: 'Finds what you keep returning to across weeks of thinking — the question you haven\'t named yet, the hypothesis hiding in plain sight.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Market analogs',
    description: 'Connects your specific situation to the companies and founders who\'ve solved the same structural problem before, with precision.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Decision clarity',
    description: 'Surfaces the real question underneath the question you\'ve been asking — and the experiment that would answer it in two weeks.',
  },
]

const TESTIMONIALS = [
  {
    quote: "I write every day but never had time to synthesize. The morning briefing finds the thread I was chasing all week and hands it back to me before 7am.",
    attribution: "Founder, early-stage B2B SaaS",
  },
  {
    quote: "It found a pattern across three months of strategy notes that completely changed how I was thinking about our pricing model. That one insight justified the whole thing.",
    attribution: "CEO, Series A company",
  },
  {
    quote: "I stopped using Notion for strategy because nothing ever connected. This reads everything and tells me what I'm actually thinking.",
    attribution: "Solo founder, consumer app",
  },
]

export default function FoundersPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors">
          My Daily Journal
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/about" className="text-sm font-sans text-gray-500 hover:text-gray-700 transition-colors">About</Link>
          <LandingCTA variant="nav" />
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-block text-xs font-sans font-semibold tracking-widest uppercase text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full mb-8">
          For founders
        </div>
        <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-6">
          Turn your notes into strategic intelligence.
        </h1>
        <p className="text-lg text-gray-500 font-sans leading-relaxed max-w-xl mx-auto mb-10">
          Every morning, Claude reads your thinking, finds the patterns, surfaces the market analogs, and sends you the strategic briefing your notes were always trying to become.
        </p>
        <LandingCTA variant="hero" />
        <p className="text-xs text-gray-400 mt-4 font-sans">
          7-day free trial · No credit card · Your docs stay private
        </p>
      </section>

      {/* Feature callouts */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
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
          <h2 className="font-serif text-3xl text-ink mb-3">What a founder briefing looks like</h2>
          <p className="text-gray-500 font-sans text-base">Generated from actual strategy notes. Every briefing is unique to your thinking.</p>
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
          <h2 className="font-serif text-3xl text-ink mb-3">From founders who use it daily</h2>
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
            { step: '01', title: 'Connect your Drive', body: 'Point it at the folders where you think — strategy docs, notes, investor memos. Read-only access. Nothing is edited or deleted.' },
            { step: '02', title: 'Claude reads overnight', body: 'Every night, Claude reads everything you\'ve written, finds the patterns, and builds the connections you haven\'t made yet.' },
            { step: '03', title: 'Briefing arrives at 8am', body: 'A personalized strategic briefing lands in your inbox before your first meeting. Read it in five minutes. Think differently all day.' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="text-xs font-sans font-bold tracking-widest uppercase text-indigo-600 mb-3">{s.step}</div>
              <h3 className="font-semibold text-gray-900 font-sans mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-xl mx-auto px-6 pb-24 text-center">
        <h2 className="font-serif text-3xl text-ink mb-4">Start your founder briefing today</h2>
        <p className="text-gray-500 font-sans mb-8 leading-relaxed">
          Connect Google Drive in under two minutes. Your first briefing arrives immediately.
        </p>
        <LandingCTA variant="hero" />
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
