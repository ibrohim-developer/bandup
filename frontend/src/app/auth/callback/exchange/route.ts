import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const COOKIE_NAME = 'strapi_jwt'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const accessToken = searchParams.get('access_token')

  if (accessToken) {
    try {
      // First try: use as Strapi JWT directly
      const meRes = await fetch(`${STRAPI_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (meRes.ok) {
        const cookieStore = await cookies()
        cookieStore.set(COOKIE_NAME, accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        })
        return NextResponse.redirect(`${SITE_URL}/dashboard`)
      }

      // Second try: exchange Google access_token for Strapi JWT
      const exchangeRes = await fetch(
        `${STRAPI_URL}/api/auth/google/callback?access_token=${accessToken}`
      )

      if (exchangeRes.ok) {
        const data = await exchangeRes.json()
        if (data.jwt) {
          const cookieStore = await cookies()
          cookieStore.set(COOKIE_NAME, data.jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60,
          })
          return NextResponse.redirect(`${SITE_URL}/dashboard`)
        }
      }
    } catch (err) {
      console.error('[auth/exchange] error:', err)
    }
  }

  return NextResponse.redirect(`${SITE_URL}/sign-in?error=auth_callback_error`)
}
