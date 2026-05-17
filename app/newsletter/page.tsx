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
          <Link
            href="/"
            className="text-sm bg-ink text-white px-4 py-2 rounded-lg font-sans font-semibold hover:bg-gray-800 transition-colors"
          >
            Try it free
          </Link>
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
          <div className="flex gap-6">
            <Link href="/blog" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Blog</Link>
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Privacy</Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
