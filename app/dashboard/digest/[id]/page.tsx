import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { parseBodyToHtml } from '@/lib/parse-digest'
import { DigestFeedback } from '@/components/DigestFeedback'
import Link from 'next/link'

export default async function DigestDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/')

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!user) redirect('/')

  const { data: digest } = await supabaseAdmin
    .from('digests')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!digest) redirect('/dashboard')

  const date = new Date(digest.sent_at).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const bodyHtml = parseBodyToHtml(digest.body_html || '')

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-6 py-12">

        <div className="mb-10">
          <Link
            href="/dashboard"
            className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            ← My Daily Journal
          </Link>
        </div>

        <div className="mb-10 pb-8 border-b border-gray-100">
          <h1 className="font-serif text-3xl text-ink mb-3 leading-tight">
            {digest.subject || date}
          </h1>
          <p className="text-sm text-gray-400 font-sans">{date}</p>
          {digest.docs_read?.length > 0 && (
            <p className="text-xs text-gray-300 font-sans mt-1">
              Read from: {digest.docs_read.join(' · ')}
            </p>
          )}
        </div>

        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />

        <DigestFeedback digestId={digest.id} existingFeedback={digest.feedback} />

      </div>
    </div>
  )
}
