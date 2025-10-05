import { useAuthStore } from '../stores/auth-store'

/**
 * Simple auth hook
 * Provides easy access to auth state and actions
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    verifyOtp,
    logout,
    checkAuth,
    refreshToken,
    setLoading
  } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    verifyOtp,
    logout,
    checkAuth,
    refreshToken,
    setLoading
  }
}

