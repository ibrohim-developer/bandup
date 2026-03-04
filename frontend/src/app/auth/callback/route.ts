import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const COOKIE_NAME = 'strapi_jwt'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const { searchParams, origin } = url
  const accessToken = searchParams.get('access_token')

  // Debug
  console.log('[auth/callback] access_token prefix:', accessToken?.substring(0, 20))
  console.log('[auth/callback] All params:', [...searchParams.keys()])

  if (accessToken) {
    try {
      // Exchange Google's access_token for a Strapi JWT
      const res = await fetch(
        `${STRAPI_URL}/api/auth/google/callback?access_token=${accessToken}`
      )

      console.log('[auth/callback] Strapi exchange status:', res.status)

      if (res.ok) {
        const data = await res.json()
        console.log('[auth/callback] Got Strapi JWT:', !!data.jwt)

        if (data.jwt) {
          const cookieStore = await cookies()
          cookieStore.set(COOKIE_NAME, data.jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60,
          })
          return NextResponse.redirect(`${origin}/dashboard`)
        }
      }

      const body = await res.text()
      console.log('[auth/callback] exchange error body:', body)
    } catch (err) {
      console.log('[auth/callback] fetch error:', err)
    }
  }

  // Include debug info in error redirect
  return NextResponse.redirect(
    `${origin}/sign-in?error=auth_callback_error&has_token=${!!accessToken}`
  )
}
