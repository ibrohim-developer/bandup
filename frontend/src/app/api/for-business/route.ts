import { NextRequest, NextResponse } from 'next/server'
import { create } from '@/lib/strapi/api'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { name, phone, learning_centre_name, students_size, message } = body

  if (!name || !phone || !learning_centre_name || !students_size) {
    return NextResponse.json(
      { error: 'Please fill in all required fields.' },
      { status: 400 }
    )
  }

  try {
    await create('business-inquiries', {
      name,
      phone,
      learning_centre_name,
      students_size: String(students_size),
      message: message || null,
    })

    return NextResponse.json({ message: 'Inquiry submitted successfully' })
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    )
  }
}
