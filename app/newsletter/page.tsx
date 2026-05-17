import Link from 'next/link'
import type { Metadata } from 'next'
import { getSubstackPosts, formatSubstackDate } from '@/lib/substack'

export const metadata: Metadata = {
  title: "Will's Newsletter | My Daily Journal",
  description: "Will Hoff writes about journaling, AI, thinking clearly, and building in public. Read the newsletter on Substack.",
  openGraph: {
    title: "Will's Newsletter",
    description: "Writing on journaling, AI, thinking clearly, and building in public.",
    type: 'website',
  },
}

export default async function NewsletterPage() {
  const posts = await getSubstackPosts(10)

  return (
    <div className="min-h-screen bg-cream">
      <nav className="border-b border-gray-100 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">
            My Daily Journal
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-800 font-sans transition-colors">Info</Link>
            <Link href="/newsletter" className="text-sm text-gray-800 font-sans font-semibold transition-colors">Newsletter</Link>
            <Link href="/" className="text-sm bg-ink text-white px-4 py-2 rounded-lg font-sans font-semibold hover:bg-gray-800 transition-colors">
              Try it free
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3">
            Newsletter
          </div>
          <h1 className="font-serif text-4xl text-ink mb-4">Will's Newsletter</h1>
          <p className="text-gray-500 font-sans text-base leading-relaxed max-w-xl mb-6">
            Writing on journaling, AI, thinking clearly, and what I'm building. Published on Substack.
          </p>
          <a
            href="https://whoff.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-ink text-white px-5 py-2.5 rounded-xl text-sm font-semibold font-sans hover:bg-gray-800 transition-colors"
          >
            Subscribe on Substack →
          </a>
        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          <div className="space-y-0 divide-y divide-gray-100">
            {posts.map((post, i) => (
              <article key={i} className="py-8 group">
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="text-xs text-gray-400 font-sans mb-2">
                    {formatSubstackDate(post.pubDate)}
                  </div>
                  <h2 className="font-serif text-xl text-ink mb-2 group-hover:text-indigo-700 transition-colors">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-gray-500 font-sans text-sm leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  )}
                  <span className="inline-block mt-3 text-sm text-indigo-600 font-sans font-semibold group-hover:text-indigo-700">
                    Read on Substack →
                  </span>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 font-sans text-sm">
            Posts are loading — check back soon or{' '}
            <a href="https://whoff.substack.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              read directly on Substack
            </a>.
          </div>
        )}
      </div>

      <footer className="border-t border-gray-100 mt-8">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-sans">© 2025 My Daily Journal</span>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Info</Link>
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Privacy</Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Terms</Link>
            <a href="https://www.instagram.com/mydailyjournal.you/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
