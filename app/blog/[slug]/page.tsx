import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BLOG_POSTS, getPostBySlug } from '@/lib/blog-posts'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  return {
    title: post.seoTitle,
    description: post.description,
    openGraph: {
      title: post.seoTitle,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle,
      description: post.description,
    },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function renderBody(text: string) {
  return text.split('\n\n').map((para, i) => (
    <p key={i} className="text-gray-700 font-sans text-base leading-relaxed mb-5"
      dangerouslySetInnerHTML={{ __html: para.replace(/\*(.*?)\*/g, '<em>$1</em>') }}
    />
  ))
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <article className="max-w-2xl mx-auto px-6 py-16">
        {/* Back */}
        <Link
          href="/blog"
          className="text-sm text-gray-400 hover:text-gray-600 font-sans mb-10 inline-block"
        >
          ← All posts
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-gray-400 font-sans">{formatDate(post.date)}</span>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-gray-400 font-sans">{post.readingTime} min read</span>
          </div>
          <h1 className="font-serif text-4xl text-ink leading-tight mb-4">{post.title}</h1>
          <p className="text-gray-500 font-sans text-lg leading-relaxed">{post.description}</p>
        </header>

        {/* Body */}
        <div className="prose-none">
          {post.content.map((section, i) => (
            <div key={i} className="mb-10">
              {section.heading && (
                <h2 className="font-serif text-2xl text-ink mb-4">{section.heading}</h2>
              )}
              {renderBody(section.body)}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-white rounded-2xl border border-gray-100 text-center">
          <div className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3">
            My Daily Journal
          </div>
          <h3 className="font-serif text-2xl text-ink mb-3">
            Your journal, writing back
          </h3>
          <p className="text-gray-500 font-sans text-sm leading-relaxed mb-6 max-w-sm mx-auto">
            Connect your Google Drive writing folders. Every morning, get a digest that reads everything you wrote and pushes your thinking forward.
          </p>
          <Link
            href={post.ctaHref}
            className="inline-block bg-ink text-white px-6 py-3 rounded-xl text-sm font-semibold font-sans hover:bg-gray-800 transition-colors"
          >
            {post.ctaLabel}
          </Link>
          <div className="mt-3 text-xs text-gray-400 font-sans">7-day free trial · No credit card required</div>
        </div>
      </article>

      {/* Newsletter strip */}
      <div className="max-w-2xl mx-auto px-6 pb-8">
        <div className="border border-gray-100 rounded-2xl p-6 flex items-center justify-between gap-6">
          <div>
            <div className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-1">
              Will's Newsletter
            </div>
            <p className="text-gray-500 font-sans text-sm leading-snug">
              Writing on journaling, AI, and thinking clearly — published on Substack.
            </p>
          </div>
          <a
            href="https://whoff.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-block bg-ink text-white px-4 py-2 rounded-lg text-sm font-semibold font-sans hover:bg-gray-800 transition-colors"
          >
            Read →
          </a>
        </div>
      </div>

      <footer className="border-t border-gray-100 mt-8">
        <div className="max-w-2xl mx-auto px-6 py-8 flex items-center justify-between">
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
