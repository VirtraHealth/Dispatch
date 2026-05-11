import Anthropic from '@anthropic-ai/sdk'
import type { DriveDoc, DigestResult } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a personal intellectual companion — part researcher, part philosopher, part business strategist. Every morning you read someone's private notes, ideas, and journal entries, then write them a rich, substantive daily email digest.

Your writing style:
- Warm, direct, and deeply specific — like a brilliant friend who has read everything and remembers all of it
- Reference what the person actually wrote — their exact ideas, specific phrases, recurring themes
- Go deep, not wide — one profound insight beats five surface observations
- Write in flowing prose. Short paragraphs. No bullet points unless listing resources
- Never use filler phrases. Get straight into the thinking
- When you mention a thinker, book, concept, or idea — be specific. Name it. Explain why it connects
- Include references to articles, books, essays, or talks the person can explore
- Always include specific book or article recommendations per section`

export async function generateDigest(
  docs: DriveDoc[],
  personalInstructions: string,
  onboardingContext: string
): Promise<DigestResult> {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const docsContext = docs
    .map(d => `--- ${d.name} (last edited ${d.modified}) ---\n${d.content}`)
    .join('\n\n')

  const userContext = [
    onboardingContext ? `Initial context from the user: ${onboardingContext}` : '',
    personalInstructions ? `Personal instructions: ${personalInstructions}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  const systemWithContext = userContext
    ? `${SYSTEM_PROMPT}\n\nUser context:\n${userContext}`
    : SYSTEM_PROMPT

  const userPrompt = `Today is ${today}.

Here is everything from the user's writing folder:

${docsContext}

---

Write a daily digest with exactly four sections. Use these exact headers:

**PHILOSOPHY**
Dive deep into the philosophical threads running through what they have been writing. Ruminate on them in relation to their actual thoughts. Connect to great philosophical traditions, specific thinkers, and ideas they may not have encountered. Trace how their thinking is evolving across entries. Push the ideas further than they have taken them. Include 1-2 specific books or essays to explore with a sentence on why each connects.

**BUSINESS & SYSTEMS**
Go deep on the business ideas and observations written about. Connect to how great business minds have thought — specific founders, investors, operators. Reference mental models and systems. Help see the structures, incentives, and patterns underneath. Make them think more rigorously. Include relevant books, frameworks, or people worth studying.

**REFLECTIONS**
Read across everything written. What patterns appear that the person might not see? What are they returning to again and again? What are they contradicting or working through? Reflect something true and specific back. Reference actual things they wrote. Notice what has changed over time.

**NEW THOUGHTS & QUESTIONS**
Give 2-3 genuinely new directions to take the thinking. Unexpected connections, bigger frameworks, or questions worth sitting with for days. End with 3-5 specific journaling questions that open something up rather than close it down.

Write the full digest now. Make it something they genuinely look forward to reading every morning.`

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2500,
    system: [
      {
        type: 'text',
        text: systemWithContext,
        cache_control: { type: 'ephemeral' }, // cache the system prompt across calls
      },
    ],
    messages: [{ role: 'user', content: userPrompt }],
  })

  const body = message.content[0].type === 'text' ? message.content[0].text : ''
  const subject = `Dispatch · ${today}`

  return { body, subject }
}
