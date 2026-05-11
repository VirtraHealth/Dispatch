'use client'

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
    <div className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 font-sans truncate">{date}</div>
          <div className="text-xs text-gray-400 mt-1 font-sans">
            {digest.doc_count} doc{digest.doc_count !== 1 ? 's' : ''} read
            {digest.docs_read?.length > 0 && (
              <span className="text-gray-300"> · {digest.docs_read.slice(0, 2).join(', ')}{digest.docs_read.length > 2 ? '…' : ''}</span>
            )}
          </div>
        </div>
        <span
          className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-sans font-medium ${
            digest.status === 'sent'
              ? 'bg-green-50 text-green-600'
              : 'bg-red-50 text-red-500'
          }`}
        >
          {digest.status}
        </span>
      </div>
    </div>
  )
}
