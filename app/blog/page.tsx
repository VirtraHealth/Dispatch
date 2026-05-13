import Link from 'next/link'
import type { Metadata } from 'next'
import { BLOG_POSTS } from '@/lib/blog-posts'

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

export default function BlogPage() {
  const sorted = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">
            My Daily Journal
          </Link>
          <Link
            href="/"
            className="text-sm bg-ink text-white px-4 py-2 rounded-lg font-sans font-semibold hover:bg-gray-800 transition-colors"
          >
            Try it free
          </Link>
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

      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-sans">© 2025 My Daily Journal</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Privacy</Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
