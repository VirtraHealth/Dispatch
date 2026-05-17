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
          <div className="flex gap-6">
            <Link href="/newsletter" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Newsletter</Link>
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Privacy</Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 font-sans">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
