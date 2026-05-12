import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendFeatureRequestEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { text } = await req.json()
  if (!text?.trim()) {
    return NextResponse.json({ error: 'No message provided' }, { status: 400 })
  }

  try {
    await sendFeatureRequestEmail({ from: session.user.email, text: text.trim() })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Failed to send feature request:', e)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
