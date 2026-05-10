import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const COOKIE_NAME = 'strapi_jwt'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const accessToken = url.searchParams.get('access_token')

  if (accessToken) {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/auth/google/callback?access_token=${accessToken}`
      )

      if (res.ok) {
        const data = await res.json()

        if (data.jwt && data.user?.id) {
          const cookieStore = await cookies()
          cookieStore.set(COOKIE_NAME, data.jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60,
          })

          let isNewSignup = false
          try {
            const meRes = await fetch(`${STRAPI_URL}/api/users/${data.user.id}`, {
              headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
              cache: 'no-store',
            })
            if (meRes.ok) {
              const me = await meRes.json()
              if (!me.pixel_signup_fired) {
                isNewSignup = true
                await fetch(`${STRAPI_URL}/api/users/${data.user.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
                  },
                  body: JSON.stringify({ pixel_signup_fired: true }),
                })
              }
            }
          } catch (err) {
            console.log('[auth/callback] pixel flag check failed:', err)
          }

          const dest = isNewSignup ? `${SITE_URL}/dashboard?signup=1` : `${SITE_URL}/dashboard`
          return NextResponse.redirect(dest)
        }
      }

      const body = await res.text()
      console.log('[auth/callback] exchange error body:', body)
    } catch (err) {
      console.log('[auth/callback] fetch error:', err)
    }
  }

  return NextResponse.redirect(
    `${SITE_URL}/sign-in?error=auth_callback_error&has_token=${!!accessToken}`
  )
}
