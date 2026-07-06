import { NextResponse, type NextRequest } from 'next/server'

const COOKIE_NAME = 'strapi_jwt'
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

// A cookie's mere presence is NOT proof of a valid session. After a backend
// migration (new JWT_SECRET) or token expiry, the browser still holds a stale
// strapi_jwt that the backend rejects. If we trusted presence alone we'd trap
// the user: they render as logged-out everywhere (server validates the token),
// yet the middleware bounces them off /sign-in as if logged-in — so they can
// never reach the login page. Validate before bouncing off auth pages.
async function isTokenValid(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  const isAuthenticated = !!token

  // Public dashboard routes (accessible without auth for SEO + guest test-taking)
  // L/R/W: list + test detail pages — guests can take a test, sign-in is required at submit
  // Speaking + full-mock: list only — detail pages still require auth (separate flow TBD)
  const publicPathPrefixes = [
    '/dashboard/reading',
    '/dashboard/listening',
    '/dashboard/writing',
  ]
  const publicExactPaths = [
    '/dashboard/speaking',
    '/dashboard/speaking/questions',
    '/dashboard/speaking/mock-exam',
    '/dashboard/full-mock-test',
  ]
  const isPublic =
    publicPathPrefixes.some(path =>
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith(path + '/'),
    ) ||
    publicExactPaths.includes(request.nextUrl.pathname)

  // Protected routes
  const protectedPaths = ['/dashboard', '/test', '/results', '/profile']
  const isProtected = !isPublic && protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtected && !isAuthenticated) {
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ['/sign-in', '/sign-up']
  const isAuthPath = authPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isAuthPath && token) {
    // Only bounce to the dashboard when the token is genuinely accepted by the
    // backend. If it's stale (e.g. after the DO→AWS migration), clear it and let
    // the sign-in page render so the user can actually log in again.
    if (await isTokenValid(token)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    const res = NextResponse.next()
    res.cookies.delete(COOKIE_NAME)
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
