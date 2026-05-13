import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <span className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600">
          My Daily Journal
        </span>
        <h1 className="font-serif text-3xl text-ink mt-6 mb-3">Page not found</h1>
        <p className="text-sm text-gray-500 font-sans mb-8">
          This page doesn&apos;t exist or may have moved.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/dashboard"
            className="w-full max-w-xs block bg-ink text-white rounded-xl py-3 text-sm font-semibold font-sans hover:bg-gray-800 transition-colors"
          >
            ← Dashboard
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 font-sans transition-colors"
          >
            ← Home
          </Link>
        </div>
      </div>
    </div>
  )
}
