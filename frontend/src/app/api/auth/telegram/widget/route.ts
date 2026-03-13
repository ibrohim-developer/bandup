import { NextResponse } from 'next/server'
import crypto from 'crypto'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN!
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!

interface TelegramWidgetData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

function verifyTelegramWidget(data: TelegramWidgetData): boolean {
  const secret = crypto.createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest()

  const checkFields: string[] = []
  const entries = Object.entries(data) as [string, string | number][]
  for (const [key, value] of entries) {
    if (key !== 'hash') {
      checkFields.push(`${key}=${value}`)
    }
  }
  checkFields.sort()
  const checkString = checkFields.join('\n')

  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex')
  return hmac === data.hash
}

function getDeterministicPassword(telegramId: number): string {
  return crypto
    .createHmac('sha256', STRAPI_API_TOKEN)
    .update(`tg_${telegramId}`)
    .digest('hex')
}

export async function POST(request: Request) {
  try {
    const widgetData: TelegramWidgetData = await request.json()

    // Verify HMAC signature
    if (!verifyTelegramWidget(widgetData)) {
      return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 401 })
    }

    // Check auth_date freshness (1 hour max)
    const now = Math.floor(Date.now() / 1000)
    if (now - widgetData.auth_date > 3600) {
      return NextResponse.json({ error: 'Authentication data expired' }, { status: 401 })
    }

    const telegramId = widgetData.id
    const fullName = [widgetData.first_name, widgetData.last_name].filter(Boolean).join(' ')
    const avatarUrl = widgetData.photo_url || ''
    const syntheticEmail = `tg_${telegramId}@telegram.bandup.uz`
    const password = getDeterministicPassword(telegramId)

    // Try to find existing user by telegram_id
    const findRes = await fetch(
      `${STRAPI_URL}/api/users?filters[telegram_id][$eq]=${telegramId}`,
      { headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` } }
    )
    const existingUsers = await findRes.json()

    let jwt: string

    if (existingUsers && existingUsers.length > 0) {
      // Existing user — log in via Strapi local auth
      const user = existingUsers[0]

      // Update password to deterministic value (handles migration from prior systems)
      await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          password,
          full_name: fullName,
          avatar_url: avatarUrl,
        }),
      })

      const loginRes = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: user.email,
          password,
        }),
      })

      if (!loginRes.ok) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 })
      }

      const loginData = await loginRes.json()
      jwt = loginData.jwt
    } else {
      // New user — register via Strapi
      const registerRes = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: `tg_${telegramId}`,
          email: syntheticEmail,
          password,
        }),
      })

      if (!registerRes.ok) {
        const err = await registerRes.json()
        return NextResponse.json(
          { error: err?.error?.message || 'Registration failed' },
          { status: 500 }
        )
      }

      const registerData = await registerRes.json()
      jwt = registerData.jwt

      // Update user with telegram_id, full_name, avatar_url
      await fetch(`${STRAPI_URL}/api/users/${registerData.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          telegram_id: telegramId,
          full_name: fullName,
          avatar_url: avatarUrl,
        }),
      })
    }

    // Set JWT cookie and return success
    const response = NextResponse.json({ success: true })
    response.cookies.set('strapi_jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('Telegram auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
