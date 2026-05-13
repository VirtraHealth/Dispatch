import Link from 'next/link'
import type { Metadata } from 'next'
import { LandingCTA } from '@/components/LandingCTA'

export const metadata: Metadata = {
  title: 'My Daily Journal for Students — Turn Your Notes Into Understanding',
  description: 'Every morning, Claude reads what you\'ve been studying, builds connections across your notes, and sends you a review designed around how memory actually works.',
}

const DIGEST = {
  date: 'Thursday, May 15, 2025',
  folders: 'Biology · Chem · Lecture Notes',
  sections: [
    {
      header: 'WHAT TO REVIEW TODAY',
      content: `Based on when you first wrote these notes, today is the right moment to revisit the three mechanisms you covered in your cellular biology session last week: *active transport*, *facilitated diffusion*, and *osmosis*. You summarized them but didn't test yourself — which means you recognized the words without necessarily owning the concept.

Here are four questions that check for real understanding rather than memorized definitions. Don't look at your notes first.

1. What structural feature of a cell membrane makes facilitated diffusion possible — and why can't glucose cross without it?
2. Active transport moves molecules against the concentration gradient. What provides the energy, and what happens if you block ATP synthesis?
3. You wrote "osmosis is passive." Is it? What's the distinction between osmosis and simple diffusion, and where does it matter clinically?
4. If you doubled the solute concentration outside a red blood cell, what would happen and why?

These four questions cover the same concepts from four different angles. If you can answer them without checking, you understand the material. If you can't, your notes from page 3 have everything you need.`,
    },
    {
      header: 'THE CONNECTION YOU HAVEN\'T MADE',
      content: `Your biology and chemistry notes are circling the same concept from two different directions: energy transformation. In chemistry, you've been covering thermodynamics — enthalpy, entropy, the directionality of reactions. In biology, you're covering ATP synthesis and metabolic pathways.

These are not two subjects. They're one subject described in different vocabularies.

The electron transport chain in your mitochondria notes? That's a thermodynamic engine. The reason ATP synthesis is favorable is exactly the same reason any exothermic reaction releases heat — the system is moving toward lower free energy. When you understand this, chemistry stops being abstract. Every formula you're memorizing has a biological reason to exist.

If this connection clicks, it also means you can predict: why is the reaction that makes ATP *coupled* to the proton gradient? Because uncoupled, it wouldn't be favorable. Your chemistry chapter on coupled reactions explains exactly this.`,
    },
    {
      header: 'FLASHCARDS',
      content: `__FLASHCARDS__`,
    },
  ],
}

const FLASHCARDS = [
  { q: 'What is the sodium-potassium pump, and why does it matter?', a: 'An active transport protein that moves 3 Na⁺ out and 2 K⁺ in per ATP. Maintains the resting membrane potential that makes nerve signaling possible.' },
  { q: 'Define free energy (ΔG) in plain language.', a: 'The energy available to do useful work. Negative ΔG = reaction is spontaneous. Positive ΔG = needs energy input. Zero = equilibrium.' },
  { q: 'What makes a reaction "coupled" in biochemistry?', a: 'Two reactions linked so that the energy released by one drives the other. ATP hydrolysis (−ΔG) is coupled to biosynthesis (+ΔG) to make unfavorable reactions happen.' },
]

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: 'Active recall',
    description: 'Generates questions from your own notes that test real understanding — not just whether you can recognize the answer, but whether you actually own the concept.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: 'Connection mapping',
    description: 'Finds the threads between different subjects and sessions — the moment where your chemistry and biology are actually the same thing.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Spaced review',
    description: 'Knows which concepts you covered and when — resurfaces the right material at the right moment based on how memory actually works, not just what\'s newest.',
  },
]

const TESTIMONIALS = [
  {
    quote: "I used to re-read everything the night before exams. Now I get a morning review that tells me exactly what to practice — and it actually works.",
    attribution: "Medical student, second year",
  },
  {
    quote: "It found a connection between my philosophy and cognitive science notes that I never would have seen. That connection ended up being the thesis of my paper.",
    attribution: "Graduate student, cognitive science",
  },
  {
    quote: "The flashcards it generates are better than the ones I make myself. It asks questions that actually test understanding instead of just recall.",
    attribution: "Pre-med undergraduate",
  },
]

export default function StudentsPage() {
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
          For students
        </div>
        <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-6">
          Turn your notes into understanding.
        </h1>
        <p className="text-lg text-gray-500 font-sans leading-relaxed max-w-xl mx-auto mb-10">
          Every morning, Claude reads what you&rsquo;ve been studying, builds connections across your notes, and sends you a review designed around how memory actually works.
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
          <h2 className="font-serif text-3xl text-ink mb-3">What a study briefing looks like</h2>
          <p className="text-gray-500 font-sans text-base">Generated from actual student notes. Every review is built around what you actually wrote.</p>
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
                {section.content === '__FLASHCARDS__' ? (
                  <div className="space-y-3">
                    {FLASHCARDS.map((card, j) => (
                      <div key={j} className="rounded-xl border border-gray-100 overflow-hidden">
                        <div className="bg-indigo-50 px-4 py-3">
                          <p className="font-sans text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">Q</p>
                          <p className="font-serif text-sm text-ink">{card.q}</p>
                        </div>
                        <div className="px-4 py-3 border-t border-gray-100">
                          <p className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">A</p>
                          <p className="font-serif text-sm text-gray-600">{card.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="font-serif text-sm text-ink leading-[1.9] space-y-3">
                    {section.content.split('\n\n').map((para, j) => (
                      <p key={j} dangerouslySetInnerHTML={{ __html: para.replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl text-ink mb-3">From students who study smarter</h2>
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
            { step: '01', title: 'Connect your notes', body: 'Point it at your Google Drive folders — lecture notes, reading summaries, study guides. Read-only. Nothing is edited or deleted.' },
            { step: '02', title: 'Claude builds connections', body: 'Overnight, Claude reads across everything — finding what needs review, what connects across subjects, and what questions would test real understanding.' },
            { step: '03', title: 'Review arrives at 8am', body: 'A personalized study briefing lands in your inbox: spaced review prompts, active recall questions, flashcards, and cross-subject connections.' },
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
        <h2 className="font-serif text-3xl text-ink mb-4">Turn your notes into a study system</h2>
        <p className="text-gray-500 font-sans mb-8 leading-relaxed">
          Connect Google Drive in under two minutes. Your first review arrives the same morning.
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
