/**
 * Next.js middleware for route protection
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerProfile } from './lib/api/server-profile';

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/orders',
  '/payments',
  '/profile',
  '/settings',
  '/management',
];

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/send-otp',
  '/verify-otp',
];

/**
 * Check if a path is protected
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if a path is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    try {
      // Try to fetch profile to check authentication
      const response = await getServerProfile(request);
      
      if (!response || !response.success) {
        // Not authenticated, redirect to login
        const loginUrl = new URL('/send-otp', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // User is authenticated, continue
      return NextResponse.next();
    } catch (error) {
      // Error fetching profile, redirect to login
      console.error('Middleware auth check failed:', error);
      const loginUrl = new URL('/send-otp', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle public routes (redirect authenticated users away from auth pages)
  if (isPublicRoute(pathname) && (pathname === '/send-otp' || pathname === '/verify-otp')) {
    try {
      const response = await getServerProfile(request);
      
      if (response && response.success) {
        // User is authenticated, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // Not authenticated, allow access to auth pages
      console.log('User not authenticated, allowing auth page access');
    }
    
    // Allow access to auth pages for unauthenticated users
    return NextResponse.next();
  }

  // Allow access to other routes
  return NextResponse.next();
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
};
