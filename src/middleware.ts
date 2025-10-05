import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/verify-otp']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Check for authentication cookies
  const hasAtCookie = request.cookies.has('at')
  const hasRtCookie = request.cookies.has('rt')
  const hasAuthCookies = hasAtCookie || hasRtCookie
  
  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (hasAuthCookies && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!hasAuthCookies && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
