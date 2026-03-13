import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createRemoteJWKSet, jwtVerify } from 'jose'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN!
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const BOT_ID = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID || ''

const JWKS = createRemoteJWKSet(new URL('https://oauth.telegram.org/.well-known/jwks.json'))

function getDeterministicPassword(telegramId: string): string {
  return crypto
    .createHmac('sha256', STRAPI_API_TOKEN)
    .update(`tg_${telegramId}`)
    .digest('hex')
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const cookieStore = await cookies()
  const savedState = cookieStore.get('telegram_oauth_state')?.value
  const codeVerifier = cookieStore.get('telegram_code_verifier')?.value

  // Clean up OAuth cookies
  cookieStore.delete('telegram_oauth_state')
  cookieStore.delete('telegram_code_verifier')

  // Validate state
  if (!code || !state || !savedState || state !== savedState || !codeVerifier) {
    console.error('Telegram state validation failed', { code: !!code, state, savedState, codeVerifier: !!codeVerifier })
    return NextResponse.redirect(`${SITE_URL}/sign-in?error=tg_state_invalid`)
  }

  try {
    // Exchange code for tokens
    const redirectUri = `${SITE_URL}/api/auth/telegram/callback`
    const credentials = Buffer.from(`${BOT_ID}:${TELEGRAM_BOT_TOKEN}`).toString('base64')

    const tokenRes = await fetch('https://oauth.telegram.org/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: BOT_ID,
        code_verifier: codeVerifier,
      }),
    })

    if (!tokenRes.ok) {
      const errText = await tokenRes.text()
      console.error('Telegram token exchange failed:', errText)
      return NextResponse.redirect(`${SITE_URL}/sign-in?error=tg_token_failed`)
    }

    const tokenData = await tokenRes.json()
    const idToken = tokenData.id_token

    // Verify and decode the ID token
    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: 'https://oauth.telegram.org',
      audience: BOT_ID,
    })

    const telegramId = payload.sub!
    const fullName = (payload.name as string) || ''
    const avatarUrl = (payload.picture as string) || ''
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
      // Existing user — update and login
      const user = existingUsers[0]

      await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          password,
          full_name: fullName || user.full_name,
          avatar_url: avatarUrl || user.avatar_url,
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
        console.error('Strapi login failed:', await loginRes.text())
        return NextResponse.redirect(`${SITE_URL}/sign-in?error=tg_login_failed`)
      }

      const loginData = await loginRes.json()
      jwt = loginData.jwt
    } else {
      // New user — register
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
        console.error('Telegram user registration failed:', await registerRes.text())
        return NextResponse.redirect(`${SITE_URL}/sign-in?error=tg_register_failed`)
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

    // Set JWT cookie and redirect to dashboard
    cookieStore.set('strapi_jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    })

    return NextResponse.redirect(`${SITE_URL}/dashboard/reading`)
  } catch (error) {
    console.error('Telegram auth error:', error)
    return NextResponse.redirect(`${SITE_URL}/sign-in?error=tg_exception`)
  }
}
