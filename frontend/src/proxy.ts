import { NextResponse, type NextRequest } from 'next/server'

const COOKIE_NAME = 'strapi_jwt'

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

  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
