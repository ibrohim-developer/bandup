import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, create } from '@/lib/strapi/api'

const MAX_MESSAGE_LEN = 5000

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { message, rating, attemptId } = body

  if (!rating && (!message || !message.trim())) {
    return NextResponse.json(
      { error: 'Please provide a rating or feedback.' },
      { status: 400 }
    )
  }
  if (rating && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
    return NextResponse.json({ error: 'Invalid rating.' }, { status: 400 })
  }
  if (message && message.length > MAX_MESSAGE_LEN) {
    return NextResponse.json({ error: 'Feedback too long' }, { status: 400 })
  }

  try {
    await create('test-feedbacks', {
      message: message?.trim() || null,
      rating: rating || null,
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
