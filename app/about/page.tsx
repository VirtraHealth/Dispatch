import Link from 'next/link'
import type { Metadata } from 'next'
import { LandingCTA } from '@/components/LandingCTA'

export const metadata: Metadata = {
  title: 'About My Daily Journal',
  description: 'My Daily Journal is a daily AI email digest that reads your Google Drive notes and sends you deeper research, philosophical threads, and new connections every morning.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          My Daily Journal
        </Link>
        <LandingCTA variant="nav" />
      </nav>

      {/* Hero */}
      <main className="max-w-2xl mx-auto px-6 pt-12 pb-24">
        <div className="mb-10">
          <div className="text-xs font-sans font-semibold tracking-widest uppercase text-indigo-600 mb-4">
            About
          </div>
          <h1 className="font-serif text-4xl text-ink mb-4 leading-tight">
            What is My Daily Journal?
          </h1>
          <p className="font-serif text-xl text-gray-500 leading-relaxed">
            A daily email that reads everything you write and goes deeper on it.
          </p>
        </div>

        <div className="font-serif text-base text-ink leading-[1.85] space-y-6">

          <p>
            Most of us keep notes, journals, and documents scattered across Google Drive —
            fragments of ideas we mean to return to, questions we haven&rsquo;t finished asking,
            observations that haven&rsquo;t yet found their context. My Daily Journal is built for that
            kind of writing.
          </p>

          <p>
            Every morning, My Daily Journal reads the documents in the Drive folders you choose. It
            passes everything to Claude — Anthropic&rsquo;s AI model — and asks it to do
            something a good editor or intellectual friend might do: find the philosophical
            traditions your ideas are touching, surface the business thinkers who have wrestled
            with the same problems, trace the threads you&rsquo;ve been circling without naming,
            and ask the questions your own writing hasn&rsquo;t asked yet.
          </p>

          <p>
            The result lands in your inbox as a structured digest with four sections:
            Philosophy, Business &amp; Systems, Reflections, and New Thoughts &amp; Questions.
            It is written specifically from your documents, not from a generic template.
          </p>

          {/* How it works */}
          <div className="mt-10 mb-6">
            <div className="text-xs font-sans font-bold tracking-widest uppercase text-indigo-600 mb-6 pb-2 border-b-2 border-indigo-50">
              How it works
            </div>
            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Connect Google Drive',
                  body: 'Sign in with Google and point My Daily Journal at up to three folders. Read-only access — My Daily Journal never edits or deletes anything.',
                },
                {
                  step: '02',
                  title: 'Claude reads your writing',
                  body: 'Each morning (or on whatever schedule you set), our server reads the documents in your folders. The text is passed to Claude and then discarded — we never store your raw document contents.',
                },
                {
                  step: '03',
                  title: 'Your digest arrives',
                  body: 'A formatted email lands in your inbox with fresh analysis and questions tailored entirely to what you have been writing about.',
                },
                {
                  step: '04',
                  title: 'Review and adjust',
                  body: 'Your dashboard shows every past digest. You can change which folders My Daily Journal reads, when your digest arrives, and add personal instructions to shape how Claude responds to your writing.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="font-sans text-xs font-bold tracking-widest text-indigo-300 pt-1 w-6 shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <div className="font-sans text-sm font-semibold text-ink mb-1">{item.title}</div>
                    <p className="text-gray-500 text-sm leading-relaxed font-sans">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy commitment */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-8">
            <div className="text-xs font-sans font-bold tracking-widest uppercase text-indigo-600 mb-3">
              Privacy commitment
            </div>
            <p className="text-sm font-sans text-gray-500 leading-relaxed">
              Your documents belong to you. My Daily Journal requests read-only Drive access and uses it
              only to generate your digest. Raw document content is never stored — only the
              finished digest HTML is saved. You can revoke access from your Google account at
              any time. Read our full{' '}
              <Link href="/privacy" className="text-indigo-600 underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Contact */}
          <div className="mt-10">
            <div className="text-xs font-sans font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              Contact
            </div>
            <p>
              For questions, feedback, or support, email us at{' '}
              <a
                href="mailto:digest@mydailyjournal.net"
                className="text-indigo-600 underline underline-offset-2"
              >
                digest@mydailyjournal.net
              </a>
              .
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 pt-10 border-t border-gray-100 text-center">
          <h2 className="font-serif text-2xl text-ink mb-4">Try it for free</h2>
          <p className="text-gray-500 font-sans text-sm mb-8 leading-relaxed">
            Connect Google Drive in under two minutes. Your first digest arrives immediately.
          </p>
          <LandingCTA variant="hero" />
        </div>
      </main>

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
