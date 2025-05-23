import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// List of public paths that don't require authentication
const publicPaths = [
  "/login",
  "/api/auth/callback",
  "/api/health",
  "/_next/static",
  "/_next/image",
]

// List of API routes that don't require authentication
const publicApiRoutes = [
  "/api/auth",
  "/api/health",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Handle API routes
  if (pathname.startsWith("/api/")) {
    // Skip auth for public API routes
    if (publicApiRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next()
    }

    // Pour les routes API protégées, check session via cookies
    const response = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res: response })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    // Add user info to the request headers for API routes
    response.headers.set('x-user-id', session.user.id)
    return response
  }

  // Pour les pages, check session via cookies
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  // Si pas de session, redirect vers login
  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  // Si déjà connecté et sur /login, redirect vers /
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
