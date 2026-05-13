export type BlogPost = {
  slug: string
  title: string
  seoTitle: string
  description: string
  date: string
  readingTime: number
  persona?: 'founders' | 'thinkers' | 'students' | 'athletes'
  ctaHref: string
  ctaLabel: string
  content: Section[]
}

type Section = {
  heading?: string
  body: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-your-journal-should-write-back',
    title: 'Why Your Journal Should Write Back',
    seoTitle: 'Why Your Journal Should Write Back | My Daily Journal',
    description: 'Most journaling apps store your thoughts and do nothing with them. There is a better way — one that turns your writing into a daily conversation with your own mind.',
    date: '2025-05-01',
    readingTime: 5,
    ctaHref: '/',
    ctaLabel: 'Try My Daily Journal free',
    content: [
      {
        body: `You have been writing for years. Notes from a book you read on a flight. A voice memo transcribed after a long drive. A half-finished essay about something you can't stop thinking about. Scattered entries from the period when everything felt uncertain and you needed somewhere to put it.\n\nAll of that writing is sitting somewhere — in Notion folders you haven't opened in months, in a Google Drive you share with no one, in a journaling app that faithfully stores everything and gives you nothing back.\n\nThis is the problem with almost every journaling tool ever made. They are excellent archives and terrible thinking partners.`,
      },
      {
        heading: 'The illusion of the blank page',
        body: `Traditional journaling starts with a prompt or nothing at all. You open the app, face the cursor, and try to summon something useful from the static of your day. Sometimes it works. More often you write in circles, relitigating things you've already decided, restating problems you already know.\n\nThe blank page has a structural problem: it doesn't know what you wrote yesterday, or last week, or three months ago when you first started worrying about the thing you're worrying about now. Every session begins from zero.\n\nWhat if instead, something read everything you'd written — and wrote back?`,
      },
      {
        heading: 'What a thinking partner actually does',
        body: `A great thinking partner — a therapist, a brilliant friend, a good editor — does something specific. They read your material before the conversation. They come in having thought about it. They notice the thread you didn't see, the contradiction you've been living around, the question underneath the question you asked.\n\nThey don't wait for you to perform insight. They bring something to the table.\n\nThis is what My Daily Journal is built to do. Each morning, it reads everything in your connected writing folders — your journal entries, your notes, your documents in progress — and sends you a digest that pushes your thinking forward. Not a summary. Not a productivity report. A genuine intellectual response to what you've been writing about, as if someone who knew you well had sat with your work overnight.`,
      },
      {
        heading: 'What you actually get',
        body: `Every morning digest finds the live question in your writing — the thing you keep returning to, the tension you haven't resolved — and thinks alongside you about it. It names thinkers and works in your domain that connect directly to what you wrote. It reflects your own patterns back to you: the assumption you've been making, the possibility you haven't considered, the sentence from three weeks ago that turns out to matter.\n\nIt ends with questions worth sitting with for days.\n\nThe goal isn't to tell you what to think. It's to show you what you already are thinking, more clearly than you could see it yourself.`,
      },
      {
        heading: 'The writing you do matters more now',
        body: `One unexpected effect people report: they write more. Not because they feel obligated to, but because they know something thoughtful is coming back. The journal stops feeling like a monologue into the void and starts feeling like a correspondence.\n\nYou send your thinking out each night. Something reads it carefully and responds each morning. The loop closes.\n\nThat's the difference between an archive and a conversation partner. And it turns out the conversation partner is what most of us have been looking for all along.`,
      },
    ],
  },
  {
    slug: 'founders-morning-ritual-strategic-clarity',
    title: 'The Founder\'s Morning Ritual for Strategic Clarity',
    seoTitle: 'Morning Journaling for Founders: Build Strategic Clarity | My Daily Journal',
    description: 'The best founders treat their journals like a board they can actually think with. Here is how daily AI-assisted reflection helps you stay sharp when everything is moving fast.',
    date: '2025-05-06',
    readingTime: 6,
    persona: 'founders',
    ctaHref: '/founders',
    ctaLabel: 'See how founders use My Daily Journal',
    content: [
      {
        body: `Most founder advice is about what to do. Read this book. Use this framework. Implement this system. The advice accumulates and eventually becomes noise — because the real challenge isn't knowing what to do in the abstract. It's knowing what to do *right now*, with your specific company, your specific constraints, your specific team.\n\nThe founders I've watched navigate this well have one thing in common: they write. Not tweets, not memos. They write for themselves — rough, honest, exploratory — and they do it every morning before the day starts eating them.`,
      },
      {
        heading: 'Why writing is a strategy tool',
        body: `Jeff Bezos famously banned PowerPoint at Amazon and replaced it with six-page memos — not because he preferred long documents, but because writing forces clarity that bullet points allow you to fake. If you can't write a coherent paragraph about your strategy, you don't have a coherent strategy. You have a mood.\n\nPersonal journaling does something related but different. It's not about producing something legible to others. It's about catching yourself in the act of thinking — noticing what assumptions you're making, what you're avoiding, what the same problem looks like on day 90 versus day 1.\n\nThe best founders treat their journal not as a diary but as a low-stakes board meeting they hold with themselves every morning.`,
      },
      {
        heading: 'The problem with reading your own writing',
        body: `Here's the structural challenge: you're too close to your own material. You know what you meant, so you can't see what you actually said. You know what problem you're trying to solve, so the unexamined assumption underneath it stays invisible.\n\nYou need something that will read your material the way a good outside investor would — pattern-matching across everything you've written, asking the uncomfortable questions, naming the thing you keep dancing around.\n\nThis is the gap My Daily Journal is built to fill. Connect your writing folders. Every morning, it reads everything you've written and sends back a digest that names what you're really wrestling with, pushes the thinking further, and asks the questions worth sitting with.`,
      },
      {
        heading: 'What strategic clarity actually looks like',
        body: `Most strategy work happens in the wrong direction — too much time spent on the polished presentation of a decision already made, too little time asking whether the decision is the right one.\n\nStrategic clarity isn't about knowing the answer. It's about knowing the right question — and being honest enough with yourself to see when the question has changed.\n\nThe founders who do this well don't have better information. They have better habits of reflection. They notice when their thinking has shifted. They catch the assumption earlier. They feel the pivot point before it becomes a crisis.\n\nThat's what a daily writing practice, taken seriously, actually builds.`,
      },
      {
        heading: 'Twenty minutes before the day starts',
        body: `The practice is simple. Twenty minutes every morning before your inbox opens. Write about what's actually on your mind — not the polished version, the real one. What's working. What isn't. What you're anxious about. What you're avoiding.\n\nThen read your digest. Not as instructions — as a thinking partner. It will find the thread you didn't see. It will name something you wrote two weeks ago that turns out to matter now. It will push the question further than you'd taken it alone.\n\nThen close it and go run your company.\n\nThe clarity compound interest.`,
      },
    ],
  },
  {
    slug: 'how-to-actually-learn-from-what-you-read',
    title: 'How to Actually Learn From What You Read',
    seoTitle: 'How to Learn From Books and Notes: AI Study Journal | My Daily Journal',
    description: 'Reading widely doesn\'t automatically make you smarter. Here is the daily practice that turns scattered notes and highlights into real understanding.',
    date: '2025-05-10',
    readingTime: 5,
    persona: 'students',
    ctaHref: '/students',
    ctaLabel: 'See how students use My Daily Journal',
    content: [
      {
        body: `You read more than most people. Books, papers, long articles, threads that turn into forty tabs. You take notes — highlights, voice memos, document fragments — because you know the feeling of reading something extraordinary and then, three months later, not being able to articulate what it actually said.\n\nThe notes accumulate. The insights, somehow, don't.`,
      },
      {
        heading: 'The forgetting problem',
        body: `Hermann Ebbinghaus charted the forgetting curve in 1885 and it remains one of the most depressing graphs in cognitive science. Without review, you forget roughly 70% of new information within 24 hours. Without active engagement — without doing something with an idea — most of what you read never consolidates into understanding at all.\n\nHighlighting feels productive. Summarizing feels productive. But neither forces you to actually *think* about the material — to connect it to what you already know, to notice where it creates tension with something you believed last month, to find the question it opens rather than just the answer it closes.`,
      },
      {
        heading: 'What understanding actually requires',
        body: `The cognitive science on this is clear: understanding requires elaborative encoding. You need to do something active with the information — relate it to prior knowledge, explain it in your own words, find an example, find a counterexample, notice what it implies.\n\nThis is why writing is so powerful as a learning tool. Not transcribing — writing. Taking an idea and putting it into your own words, in your own context, connected to your own questions.\n\nThe notebook isn't a backup drive. It's the actual site of learning.`,
      },
      {
        heading: 'What My Daily Journal does differently',
        body: `Most study tools are about retrieval: flashcards, spaced repetition, quizzes. These are useful for memorizing facts. They are nearly useless for building understanding of complex ideas.\n\nMy Daily Journal takes a different approach. Connect your notes and writing folders — your reading notes, your course documents, your thinking-out-loud journals — and each morning it reads across everything and sends you a digest that connects dots you didn't see.\n\nIt finds the thread running through your last week of reading. It names what you're actually grappling with intellectually — not just what you've encountered. It points to thinkers, books, and ideas that connect directly to what you wrote. And it asks you questions that force you to figure out what you actually think.`,
      },
      {
        heading: 'The practice',
        body: `Write about what you're reading, not just notes from it. What did you not understand? What did you disagree with? What reminded you of something else? What changed about how you see something?\n\nBad notes look like transcription. Good notes look like an argument you're having with the author.\n\nWhen My Daily Journal reads those notes every morning, it's reading material that's actually processed. It can connect your argument with this book to your confusion with that lecture to the question you've been circling for weeks. It becomes a genuine intellectual interlocutor — someone who has read everything you've written and is thinking alongside you.\n\nThat is what understanding feels like from the outside. It's not accumulation. It's the slow development of a real perspective on something.`,
      },
    ],
  },
  {
    slug: 'the-case-for-thinking-on-paper',
    title: 'The Case for Thinking on Paper',
    seoTitle: 'Why Smart People Write Every Day | My Daily Journal',
    description: 'The most productive thinkers across every field share one habit: they write to think, not to record. Here is why — and how to build the same practice.',
    date: '2025-05-13',
    readingTime: 7,
    ctaHref: '/',
    ctaLabel: 'Start your daily writing practice',
    content: [
      {
        body: `Richard Feynman once told a historian who wanted to include his notebooks in an archive that the notebooks weren't a record of his thinking — they *were* his thinking. He wasn't writing down ideas he'd already had. He was using the page to have them in the first place.\n\nThis is what distinguishes people who write to think from people who write to record. The first group uses the friction of language to discover what they actually mean. The second group tries to capture what they've already figured out.\n\nThe first group almost always thinks better.`,
      },
      {
        heading: 'Why language creates clarity',
        body: `There is a specific cognitive mechanism at work here. When you think in your head, you are working with compressed, fuzzy representations — images, feelings, vague gestures toward ideas. The sense of understanding is always slightly ahead of the actual understanding.\n\nWriting forces decompression. You cannot write "the thing with the incentive structure" — you have to say what the thing is, what the incentive structure is, and why one connects to the other. The sentence either makes sense or it doesn't. There is nowhere to hide.\n\nThis is why Flannery O'Connor said she didn't know what she thought until she read what she wrote. She wasn't being modest. She was describing an accurate cognitive phenomenon.`,
      },
      {
        heading: 'The private notebook tradition',
        body: `Look at the private notebooks of any serious thinker across any field and the pattern is consistent: rough, exploratory, unpublishable in form, essential in function.\n\nDarwin's notebooks were full of false starts and dead ends alongside the observations that became On the Origin of Species. Einstein wrote to himself in German about thought experiments he wouldn't publish for years. Joan Didion kept notebooks not to remember facts but to "keep on nodding terms" with her past selves — to understand how she had changed.\n\nThe notebook is where thinking happens that can't happen under observation. It's the space before the idea is legible to anyone else, including yourself.`,
      },
      {
        heading: 'The problem with writing into the void',
        body: `There is a loneliness to serious private writing. You send your thinking out into a folder that will never respond. You write about the same problem for six weeks and have no way of knowing whether you're going in circles or slowly circling something real.\n\nThis is the gap that My Daily Journal is designed to close. Connect your writing folders and each morning receive a digest that has read everything you've written — across weeks, across notebooks, across the sprawl of your actual thinking — and responds to it thoughtfully.\n\nIt finds the thread you didn't see. It names the pattern across your last month of entries. It pushes the question further than you'd taken it alone. It asks the questions worth sitting with for days.\n\nThe private notebook stays private. But it stops being a monologue.`,
      },
      {
        heading: 'Starting the practice',
        body: `The resistance most people feel about writing isn't about the writing itself. It's about not knowing what to write, and feeling that what they produce doesn't justify the time.\n\nBoth problems are solved the same way: lower the stakes. You are not producing anything. You are using language as a thinking tool. Bad sentences are fine. Incomplete thoughts are fine. Writing the same thing you wrote yesterday is fine if you've moved even one inch.\n\nThe bar is: did writing this help you think? Not: is this good? Not: would anyone want to read this? Not: does this represent a breakthrough?\n\nWrite in the morning before the day interrupts. Write for twenty minutes. Write the actual thing on your mind, not the version of it you'd be comfortable sharing.\n\nThen read what comes back.`,
      },
    ],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}
