'use client'

import { useState, useEffect } from 'react'
import type { DriveFolder } from '@/types'

interface FolderPickerProps {
  selected: DriveFolder[]
  onChange: (folders: DriveFolder[]) => void
  max?: number
}

export function FolderPicker({ selected, onChange, max = 3 }: FolderPickerProps) {
  const [folders, setFolders] = useState<DriveFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetch('/api/drive/folders')
      .then(r => r.json())
      .then(data => {
        if (data.folders) setFolders(data.folders)
        else setError(data.error || 'Failed to load folders')
      })
      .catch(() => setError('Failed to load folders'))
      .finally(() => setLoading(false))
  }, [])

  function toggle(folder: DriveFolder) {
    const isSelected = selected.some(f => f.id === folder.id)
    if (isSelected) {
      onChange(selected.filter(f => f.id !== folder.id))
    } else if (selected.length < max) {
      onChange([...selected, folder])
    }
  }

  async function refresh() {
    setRefreshing(true)
    try {
      const data = await fetch('/api/drive/folders').then(r => r.json())
      if (data.folders) setFolders(data.folders)
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>
  }

  const filtered = query.trim()
    ? folders.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : folders

  return (
    <div>
      {folders.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-500 font-sans mb-1">No folders found in your Google Drive.</p>
          <p className="text-xs text-gray-400 font-sans mb-4">Create one in Drive, then come back and refresh.</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold font-sans px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Open Google Drive ↗
            </a>
            <button
              onClick={refresh}
              disabled={refreshing}
              className="text-sm text-gray-500 hover:text-gray-700 font-sans disabled:opacity-50"
            >
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Search */}
          {folders.length > 0 && (
            <div className="relative mb-2">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search folders…"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-sans focus:outline-none focus:border-indigo-400"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Folder list */}
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 font-sans py-4 text-center">No folders match &quot;{query}&quot;</p>
            ) : (
              filtered.map(folder => {
                const isSelected = selected.some(f => f.id === folder.id)
                const isDisabled = !isSelected && selected.length >= max

                return (
                  <button
                    key={folder.id}
                    onClick={() => toggle(folder)}
                    disabled={isDisabled}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all font-sans text-sm ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                        : isDisabled
                        ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                      </svg>
                      {folder.name}
                      {isSelected && (
                        <svg className="w-4 h-4 ml-auto text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-400 font-sans">
              {selected.length}/{max} selected · {folders.length} folder{folders.length !== 1 ? 's' : ''} in Drive
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-500 hover:text-indigo-700 font-sans"
              >
                Open Drive ↗
              </a>
              <button
                onClick={refresh}
                disabled={refreshing}
                className="text-xs text-gray-400 hover:text-gray-600 font-sans disabled:opacity-50"
              >
                {refreshing ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
