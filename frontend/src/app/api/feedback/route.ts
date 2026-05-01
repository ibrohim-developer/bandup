import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, create } from '@/lib/strapi/api'

const MAX_MESSAGE_LEN = 5000

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { message, attemptId } = body

  if (!message || !message.trim()) {
    return NextResponse.json(
      { error: 'Please enter your feedback.' },
      { status: 400 }
    )
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return NextResponse.json({ error: 'Feedback too long' }, { status: 400 })
  }

  try {
    await create('test-feedbacks', {
      message: message.trim(),
      test_attempt: attemptId || null,
      user_id: String(user.id),
    })

    return NextResponse.json({ message: 'Feedback submitted successfully' })
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit feedback. Please try again.' },
      { status: 500 }
    )
  }
}
