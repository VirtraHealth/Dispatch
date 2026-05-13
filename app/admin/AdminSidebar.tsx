'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { label: 'Metrics', href: '/admin/metrics' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Marketing', href: '/admin/marketing' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-48 shrink-0 border-r border-gray-100 bg-white flex flex-col py-8 px-4">
      <div className="mb-8">
        <div className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-0.5">
          My Daily Journal
        </div>
        <div className="font-serif text-xl text-ink">Admin</div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`font-sans text-sm px-3 py-2 rounded-lg transition-colors ${
                active
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto">
        <Link
          href="/dashboard"
          className="font-sans text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Dashboard
        </Link>
      </div>
    </aside>
  )
}
