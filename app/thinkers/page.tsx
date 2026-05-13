import Link from 'next/link'
import type { Metadata } from 'next'
import { LandingCTA } from '@/components/LandingCTA'

export const metadata: Metadata = {
  title: 'My Daily Journal for Thinkers — Build a Mind That Compounds',
  description: 'Every morning, Claude reads your writing, traces how your thinking has evolved, surfaces the contradictions you haven\'t resolved, and sends you the synthesis your journal was quietly building toward.',
}

const DIGEST = {
  date: 'Wednesday, May 14, 2025',
  folders: 'Philosophy · Reading Notes · Journal',
  sections: [
    {
      header: 'THE LIVE TENSION',
      content: `You've been circling the relationship between freedom and constraint for ninety days. The tension hasn't resolved — and that's not a sign you're stuck. It's a sign you're close. The most recent entries suggest you've quietly shifted from asking "what is freedom?" to asking "what kind of person is capable of it?" That's a more interesting question, and it has a much longer philosophical tradition.

The Kantian framing you haven't applied yet: freedom isn't the absence of constraint but *self-legislation* — the capacity to give yourself your own law. Autonomy, in Kant's sense, is precisely the ability to act from a principle you could will to be universal, rather than acting from desire or external pressure. What you wrote on May 9th — "I keep confusing what I want with what I think I should want" — is a description of heteronomy. You're not short on freedom. You're short on a clear enough principle to act from.

This isn't a resolution. But it reframes the problem: the question becomes less "how do I feel more free?" and more "what principle could I actually commit to?"`,
    },
    {
      header: 'THE TRADITION',
      content: `What you've been writing about discipline maps almost exactly onto Stoic *askesis* — the practice of voluntary hardship as a methodology for freedom. Epictetus drew the same distinction you're drawing: between what is *eph' hēmin* (up to us) and what isn't. The Stoics weren't arguing for detachment from the world. They were arguing for a very specific form of attention: full engagement with circumstances, zero dependence on outcomes.

Your writing from last month about "trying harder at things I can't control" — that's the problem Epictetus was solving. The *Enchiridion* is thirteen pages. It would take you an hour. It might dissolve a tension that's taken three months.

There's also a thread in your notes that touches Simone Weil's concept of *attention* — the idea that genuine moral perception requires a kind of emptying of the self, a waiting that isn't passive. You haven't named Weil, but the entry from April 27th describes exactly what she means.`,
    },
    {
      header: 'WHAT YOU\'RE CIRCLING',
      content: `Reading across everything from the last three months: you are much sharper in your critique than in your affirmation. The entries are extraordinarily clear-eyed about what's hollow — in culture, in your own routines, in the arguments you encounter. But they consistently stop before arriving at what you actually believe instead.

This isn't an intellectual failure. It looks like a careful refusal to close down too early — a kind of intellectual honesty that won't accept a comfortable answer before earning it. But there's a version of this that becomes a permanent deferral.

The entry from May 3rd is the one worth returning to. You wrote: "I keep waiting to believe something clearly enough to say it." That sentence knows something your longer essays don't.

Three questions worth sitting with this week: What would you defend if someone attacked it directly? What belief, if you publicly held it, would cost you something real? What are you already living as though it's true, even though you haven't written it down?`,
    },
  ],
}

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Intellectual genealogy',
    description: 'Connects your writing to the thinkers who\'ve worked these exact problems — philosophy, literature, science — with specific texts and why they connect.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Belief tracking',
    description: 'Shows how your thinking has evolved over weeks, months, and years — the contradictions you\'ve resolved, the ones still open, and what\'s quietly shifted.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Socratic pressure',
    description: 'Finds the assumptions underneath your assumptions — the belief you\'re defending without having examined it, the contradiction you\'ve been circling.',
  },
]

const TESTIMONIALS = [
  {
    quote: "I've kept journals for fifteen years. This is the first time anything has read them back to me in a way that felt like genuine engagement with the ideas.",
    attribution: "Philosopher, independent scholar",
  },
  {
    quote: "It found a connection between things I'd written eight months apart. The synthesis was better than anything I'd have arrived at alone.",
    attribution: "Writer, essayist",
  },
  {
    quote: "The questions at the end of each briefing are better than the ones my therapist asks. They open things up instead of closing them down.",
    attribution: "Thinker, reader, someone who writes a lot",
  },
]

export default function ThinkersPage() {
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
          For thinkers
        </div>
        <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-6">
          Build a mind that compounds.
        </h1>
        <p className="text-lg text-gray-500 font-sans leading-relaxed max-w-xl mx-auto mb-10">
          Every morning, Claude reads your writing, traces how your thinking has evolved, surfaces the contradictions you haven&rsquo;t resolved, and sends you the synthesis your journal was quietly building toward.
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
          <h2 className="font-serif text-3xl text-ink mb-3">What a synthesis looks like</h2>
          <p className="text-gray-500 font-sans text-base">Generated from a real reader&rsquo;s journal. Every synthesis is unique to how you think.</p>
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
          <h2 className="font-serif text-3xl text-ink mb-3">From people who write to think</h2>
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
            { step: '01', title: 'Connect your writing', body: 'Point it at your journal, reading notes, essays — wherever you think out loud. Read-only. Nothing is changed or deleted.' },
            { step: '02', title: 'Claude reads everything', body: 'Overnight, Claude reads across all of it — not just today\'s writing but the whole arc of your thinking over time.' },
            { step: '03', title: 'Synthesis arrives at 8am', body: 'A personalized synthesis lands in your inbox: what you\'re circling, what tradition it connects to, and questions worth sitting with.' },
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
        <h2 className="font-serif text-3xl text-ink mb-4">Start compounding your thinking</h2>
        <p className="text-gray-500 font-sans mb-8 leading-relaxed">
          Connect Google Drive in under two minutes. Your first synthesis arrives the same morning.
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
