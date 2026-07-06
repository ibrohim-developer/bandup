import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { safeRedirectPath } from '@/lib/safe-redirect'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

// Google OAuth entry point.
//
// This is deliberately a Route Handler (addressed by a stable URL), NOT a Server
// Action. Server Actions are addressed by a build-hashed id, so a redeploy (e.g.
// the DO→AWS migration) rotates that id — and any browser still holding the
// previous client bundle then POSTs an id the running server no longer knows,
// which Next rejects with "Failed to find Server Action x" → 502. A URL-addressed
// handler can never drift out of sync with the deployment.
export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get('redirect')

  // Strapi doesn't forward our own state through the OAuth roundtrip, so stash
  // the post-login destination in a short-lived cookie the callback can read.
  // Sanitize it here so a crafted ?redirect= can't turn the callback into an
  // open redirect.
  if (redirectTo) {
    const safe = safeRedirectPath(redirectTo, '')
    if (safe) {
      const cookieStore = await cookies()
      cookieStore.set('post_oauth_redirect', safe, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 600, // 10 minutes
      })
    }
  }

  return NextResponse.redirect(`${STRAPI_URL}/api/connect/google`)
}
