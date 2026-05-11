'use client'

import Link from 'next/link'
import type { Digest } from '@/types'

interface DigestCardProps {
  digest: Digest
}

export function DigestCard({ digest }: DigestCardProps) {
  const date = new Date(digest.sent_at).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link
      href={`/dashboard/digest/${digest.id}`}
      className="block border border-gray-100 rounded-xl p-5 hover:border-indigo-200 hover:shadow-sm transition-all bg-white group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 font-sans group-hover:text-indigo-700 transition-colors leading-snug">
            {digest.subject || date}
          </div>
          <div className="text-xs text-gray-400 mt-1.5 font-sans">
            {date} · {digest.doc_count} doc{digest.doc_count !== 1 ? 's' : ''}
            {digest.docs_read?.length > 0 && (
              <span className="text-gray-300"> · {digest.docs_read.slice(0, 2).join(', ')}{digest.docs_read.length > 2 ? '…' : ''}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`text-xs px-2 py-1 rounded-full font-sans font-medium ${
              digest.status === 'sent'
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-500'
            }`}
          >
            {digest.status}
          </span>
          <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
