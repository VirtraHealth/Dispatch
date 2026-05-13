'use client'

import { useEffect, useState } from 'react'

type MetricsData = {
  totalUsers: number
  mrr: number
  byStatus: {
    active: number
    trialing: number
    canceled: number
    complimentary: number
  }
  metrics: {
    day7OpenRate: number
    weeklyActiveUploaders: number
    freeToPaidConversion: number
    monthlyChurn: number
    costPerEmail: number
  }
}

type TrafficLight = 'green' | 'amber' | 'red'

function getLight(metric: keyof MetricsData['metrics'], value: number): TrafficLight {
  switch (metric) {
    case 'day7OpenRate':
      return value >= 65 ? 'green' : value >= 50 ? 'amber' : 'red'
    case 'weeklyActiveUploaders':
      return value >= 70 ? 'green' : value >= 50 ? 'amber' : 'red'
    case 'freeToPaidConversion':
      return value >= 6 ? 'green' : value >= 4 ? 'amber' : 'red'
    case 'monthlyChurn':
      return value <= 4 ? 'green' : value <= 6 ? 'amber' : 'red'
    case 'costPerEmail':
      return value <= 0.04 ? 'green' : value <= 0.06 ? 'amber' : 'red'
  }
}

const LIGHT_STYLES: Record<TrafficLight, string> = {
  green: 'bg-green-50 text-green-700 border-green-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  red: 'bg-red-50 text-red-700 border-red-100',
}

const LIGHT_DOT: Record<TrafficLight, string> = {
  green: 'bg-green-500',
  amber: 'bg-amber-400',
  red: 'bg-red-500',
}

const NON_NEGOTIABLES: {
  key: keyof MetricsData['metrics']
  label: string
  target: string
  description: string
  format: (v: number) => string
}[] = [
  {
    key: 'day7OpenRate',
    label: 'Day-7 Open Rate',
    target: '≥ 65%',
    description: 'Users who open their first digest within 7 days',
    format: v => `${v.toFixed(1)}%`,
  },
  {
    key: 'weeklyActiveUploaders',
    label: 'Weekly Active Uploaders',
    target: '≥ 70%',
    description: 'Paid users with a digest sent this week',
    format: v => `${v.toFixed(1)}%`,
  },
  {
    key: 'freeToPaidConversion',
    label: 'Free → Paid Conversion',
    target: '≥ 6%',
    description: 'Trialing users who convert to active',
    format: v => `${v.toFixed(1)}%`,
  },
  {
    key: 'monthlyChurn',
    label: 'Monthly Churn',
    target: '≤ 4%',
    description: 'Active users who canceled this calendar month',
    format: v => `${v.toFixed(1)}%`,
  },
  {
    key: 'costPerEmail',
    label: 'Cost Per Email',
    target: '≤ $0.04',
    description: 'Avg AI + delivery cost per digest (last 30 days)',
    format: v => `$${v.toFixed(4)}`,
  },
]

export default function AdminMetricsPage() {
  const [data, setData] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) return <div className="text-sm text-gray-400 font-sans">Failed to load metrics.</div>

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink mb-6">Metrics</h1>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: data.totalUsers },
          { label: 'MRR', value: `$${data.mrr.toFixed(2)}` },
          { label: 'Active', value: data.byStatus.active },
          { label: 'Trialing', value: data.byStatus.trialing },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-2xl font-serif text-ink mb-1">{s.value}</div>
            <div className="text-xs text-gray-400 font-sans uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 6 Non-Negotiables */}
      <div className="mb-3">
        <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-gray-400">
          The 6 Non-Negotiables — watch weekly
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NON_NEGOTIABLES.map(item => {
          const value = data.metrics[item.key]
          const light = getLight(item.key, value)
          return (
            <div key={item.key} className={`rounded-xl p-5 border ${LIGHT_STYLES[light]}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-xs font-bold tracking-wide uppercase opacity-70">
                  {item.label}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${LIGHT_DOT[light]}`} />
              </div>
              <div className="font-serif text-3xl mb-1">{item.format(value)}</div>
              <div className="text-xs opacity-60 font-sans mb-2">Target {item.target}</div>
              <div className="text-xs opacity-60 font-sans leading-snug">{item.description}</div>
            </div>
          )
        })}

        {/* Canceled + Complimentary summary card */}
        <div className="rounded-xl p-5 border border-gray-100 bg-white">
          <div className="font-sans text-xs font-bold tracking-wide uppercase text-gray-400 mb-3">
            Other Status
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-sans">
              <span className="text-gray-500">Canceled</span>
              <span className="text-ink font-semibold">{data.byStatus.canceled}</span>
            </div>
            <div className="flex justify-between text-sm font-sans">
              <span className="text-gray-500">Complimentary</span>
              <span className="text-ink font-semibold">{data.byStatus.complimentary}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
