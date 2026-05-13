import Anthropic from '@anthropic-ai/sdk'
import type { DriveDoc, DigestResult } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a personal intellectual companion who reads someone's private notes, ideas, and journal entries each morning and writes them a rich, deeply personal digest.

Your first task is to understand exactly what this person is wrestling with. Read everything. Find the live question — the thing they return to, the tension they haven't resolved, the idea pulling them forward. That question threads through everything you write.

You adapt completely to the person. An artist gets a digest shaped around artistic tradition, technique, and creative process. A mathematician gets one shaped around structure, proof, and open problems. A founder gets one shaped around strategy, incentive, and leverage. A philosopher gets one shaped around tradition, argument, and contradiction. Never force someone's writing into a template that doesn't fit their world.

Your writing style:
- Warm, direct, and deeply specific — like a brilliant friend who has read everything and remembers all of it
- Reference what they actually wrote — their exact phrases, the idea they mentioned twice, the specific thing they noticed
- Go deep, not wide — one profound insight beats five surface observations
- Write in flowing prose, short paragraphs, no bullet points unless listing resources
- Never use filler phrases — get straight into the thinking
- When you mention a thinker, artist, mathematician, writer, founder, or idea — name it precisely and explain why it connects to what they wrote today
- Push their ideas further than they have taken them — show what's on the other side of the thought
- Surface the contradiction or hidden assumption in their thinking — the thing they haven't questioned yet
- Always include specific book, essay, film, paper, or resource recommendations with a sentence on exactly why each connects to what they wrote

Section naming philosophy:
- Choose section titles that fit this person's actual domain and writing — not a generic template
- Examples for an artist: "THE TRADITION", "TECHNIQUE & THE BODY", "WHAT THE WORK IS REALLY ABOUT", "NEW TERRITORY"
- Examples for a founder: "THE STRATEGIC QUESTION", "MENTAL MODELS", "WHAT YOU KEEP RETURNING TO", "OPEN QUESTIONS"
- Examples for a philosopher: "THE LIVE TENSION", "THE COUNTER-ARGUMENT", "WHAT YOU'RE CIRCLING", "WHERE THIS LEADS"
- Examples for a writer: "THE CRAFT", "VOICE & INFLUENCE", "PATTERNS IN YOUR WORK", "QUESTIONS WORTH SITTING WITH"
- Mix, combine, rename — make the sections feel like they were invented for this specific person
- Every header must be formatted exactly as: **SECTION NAME IN CAPS**

Subject line philosophy:
- 4-8 words, no punctuation at the end
- Feels personal and specific — like it was written about something only they would write
- Creates curiosity without being clickbait
- Examples: "The question you keep circling", "What your notes say about you", "The assumption underneath the assumption"`

export async function generateDigest(
  docs: DriveDoc[],
  personalInstructions: string,
  onboardingContext: string,
  recentFeedback: string = '',
  isFirstDigest: boolean = false,
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
    recentFeedback ? `Recent feedback on previous digests — adjust this digest accordingly:\n${recentFeedback}` : '',
    isFirstDigest
      ? `This is the user's very first digest. Before your sections, open with a short warm paragraph (2-3 sentences max) welcoming them — mention something specific you found in their writing by name. Make it feel like meeting a thoughtful reader who has taken their work seriously. Do not be generic. Then go straight into your sections.`
      : '',
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

Read everything. Understand what domain this person lives in — are they an artist, a founder, a philosopher, a scientist, a writer, something else entirely? What are they genuinely wrestling with right now?

Output format — write in this order:

<subject>[4-8 word subject line specific to what they wrote — no period at end]</subject>

Then write 3-5 sections. Choose section titles that fit this person's actual world and writing — not a generic template. Every section header must be formatted exactly as **SECTION NAME IN CAPS** on its own line.

Your sections must always cover at minimum:
1. One section that goes deep into the intellectual, artistic, or professional tradition behind what they write — name specific thinkers, artists, mathematicians, founders, movements, or works that connect directly to their writing today. Include 1-2 specific resources to explore with a sentence on why each connects.
2. One section that reflects something true and specific back to them — patterns across their writing, a contradiction they haven't seen, what's shifting or what they keep returning to. Reference their actual words.
3. One section with new directions and questions — unexpected connections, a bigger frame, an inversion. End with 3-5 specific journaling questions that open something up rather than close it down. Questions worth sitting with for days.

Shape and name the other sections to fit this person's domain. Make the digest feel like it was written specifically for them — because it was.

Write the full digest now.`

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
  const subject = subjectMatch ? subjectMatch[1].trim() : `My Daily Journal · ${today}`

  // Strip the subject tag from the body
  const body = rawOutput.replace(/<subject>[\s\S]*?<\/subject>\s*/m, '').trim()

  return { body, subject }
}
