'use client'

import { useState, useCallback } from 'react'
import type { DriveFolder } from '@/types'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const gapi: any
declare const google: any
/* eslint-enable @typescript-eslint/no-explicit-any */

interface FilePickerProps {
  selected: DriveFolder[]
  onChange: (files: DriveFolder[]) => void
  max?: number
}

function isFolder(item: DriveFolder) {
  return item.type === 'folder' || item.type === undefined
}

function FolderIcon() {
  return (
    <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

export function FilePicker({ selected, onChange, max = 10 }: FilePickerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const openPicker = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const tokenRes = await fetch('/api/auth/google-token')
      if (!tokenRes.ok) throw new Error('Could not authenticate with Google. Try signing out and back in.')
      const { accessToken } = await tokenRes.json()

      if (typeof gapi === 'undefined') {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://apis.google.com/js/api.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Google API'))
          document.head.appendChild(script)
        })
      }

      await new Promise<void>(resolve => gapi.load('picker', resolve))

      const currentSelected = selected

      const docsView = new google.picker.DocsView(google.picker.ViewId.DOCS)
        .setMode(google.picker.DocsViewMode.LIST)

      const foldersView = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
        .setSelectFolderEnabled(true)
        .setMode(google.picker.DocsViewMode.LIST)

      new google.picker.PickerBuilder()
        .addView(docsView)
        .addView(foldersView)
        .setOAuthToken(accessToken)
        .setTitle('Select documents or folders')
        .setCallback((data: { action: string; docs?: Array<{ id: string; name: string; mimeType: string }> }) => {
          if (data.action === google.picker.Action.PICKED && data.docs) {
            const newItems = data.docs
              .filter(doc => !currentSelected.some(s => s.id === doc.id))
              .map(doc => ({
                id: doc.id,
                name: doc.name,
                parentId: null,
                type: doc.mimeType === 'application/vnd.google-apps.folder' ? 'folder' as const : 'file' as const,
              }))
            onChange([...currentSelected, ...newItems].slice(0, max))
          }
        })
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .build()
        .setVisible(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to open file picker')
    } finally {
      setLoading(false)
    }
  }, [selected, onChange, max])

  function remove(id: string) {
    onChange(selected.filter(f => f.id !== id))
  }

  return (
    <div>
      {selected.length > 0 && (
        <div className="space-y-2 mb-4">
          {selected.map(item => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200">
              {isFolder(item) ? <FolderIcon /> : <DocIcon />}
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-700 font-sans truncate block">{item.name}</span>
                <span className="text-xs text-gray-400 font-sans">{isFolder(item) ? 'Folder — Claude reads all docs inside' : 'Document'}</span>
              </div>
              <a
                href={`https://drive.google.com/open?id=${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-indigo-500 font-sans flex-shrink-0 transition-colors"
                title="Open in Google Drive"
              >
                Open ↗
              </a>
              <button
                onClick={() => remove(item.id)}
                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                aria-label="Remove"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {selected.length < max && (
        <button
          onClick={openPicker}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full border border-dashed border-gray-300 rounded-lg px-4 py-3.5 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 font-sans transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              Opening Google Drive…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {selected.length === 0 ? 'Choose from Google Drive' : 'Add another'}
            </>
          )}
        </button>
      )}

      {error && <p className="mt-2 text-sm text-red-500 font-sans">{error}</p>}

      <div className="mt-3 flex items-start gap-2">
        <p className="text-xs text-gray-400 font-sans leading-relaxed">
          Pick a <span className="font-medium text-gray-500">folder</span> (Claude reads every doc inside, great for projects) or an <span className="font-medium text-gray-500">individual doc</span>. You can mix both.
        </p>
      </div>
    </div>
  )
}
