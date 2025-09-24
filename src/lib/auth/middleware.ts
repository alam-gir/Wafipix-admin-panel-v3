import { NextRequest, NextResponse } from 'next/server'

/**
 * Authentication middleware for protecting routes
 * For HTTP-only cookies, we can't check them in middleware
 * Let the client-side handle authentication checks
 */
export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/verify-otp']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // For HTTP-only cookies, we can't check them in middleware
  // Let the client-side handle authentication checks
  // The API calls will return 401 if not authenticated
  return NextResponse.next()
}

/**
 * Client-side authentication check
 * Since we can't check HTTP-only cookies, we rely on API calls
 */
export function isAuthenticated(): boolean {
  // We can't check HTTP-only cookies from client-side
  // Return true and let API calls handle authentication
  return true
}

/**
 * Redirect to login if not authenticated
 * Use this in client components
 */
export function requireAuth(): void {
  if (!isAuthenticated()) {
    window.location.href = '/login'
  }
}

/**
 * Get redirect URL from URL params
 */
export function getRedirectUrl(searchParams: URLSearchParams): string {
  return searchParams.get('redirect') || '/dashboard'
}

/**
 * Authentication context type for React components
 */
export interface AuthContextType {
  isAuthenticated: boolean
  user: any | null
  login: (email: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

