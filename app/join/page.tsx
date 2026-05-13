import type { Metadata } from 'next'
import JoinForm from './JoinForm'

export const metadata: Metadata = {
  title: 'Start thinking more clearly every morning | My Daily Journal',
  description: 'Connect your writing. Get a daily digest from Claude that reads your notes and pushes your thinking forward. Join free.',
  openGraph: {
    title: 'Your journal, writing back.',
    description: 'Every morning, Claude reads your notes and sends back a digest that pushes your thinking forward. Free to try.',
    type: 'website',
    images: [{ url: '/og-join.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your journal, writing back.',
    description: 'Every morning, Claude reads your notes and sends back a digest that pushes your thinking forward.',
  },
}

export default function JoinPage() {
  return <JoinForm />
}
