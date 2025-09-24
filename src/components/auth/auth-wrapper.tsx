'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentPath = window.location.pathname
        const isOnLoginPage = currentPath.startsWith('/login') || currentPath.startsWith('/verify-otp')
        
        // If we're on auth pages, just allow access
        if (isOnLoginPage) {
          setIsCheckingAuth(false)
          return
        }
        
        // Wait for auth context to initialize
        if (!isLoading) {
          if (!isAuthenticated) {
            // Not authenticated - redirect to login
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
          } else {
            // Authenticated - allow access
            setIsCheckingAuth(false)
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [isAuthenticated, isLoading, router])

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  const isOnLoginPage = currentPath.startsWith('/login') || currentPath.startsWith('/verify-otp')

  // Show loading while checking authentication (only for protected pages)
  if ((isLoading || isCheckingAuth) && !isOnLoginPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If on auth pages, always render children
  if (isOnLoginPage) {
    return <>{children}</>
  }

  // If not authenticated on protected pages, don't render anything (redirect is happening)
  if (!isAuthenticated) {
    return null
  }

  // Render children if authenticated
  return <>{children}</>
}

