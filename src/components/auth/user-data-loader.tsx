'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'

/**
 * Simple component to load user data on client side
 * No complex auth checking - just loads user data if available
 */
export function UserDataLoader() {
  const { checkAuth } = useAuth()

  useEffect(() => {
    // Simply try to load user data - if it fails, no problem
    // The middleware already handles auth redirects
    checkAuth().catch(() => {
      // Silently fail - middleware will handle redirects
    })
  }, []) // Only run once on mount

  return null // This component doesn't render anything
}
