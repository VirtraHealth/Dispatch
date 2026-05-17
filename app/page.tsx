import Link from 'next/link'
import { LandingCTA } from '@/components/LandingCTA'

const SAMPLE_DIGEST = {
  date: 'Sunday, May 10, 2025',
  folders: 'Notes · Journal · Ideas',
  sections: [
    {
      header: 'PHILOSOPHY',
      content: `There is a thread running through your last two weeks of writing that you may not have named yet: you are circling the distinction between *doing* and *being*. The journal entries from Tuesday and Thursday both arrive at the same impasse — a restlessness with output metrics that can't quite articulate what it wants instead. This maps precisely onto what Hannah Arendt called the distinction between *labor*, *work*, and *action* in The Human Condition. You have been operating primarily in the register of work — fabricating things, producing outputs, building toward a finished object — while hungering for action, which for Arendt is the domain of genuine self-disclosure and meaning.

The philosopher Charles Taylor has a complementary frame in Sources of the Self: that the modern crisis of identity is fundamentally about the loss of "moral frameworks" — background pictures that make sense of what makes life meaningful. Your notes suggest you're in exactly this territory. The restlessness isn't a productivity problem. It's a meaning architecture problem.

Worth reading: Arendt's The Human Condition (Part V on Action), and Taylor's The Ethics of Authenticity — shorter and more accessible than Sources, directly addresses the hollowness you're describing.`,
    },
    {
      header: 'BUSINESS & SYSTEMS',
      content: `Your notes on distribution from last week contain something sharper than you've given yourself credit for. The observation — "most people are building products when they should be building audiences" — is a compression of what Li Jin at Andreessen Horowitz has been tracking as the shift from platform-dependent to audience-owned businesses. What makes this more than a cliché is the next sentence you wrote and then crossed out: "the product becomes the relationship itself."

That deleted sentence is the insight. The companies that have held onto margin in the attention economy aren't selling access to a thing. They're selling continuity of a relationship. Substack, Patreon, even the best newsletters — the moat is familiarity, trust, and the specific texture of one voice over time. You're onto something about what the post-platform era actually rewards.

Read Ben Thompson's Stratechery piece "Aggregation Theory" if you haven't — your intuition about distribution matches his framework almost exactly, which means you can use his vocabulary to sharpen your own.`,
    },
    {
      header: 'REFLECTIONS',
      content: `Reading across everything you've written this month, there's a pattern worth naming: you are much bolder in your diagnosis than in your prescription. The entries are extraordinarily clear-eyed about what's broken — in systems, in companies, in your own days. But they consistently stop before the "and therefore I will…" sentence.

This isn't a failure of thinking. It looks more like a careful protection of optionality. Naming a specific course of action closes down other possibilities, and there's a kind of intellectual integrity in refusing to foreclose too early. But it may also be a form of hesitation masquerading as rigor.

The entry from May 3rd is the one I'd return to. You wrote: "I keep trying to think my way to certainty before moving." That sentence knows something your strategy documents don't yet.`,
    },
    {
      header: 'NEW THOUGHTS & QUESTIONS',
      content: `Two connections worth sitting with: First, your business notes and your philosophical notes are actually about the same problem — the difference between signal and noise in human attention. One is about markets, one is about meaning, but both are asking what is worth attending to and why. A unified frame might be more generative than treating them as separate domains.

Second, there's a book that sits precisely at the intersection of where you are: The Courage to Act by Ben Bernanke — not for the economics, but for the case study in decision-making under radical uncertainty without the comfort of complete information.

Questions to sit with this week:
- What would you do if you were certain it would fail — and did it anyway?
- What's the difference between the work you do for money and the work you do for evidence of yourself?
- If your writing from this month was a letter to someone, who are you actually writing to?`,
    },
  ],
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">
          My Daily Journal
        </span>
        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-sm font-sans text-gray-500 hover:text-gray-700 transition-colors">
            Info
          </Link>
          <Link href="/newsletter" className="text-sm font-sans text-gray-500 hover:text-gray-700 transition-colors">
            Newsletter
          </Link>
          <Link href="/about" className="text-sm font-sans text-gray-500 hover:text-gray-700 transition-colors">
            About
          </Link>
          <LandingCTA variant="nav" />
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-block text-xs font-sans font-semibold tracking-widest uppercase text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full mb-8">
          Private beta
        </div>
        <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-6">
          A daily email that goes deeper on everything you write
        </h1>
        <p className="text-lg text-gray-500 font-sans leading-relaxed max-w-xl mx-auto mb-10">
          Connect your Google Drive. Every morning, Claude reads your notes and sends you deeper research, philosophical threads, and questions your own thinking hasn't asked yet.
        </p>
        <LandingCTA variant="hero" />
        <p className="text-xs text-gray-400 mt-4 font-sans">
          7-day free trial · No credit card · Your docs stay private
        </p>
      </section>

      {/* Feature callouts */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
              ),
              title: 'Connect Drive',
              description: 'Point My Daily Journal at up to 3 folders — your journal, notes, ideas. Read-only access. We never edit or delete anything.',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              title: 'AI goes deeper',
              description: 'Claude reads everything you\'ve written and returns with the philosophical traditions, business thinkers, and connections you haven\'t made yet.',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              title: 'Lands in your inbox',
              description: 'Beautifully formatted. Four sections every morning: Philosophy, Business & Systems, Reflections, New Thoughts & Questions.',
            },
          ].map((f, i) => (
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

      {/* Sample email preview */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl text-ink mb-3">What a digest looks like</h2>
          <p className="text-gray-500 font-sans text-base">This is generated from real writing. Every digest is unique to your docs.</p>
        </div>

        {/* Email mockup */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Email header bar */}
          <div className="border-b border-gray-100 px-8 py-5">
            <div className="text-xs font-sans font-bold tracking-widest uppercase text-indigo-600 mb-1">My Daily Journal</div>
            <div className="font-serif text-xl text-ink">{SAMPLE_DIGEST.date}</div>
            <div className="text-xs text-gray-400 font-sans mt-1">Reading from: {SAMPLE_DIGEST.folders}</div>
          </div>

          {/* Sections */}
          <div className="px-8 py-6 space-y-8">
            {SAMPLE_DIGEST.sections.map((section, i) => (
              <div key={i}>
                <div className="text-xs font-sans font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
                  {section.header}
                </div>
                <div className="font-serif text-sm text-ink leading-[1.9] space-y-3">
                  {section.content.split('\n\n').map((para, j) => (
                    <p key={j} dangerouslySetInnerHTML={{
                      __html: para.replace(/\*(.*?)\*/g, '<em>$1</em>'),
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-xl mx-auto px-6 pb-24 text-center">
        <h2 className="font-serif text-3xl text-ink mb-4">Start your first digest today</h2>
        <p className="text-gray-500 font-sans mb-8 leading-relaxed">
          Connect Google Drive in under two minutes. Your first email arrives immediately.
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
