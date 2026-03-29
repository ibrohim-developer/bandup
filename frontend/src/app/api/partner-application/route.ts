import { NextRequest, NextResponse } from 'next/server'
import { create } from '@/lib/strapi/api'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { centerName, centerType, fullName, email, phone, location, studentBase, description, agreeTerms } = body

  if (!centerName || !centerType || !fullName || !email || !phone || !location || !studentBase || !description || !agreeTerms) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  try {
    await create('business-inquiries', {
      name: fullName,
      phone,
      learning_centre_name: centerName,
      students_size: studentBase,
      center_type: centerType,
      email,
      location,
      message: description,
    })

    return NextResponse.json({ success: true, message: 'Application submitted successfully. Our team will contact you soon.' })
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    )
  }
}
