import { create } from 'zustand'
import { authApi } from '../lib/auth-api'
import { clearDeviceId } from '../lib/device-id'
import { User } from '@/types/api'
import { toast } from 'sonner'

interface AuthState {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (email: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  refreshToken: () => Promise<User>
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to show skeletons initially

  // Set loading state
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  // Send OTP for login
  login: async (email: string) => {
    try {
      set({ isLoading: true })
      
      const response = await authApi.sendOtp(email)
      
      if (response.success) {
        toast.success(response.message || 'OTP sent to your email')
      } else {
        throw new Error(response.message || 'Failed to send OTP')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP'
      toast.error(errorMessage)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  // Verify OTP and complete login
  verifyOtp: async (email: string, otp: string) => {
    try {
      set({ isLoading: true })
      
      const response = await authApi.verifyOtp(email, otp)
      
      if (response.success && response.data) {
        // Backend returns user data directly - no need for separate getCurrentUser call
        console.log('Auth Store - Setting user data:', response.data)
        set({
          user: response.data,
          isAuthenticated: true,
          isLoading: false
        })
        toast.success('Login successful!')
      } else {
        throw new Error(response.message || 'Invalid OTP')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid OTP'
      toast.error(errorMessage)
      set({ isLoading: false })
      throw error
    }
  },

  // Logout user
  logout: async () => {
    try {
      set({ isLoading: true })
      
      await authApi.logout()
      
      // Clear local state
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
      
      // Clear device ID
      clearDeviceId()
      
      toast.success('Logged out successfully')
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local state even if API call fails
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
      clearDeviceId()
    }
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      console.log('Auth Store - checkAuth starting, setting isLoading: true')
      set({ isLoading: true })
      
      const response = await authApi.getCurrentUser()
      
      if (response.success && response.data) {
        console.log('Auth Store - checkAuth user data:', response.data)
        console.log('Auth Store - checkAuth success, setting isLoading: false')
        set({
          user: response.data,
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        console.log('Auth Store - checkAuth failed, setting isLoading: false')
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      console.log('Auth Store - checkAuth error, setting isLoading: false')
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  },

  // Refresh token (returns user data directly)
  refreshToken: async () => {
    try {
      const response = await authApi.refreshToken()
      
      if (response.success && response.data) {
        set({
          user: response.data,
          isAuthenticated: true
        })
        return response.data
      } else {
        throw new Error(response.message || 'Token refresh failed')
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      // Clear auth state on refresh failure
      set({
        user: null,
        isAuthenticated: false
      })
      throw error
    }
  }
}))

