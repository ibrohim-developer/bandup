import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

export async function POST(request: Request) {
  const { code } = await request.json()

  if (!code || typeof code !== 'string' || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
  }

  const res = await fetch(`${STRAPI_URL}/api/telegram-auth/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })

  const data = await res.json()

  if (!res.ok) {
    const message = data?.error?.message || data?.message || 'Invalid or expired code'
    return NextResponse.json({ error: message }, { status: res.status })
  }

  if (!data.jwt) {
    return NextResponse.json({ error: 'No token returned' }, { status: 500 })
  }

  const cookieStore = await cookies()
  cookieStore.set('strapi_jwt', data.jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  })

  return NextResponse.json({ ok: true })
}
