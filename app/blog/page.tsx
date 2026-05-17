import Link from 'next/link'
import type { Metadata } from 'next'
import { BLOG_POSTS } from '@/lib/blog-posts'
import { getSubstackPosts, formatSubstackDate } from '@/lib/substack'

export const metadata: Metadata = {
  title: 'Blog | My Daily Journal',
  description: 'Writing on journaling, reflection, and how to think more clearly every day.',
  openGraph: {
    title: 'Blog | My Daily Journal',
    description: 'Writing on journaling, reflection, and how to think more clearly every day.',
    type: 'website',
  },
}

const PERSONA_LABELS: Record<string, string> = {
  founders: 'Founders',
  thinkers: 'Thinkers',
  students: 'Students',
  athletes: 'Athletes',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function BlogPage() {
  const [substackPosts, sorted] = await Promise.all([
    getSubstackPosts(3),
    Promise.resolve([...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )),
  ])

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">
            My Daily Journal
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-800 font-sans transition-colors">Info</Link>
            <Link href="/newsletter" className="text-sm text-gray-500 hover:text-gray-800 font-sans transition-colors">Newsletter</Link>
            <Link href="/" className="text-sm bg-ink text-white px-4 py-2 rounded-lg font-sans font-semibold hover:bg-gray-800 transition-colors">
              Try it free
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="font-serif text-4xl text-ink mb-3">Writing</h1>
          <p className="text-gray-500 font-sans text-base leading-relaxed">
            On journaling, reflection, and how to think more clearly every day.
          </p>
        </div>

        <div className="space-y-0 divide-y divide-gray-100">
          {sorted.map(post => (
            <article key={post.slug} className="py-8 group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gray-400 font-sans">{formatDate(post.date)}</span>
                  {post.persona && (
                    <span className="text-xs font-semibold font-sans px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                      {PERSONA_LABELS[post.persona]}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 font-sans">{post.readingTime} min read</span>
                </div>
                <h2 className="font-serif text-xl text-ink mb-2 group-hover:text-indigo-700 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-500 font-sans text-sm leading-relaxed line-clamp-2">
                  {post.description}
                </p>
                <span className="inline-block mt-3 text-sm text-indigo-600 font-sans font-semibold group-hover:text-indigo-700">
                  Read →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter strip */}
      {substackPosts.length > 0 && (
        <div className="mt-16 border-t border-gray-100 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-1">
                Will's Newsletter
              </div>
              <p className="text-gray-400 font-sans text-sm">Latest from Substack</p>
            </div>
            <a
              href="https://whoff.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 font-sans font-semibold hover:text-indigo-700"
            >
              Subscribe →
            </a>
          </div>
          <div className="space-y-0 divide-y divide-gray-100">
            {substackPosts.map((post, i) => (
              <a
                key={i}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-5 group"
              >
                <div className="text-xs text-gray-400 font-sans mb-1">{formatSubstackDate(post.pubDate)}</div>
                <div className="font-serif text-lg text-ink group-hover:text-indigo-700 transition-colors">
                  {post.title}
                </div>
                {post.description && (
                  <p className="text-gray-500 font-sans text-sm mt-1 line-clamp-1">{post.description}</p>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-sans">© 2025 My Daily Journal</span>
          <div className="flex items-center gap-6">
            <Link href="/newsletter" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Newsletter</Link>
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Privacy</Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Terms</Link>
            <a href="https://www.instagram.com/mydailyjournal.you/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@mydailyjournal.net" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="TikTok">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
