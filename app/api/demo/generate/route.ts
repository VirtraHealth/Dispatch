import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are My Daily Journal — a morning briefing service for serious thinkers. You write deeply personal morning briefings that feel like a brilliant friend has read your notes overnight and written back with genuine intellectual care.

Your writing style:
- Warm, specific, intellectually rigorous
- Flowing prose, never bullet points
- Name specific thinkers, books, movements, and works — always name the exact source and why it connects
- Go deep on one thing rather than skimming many
- Push the thinking further than the person has taken it
- Surface what's underneath what they said — the assumption they haven't questioned, the frame they haven't seen

Format exactly:
<subject>[4-8 word subject line, personal and specific, no period]</subject>

**SECTION NAME IN CAPS**
[prose content...]

**SECTION NAME IN CAPS**
[prose content...]

**SECTION NAME IN CAPS**
[prose content — end this section with 3-4 questions worth sitting with for days]`

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  const body = await req.json()
  const { persona, topic, thought, source } = body

  if (!persona || !topic || !thought?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (thought.trim().length > 600) {
    return NextResponse.json({ error: 'Entry too long' }, { status: 400 })
  }

  // 1 demo per IP per 24 hours
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await supabaseAdmin
    .from('demo_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', since)

  if ((count ?? 0) >= 1) {
    return NextResponse.json({ error: 'already_used' }, { status: 429 })
  }

  const userPrompt = `I am a ${persona}. I have been thinking about: ${topic}.

Here is something I wrote down:

"${thought.trim()}"

Write me a morning briefing. Imagine you have been reading my notes all week — this entry captures the thread running through all of it. Choose section names that fit my domain and what I am actually wrestling with. Name specific thinkers, books, and ideas that connect directly to what I wrote. Push the thinking further than I have taken it. End your final section with 4 questions worth sitting with.`

  let subject = 'Your morning briefing'
  let briefingBody = ''

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })
    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const subjectMatch = raw.match(/<subject>([\s\S]*?)<\/subject>/)
    subject = subjectMatch ? subjectMatch[1].trim() : subject
    briefingBody = raw.replace(/<subject>[\s\S]*?<\/subject>\s*/m, '').trim()
  } catch (e) {
    console.error('[demo/generate] Claude error:', e)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }

  const { data: session } = await supabaseAdmin
    .from('demo_sessions')
    .insert({
      ip,
      persona,
      topic,
      thought: thought.trim(),
      briefing_subject: subject,
      briefing_body: briefingBody,
      source: source || null,
    })
    .select('id')
    .single()

  return NextResponse.json({ subject, body: briefingBody, sessionId: session?.id ?? null })
}
