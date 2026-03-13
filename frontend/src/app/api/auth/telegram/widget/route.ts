import { NextResponse } from 'next/server'

// Legacy widget endpoint — replaced by OpenID Connect flow at /api/auth/telegram/callback

export async function POST() {
  return NextResponse.json(
    { error: 'Telegram auth uses OpenID Connect now. Use the login button instead.' },
    { status: 404 }
  )
}
