import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const COOKIE_NAME = 'strapi_jwt'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const accessToken = searchParams.get('access_token')

  if (accessToken) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (res.ok) {
        const cookieStore = await cookies()
        cookieStore.set(COOKIE_NAME, accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        })
        return NextResponse.redirect(`${SITE_URL}/dashboard/reading`)
      }
    } catch {
      // Fall through to error redirect
    }
  }

  return NextResponse.redirect(`${SITE_URL}/sign-in?error=auth_callback_error`)
}