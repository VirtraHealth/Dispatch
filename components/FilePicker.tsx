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

      const view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
        .setSelectFolderEnabled(true)
        .setMode(google.picker.DocsViewMode.LIST)

      new google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(accessToken)
        .setTitle('Select a Google Drive folder')
        .setCallback((data: { action: string; docs?: Array<{ id: string; name: string }> }) => {
          if (data.action === google.picker.Action.PICKED && data.docs) {
            const newItems = data.docs
              .filter(doc => !currentSelected.some(s => s.id === doc.id))
              .map(doc => ({ id: doc.id, name: doc.name, parentId: null }))
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
          {selected.map(file => (
            <div key={file.id} className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200">
              <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
              <span className="text-sm text-gray-700 font-sans flex-1 truncate">{file.name}</span>
              <a
                href={`https://drive.google.com/open?id=${file.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-indigo-500 font-sans flex-shrink-0 transition-colors"
                title="Open in Google Drive"
              >
                Open ↗
              </a>
              <button
                onClick={() => remove(file.id)}
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
          className="flex items-center justify-center gap-2 w-full border border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 font-sans transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              Opening…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {selected.length === 0 ? 'Choose a folder from Google Drive' : 'Add another folder'}
            </>
          )}
        </button>
      )}

      {error && <p className="mt-2 text-sm text-red-500 font-sans">{error}</p>}

      <p className="mt-3 text-xs text-gray-400 font-sans">
        Select a Google Drive folder. Claude reads every doc inside it each morning — just keep adding files to the folder.
      </p>
    </div>
  )
}
