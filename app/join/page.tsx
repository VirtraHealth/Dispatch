import type { Metadata } from 'next'
import JoinPage from './JoinPage'

export const metadata: Metadata = {
  title: 'Your thinking, amplified. | My Daily Journal',
  description: 'Connect your notes. Every morning, Claude reads what you wrote and sends you a briefing that pushes your thinking forward. Try the live demo.',
  openGraph: {
    title: 'Your thinking, amplified.',
    description: 'Try the live demo — see a real AI-generated morning briefing in 30 seconds.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your thinking, amplified.',
    description: 'Try the live demo — see a real AI-generated morning briefing in 30 seconds.',
  },
}

export default function Page() {
  return <JoinPage />
}
