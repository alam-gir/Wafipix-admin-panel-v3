import { cookies } from 'next/headers'
import axios from 'axios'
import { User } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/'

/**
 * Server-side authentication check
 * Uses HTTP-only cookies (at and rt) to verify authentication
 */
export async function checkServerAuth(): Promise<{
  isAuthenticated: boolean
  user: User | null
  redirectTo?: string
}> {
  try {
    const cookieStore = await cookies()
    
    // Check if we have authentication cookies (at and rt)
    const hasAtCookie = cookieStore.has('at')
    const hasRtCookie = cookieStore.has('rt')
    
    console.log('Server auth check - cookies:', {
      hasAtCookie,
      hasRtCookie,
      allCookies: cookieStore.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
    })
    
    if (!hasAtCookie && !hasRtCookie) {
      console.log('No auth cookies found, redirecting to login')
      return {
        isAuthenticated: false,
        user: null,
        redirectTo: '/login'
      }
    }

    // Build cookie header manually
    const cookieHeader = []
    const allCookies = cookieStore.getAll()
    for (const cookie of allCookies) {
      cookieHeader.push(`${cookie.name}=${cookie.value}`)
    }

    console.log('Making auth request with cookies:', cookieHeader.join('; '))

    // Use axios directly (like your existing apiService does)
    const response = await axios.get(`${API_BASE_URL}/v3/admin/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader.join('; ')
      },
      withCredentials: true,
      timeout: 10000
    })

    if (response.data.success && response.data.data) {
      return {
        isAuthenticated: true,
        user: response.data.data,
        redirectTo: undefined
      }
    }

    // If we reach here, authentication failed
    return {
      isAuthenticated: false,
      user: null,
      redirectTo: '/login'
    }

  } catch (error) {
    console.error('Server auth check failed:', error)
    return {
      isAuthenticated: false,
      user: null,
      redirectTo: '/login'
    }
  }
}

/**
 * Server-side auth redirect helper
 * Handles redirects based on authentication status and current page
 * 
 * TEMPORARILY DISABLED - Using client-side auth only
 * Server-side auth has timing issues with cookie propagation
 */
export async function handleServerAuthRedirect(currentPath: string) {
  // Temporarily disable server-side auth checks
  // The client-side AuthGuard will handle authentication
  console.log('Server auth redirect disabled for:', currentPath)
  
  return {
    isAuthenticated: false, // Let client-side handle this
    user: null,
    redirectTo: undefined
  }
}
