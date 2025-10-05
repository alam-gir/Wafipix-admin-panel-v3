'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * Client-side auth guard
 * Handles authentication validation and redirects
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuth()

  useEffect(() => {
    // Only check auth if we don't have a user yet
    // If we already have a user, we're authenticated
    if (!user && !isLoading) {
      console.log('AuthGuard: No user found, checking auth...')
      checkAuth().catch(error => {
        console.error('AuthGuard: Auth check failed:', error)
      })
    } else if (user) {
      console.log('AuthGuard: User already exists, skipping auth check')
    }
  }, [user, isLoading, checkAuth])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated (including invalid tokens), redirect to login
  if (!isAuthenticated) {
    // Redirect to login if tokens are invalid
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return null
  }

  // Render children if authenticated with valid tokens
  return <>{children}</>
}

