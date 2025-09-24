'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authApi } from '@/lib/api/auth'
import { User, ApiResponse, AuthError } from '@/types/api'
import { toast } from 'sonner'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  login: (email: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on mount, but only if not on auth pages
  useEffect(() => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    const isOnAuthPage = currentPath.startsWith('/login') || currentPath.startsWith('/verify-otp')
    
    // Only check auth status if not on auth pages
    if (!isOnAuthPage) {
      checkAuthStatus()
    } else {
      // On auth pages, just set loading to false
      setIsLoading(false)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      
      // Try to get current user - this will fail if not authenticated
      const response = await authApi.getCurrentUser()
      if (response.success && response.data) {
        setUser(response.data)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string) => {
    try {
      setIsLoading(true)
      const response = await authApi.sendOtp(email)
      
      if (response.success) {
        toast.success(response.message || 'OTP sent to your email')
      } else {
        throw new Error(response.message || 'Failed to send OTP')
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send OTP'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async (email: string, otp: string) => {
    try {
      setIsLoading(true)
      const response = await authApi.verifyOtp(email, otp)
      
      if (response.success && response.data) {
        const { user: userData, accessToken, refreshToken } = response.data
        
        // Tokens are automatically set by the backend via cookies
        // We also get them in the response for immediate use
        setUser(userData)
        setIsAuthenticated(true)
        
        toast.success('Login successful!')
      } else {
        throw new Error(response.message || 'Invalid OTP')
      }
    } catch (error: any) {
      console.error('OTP verification failed:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Invalid OTP'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Backend clears HTTP-only cookies
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    await checkAuthStatus()
  }

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    verifyOtp,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return null
    }

    return <Component {...props} />
  }
}

