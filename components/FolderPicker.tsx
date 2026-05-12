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
  const [creating, setCreating] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')

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

  async function handleCreate() {
    if (!newFolderName.trim()) return
    setCreateLoading(true)
    setCreateError('')
    try {
      const res = await fetch('/api/drive/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create folder')
      setFolders(prev => [data.folder, ...prev])
      onChange([...selected, data.folder].slice(0, max))
      setNewFolderName('')
      setCreating(false)
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : 'Failed to create folder')
    } finally {
      setCreateLoading(false)
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
      {folders.length === 0 && !creating ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-500 font-sans mb-1">No folders found in your Google Drive.</p>
          <p className="text-xs text-gray-400 font-sans mb-4">Create one to get started.</p>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold font-sans px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create a folder
          </button>
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

          <p className="text-xs text-gray-400 pt-2 font-sans">
            {selected.length}/{max} selected · {folders.length} folder{folders.length !== 1 ? 's' : ''} in Drive
          </p>
        </>
      )}

      {/* Create folder inline form */}
      {creating && (
        <div className="mt-3 p-4 border border-indigo-100 bg-indigo-50 rounded-xl">
          <p className="text-xs font-bold tracking-wider uppercase text-indigo-600 font-sans mb-2">New folder</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="Folder name"
              autoFocus
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-indigo-400 bg-white"
            />
            <button
              onClick={handleCreate}
              disabled={createLoading || !newFolderName.trim()}
              className="bg-indigo-600 text-white text-sm font-semibold font-sans px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {createLoading ? '…' : 'Create'}
            </button>
            <button
              onClick={() => { setCreating(false); setNewFolderName(''); setCreateError('') }}
              className="text-sm text-gray-400 hover:text-gray-600 font-sans px-2"
            >
              Cancel
            </button>
          </div>
          {createError && <p className="text-xs text-red-500 mt-2 font-sans">{createError}</p>}
        </div>
      )}

      {/* New folder button when folders already exist */}
      {folders.length > 0 && !creating && (
        <button
          onClick={() => setCreating(true)}
          className="mt-2 text-xs text-indigo-600 hover:text-indigo-700 font-sans flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New folder
        </button>
      )}
    </div>
  )
}
