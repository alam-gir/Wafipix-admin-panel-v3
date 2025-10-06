'use client'

import { useEffect, useRef } from 'react'
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
  const hasCheckedAuth = useRef(false)
  const hasRedirected = useRef(false)

  console.log('AuthGuard - State:', { user, isAuthenticated, isLoading })

  useEffect(() => {
    // Check auth once on mount
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true
      console.log('AuthGuard: Checking auth on mount...')
      checkAuth().catch(error => {
        console.error('AuthGuard: Auth check failed:', error)
      })
    }
  }, [checkAuth]) // Include checkAuth in dependencies

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
  if (!isAuthenticated && !hasRedirected.current) {
    hasRedirected.current = true
    console.log('AuthGuard: Not authenticated, redirecting to login...')
    // Redirect to login if tokens are invalid
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return null
  }

  // Render children if authenticated with valid tokens
  return <>{children}</>
}

