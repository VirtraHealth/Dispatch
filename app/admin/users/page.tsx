'use client'

import { useState, useEffect } from 'react'

type User = {
  id: string
  email: string
  name: string | null
  subscription_status: string
  trial_started_at: string | null
  stripe_customer_id: string | null
  created_at: string
  digest_count: number
  last_digest_at: string | null
}

const STATUS_COLORS: Record<string, string> = {
  trialing: 'bg-blue-50 text-blue-700',
  active: 'bg-green-50 text-green-700',
  complimentary: 'bg-purple-50 text-purple-700',
  canceled: 'bg-red-50 text-red-700',
}

function trialDaysLeft(trialStartedAt: string | null): number | null {
  if (!trialStartedAt) return null
  const end = new Date(trialStartedAt).getTime() + 7 * 24 * 60 * 60 * 1000
  const days = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24))
  return Math.max(0, days)
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => { if (data?.users) setUsers(data.users) })
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(userId: string, newStatus: string) {
    setUpdating(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_status: newStatus }),
      })
      if (res.ok) {
        const { user } = await res.json()
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...user } : u))
      }
    } finally {
      setUpdating(null)
    }
  }

  const activeCount = users.filter(u => u.subscription_status === 'active').length
  const trialingCount = users.filter(u => u.subscription_status === 'trialing').length
  const canceledCount = users.filter(u => u.subscription_status === 'canceled').length

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink mb-6">Users</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total users', value: users.length },
          { label: 'Active', value: activeCount },
          { label: 'Trialing', value: trialingCount },
          { label: 'Canceled', value: canceledCount },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-2xl font-serif text-ink mb-1">{s.value}</div>
            <div className="text-xs text-gray-400 font-sans uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 font-sans">
            {loading ? 'Loading…' : `Users (${users.length})`}
          </h2>
          <span className="text-xs text-gray-400 font-sans">Digests · Last sent</span>
        </div>

        {loading ? (
          <div className="px-6 py-12 flex justify-center">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400 font-sans">No users yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {users.map(user => {
              const daysLeft = user.subscription_status === 'trialing'
                ? trialDaysLeft(user.trial_started_at)
                : null

              return (
                <div key={user.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-sans text-ink truncate">{user.email}</div>
                    <div className="text-xs text-gray-400 font-sans mt-0.5">
                      Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {daysLeft !== null && (
                        <span className="ml-2">· {daysLeft === 0 ? 'Trial expired' : `${daysLeft}d left in trial`}</span>
                      )}
                    </div>
                  </div>

                  {/* Digest stats */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-sans text-ink font-semibold">{user.digest_count}</div>
                    <div className="text-xs text-gray-400 font-sans">
                      {user.last_digest_at
                        ? new Date(user.last_digest_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : 'never'}
                    </div>
                  </div>

                  <span className={`text-xs font-semibold font-sans px-2.5 py-1 rounded-full ${STATUS_COLORS[user.subscription_status] ?? 'bg-gray-50 text-gray-500'}`}>
                    {user.subscription_status}
                  </span>

                  {user.stripe_customer_id && (
                    <a
                      href={`https://dashboard.stripe.com/customers/${user.stripe_customer_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-500 hover:text-indigo-700 font-sans"
                    >
                      Stripe ↗
                    </a>
                  )}

                  <select
                    value={user.subscription_status}
                    disabled={updating === user.id}
                    onChange={e => updateStatus(user.id, e.target.value)}
                    className="text-xs font-sans border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-indigo-400 disabled:opacity-50"
                  >
                    <option value="trialing">Trialing</option>
                    <option value="active">Active</option>
                    <option value="complimentary">Complimentary</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
