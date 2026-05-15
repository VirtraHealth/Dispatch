import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { JournalEntry } from '@/types'

function parseEntries(content: string): JournalEntry[] {
  if (!content.trim()) return []
  const blocks = content.split(/(?=\[\d{4}-\d{2}-\d{2}T)/).filter(Boolean)
  return blocks
    .reverse()
    .slice(0, 20)
    .map((block, i) => {
      const match = block.match(/^\[(.+?)\]\n([\s\S]*?)$/)
      if (!match) return null
      return { id: String(i), content: match[2].trim(), created_at: match[1] }
    })
    .filter((e): e is JournalEntry => e !== null)
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: journal } = await supabaseAdmin
    .from('user_journals')
    .select('content')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({ entries: parseEntries(journal?.content || '') })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { content } = await req.json()
  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: existing } = await supabaseAdmin
    .from('user_journals')
    .select('content')
    .eq('user_id', user.id)
    .single()

  const now = new Date().toISOString()
  const newBlock = `[${now}]\n${content.trim()}\n\n`
  const updatedContent = (existing?.content || '') + newBlock

  const { error } = await supabaseAdmin
    .from('user_journals')
    .upsert(
      { user_id: user.id, content: updatedContent, updated_at: now },
      { onConflict: 'user_id' }
    )

  if (error) {
    console.error('[journal] Upsert failed:', error)
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 })
  }

  return NextResponse.json({ entry: { id: now, content: content.trim(), created_at: now } })
}
