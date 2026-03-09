import { NextRequest, NextResponse } from 'next/server'
import { create } from '@/lib/strapi/api'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { message, attemptId, userId } = body

  if (!message || !message.trim()) {
    return NextResponse.json(
      { error: 'Please enter your feedback.' },
      { status: 400 }
    )
  }

  try {
    await create('test-feedbacks', {
      message: message.trim(),
      test_attempt: attemptId || null,
      user_id: userId || null,
    })

    return NextResponse.json({ message: 'Feedback submitted successfully' })
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit feedback. Please try again.' },
      { status: 500 }
    )
  }
}
