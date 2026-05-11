import Anthropic from '@anthropic-ai/sdk'
import type { DriveDoc, DigestResult } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a personal intellectual companion — part researcher, part philosopher, part business strategist. Every morning you read someone's private notes, ideas, and journal entries, then write them a rich, substantive daily digest.

Your first and most important task is to understand exactly what this person is wrestling with right now. Read everything they wrote. Find the live question — the thing they keep returning to, the tension they haven't resolved, the idea that's pulling them forward. That live question is the thread that runs through everything you write today.

Your writing style:
- Warm, direct, and deeply specific — like a brilliant friend who has read everything and remembers all of it
- Reference what the person actually wrote — their exact phrases, specific observations, the thing they mentioned twice
- Go deep, not wide — one profound insight beats five surface observations
- Write in flowing prose, short paragraphs, no bullet points unless listing resources
- Never use filler phrases — get straight into the thinking
- When you mention a thinker, book, concept, or idea — name it precisely, explain why it connects to what they wrote
- Push their ideas further than they have taken them — show them what's on the other side of the thought
- Surface the contradiction or assumption buried in their thinking — the thing they haven't questioned yet
- Always include specific book, article, or essay recommendations with a sentence on exactly why each connects to what they wrote today

Subject line philosophy:
- 4-8 words, no punctuation at the end
- Feels personal and specific, not generic
- Makes the reader feel seen — like it was written about something only they would write
- Creates curiosity without being clickbait
- Examples of good subject lines: "The question you keep circling", "What your notes say about you", "Three ideas competing for your attention", "The assumption underneath the assumption"`

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
    onboardingContext ? `Context from the user about what they are working on: ${onboardingContext}` : '',
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

First, identify the live question running through this person's writing — the thing they're genuinely wrestling with right now. Let that question anchor everything you write.

Output format — write these exactly in this order:

<subject>[your subject line here — 4-8 words, specific to what they actually wrote, no period at end]</subject>

Then the four sections, each with exactly this header format:

**PHILOSOPHY**
Find the philosophical thread alive in what they wrote. Don't summarize — push the idea. Connect it to a specific thinker or tradition they may not know. Show them where this line of thinking leads if they follow it further. Notice if they're approaching something Nietzsche spent his life on, or a problem Wittgenstein dismantled, or a question Buddhism answered differently than the West. Reference their actual words. End with 1-2 specific books or essays to explore, with a sentence on exactly why each one connects to what they wrote today.

**BUSINESS & SYSTEMS**
Find the business or systems thinking alive in their writing. Connect it to how specific founders, investors, or operators have faced the same question. Surface the underlying structure, incentive, or pattern they might not see yet. What does a mental model from Charlie Munger, or a framework from Clay Christensen, or a lesson from a specific company's history illuminate here? Make them think more rigorously. Include a specific book, essay, or person worth studying that connects directly to what they're working on.

**REFLECTIONS**
Read across everything they wrote. What are they returning to again and again without quite saying it? What contradiction is sitting in their writing? What has shifted since earlier entries — what used to bother them that doesn't anymore, or what new tension has appeared? Reflect something true and specific back to them that they couldn't see from inside it. Reference exact phrases or ideas they wrote.

**NEW THOUGHTS & QUESTIONS**
Give 2-3 genuinely new directions to take their thinking — unexpected connections, a bigger frame, an inversion of what they assumed. Then end with 3-5 specific journaling questions. Not generic questions — questions that open a door in their specific thinking right now. Questions worth sitting with for days.

Write the full digest now. Make it something they genuinely look forward to reading.`

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 3500,
    system: [
      {
        type: 'text',
        text: systemWithContext,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userPrompt }],
  })

  const rawOutput = message.content[0].type === 'text' ? message.content[0].text : ''

  // Parse subject from <subject>...</subject> tag
  const subjectMatch = rawOutput.match(/<subject>([\s\S]*?)<\/subject>/)
  const subject = subjectMatch ? subjectMatch[1].trim() : `Dispatch · ${today}`

  // Strip the subject tag from the body
  const body = rawOutput.replace(/<subject>[\s\S]*?<\/subject>\s*/m, '').trim()

  return { body, subject }
}
