'use client';

/**
 * Authentication hook with SWR integration
 */

import { useCallback } from 'react';
import { useAuthStore } from '../../../stores/auth-store';
import { useProfile } from './use-profile';
import { sendOtp, verifyOtp, logout as logoutApi } from '../../api/auth/auth-api';
import { getDeviceId } from '../../utils/device-id';
import { User } from '../../api/types/auth';

/**
 * Main authentication hook
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, error, login, logout, setError, clearError } = useAuthStore();
  const { mutate: mutateProfile } = useProfile();

  /**
   * Send OTP to email
   */
  const sendOtpToEmail = useCallback(async (email: string) => {
    try {
      setError(null);
      const deviceId = getDeviceId();
      const response = await sendOtp({ email, deviceId });
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP');
      throw error;
    }
  }, [setError]);

  /**
   * Verify OTP and login
   */
  const verifyOtpAndLogin = useCallback(async (email: string, otp: string) => {
    try {
      setError(null);
      const deviceId = getDeviceId();
      const response = await verifyOtp({ email, otp, deviceId });
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      // Login user
      login(response.data);
      
      // Invalidate profile cache to fetch fresh data
      mutateProfile();
      
      return response.data;
    } catch (error: any) {
      setError(error.message || 'Failed to verify OTP');
      throw error;
    }
  }, [login, mutateProfile, setError]);

  /**
   * Logout user
   */
  const logoutUser = useCallback(async () => {
    try {
      const deviceId = getDeviceId();
      await logoutApi(deviceId);
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local state
      logout();
      mutateProfile(undefined, false);
      
      // Reset refresh token manager
      try {
        const { refreshTokenManager } = await import('../../api/refresh-token-manager');
        refreshTokenManager.reset();
      } catch (error) {
        console.warn('Failed to reset refresh token manager:', error);
      }
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/send-otp';
      }
    }
  }, [logout, mutateProfile]);

  /**
   * Clear error
   */
  const clearAuthError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    sendOtpToEmail,
    verifyOtpAndLogin,
    logoutUser,
    clearAuthError,
  };
}
