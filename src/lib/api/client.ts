/**
 * Axios client configuration
 */

import axios from 'axios';
import { API_CONFIG } from './config';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to clear auth state
const clearAuthState = async () => {
  try {
    // Import auth store and clear state
    const { useAuthStore } = await import('../../stores/auth-store');
    useAuthStore.getState().logout();
    
    // Reset refresh token manager
    const { refreshTokenManager } = await import('./refresh-token-manager');
    refreshTokenManager.reset();
  } catch (error) {
    console.error('Failed to clear auth state:', error);
  }
};

// Helper function to check if user is authenticated
const isUserAuthenticated = () => {
  try {
    const { useAuthStore } = require('../../stores/auth-store');
    return useAuthStore.getState().isAuthenticated;
  } catch (error) {
    return false;
  }
};

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    }

    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if user is still authenticated before attempting refresh
      if (!isUserAuthenticated()) {
        console.log('User not authenticated, skipping token refresh');
        return Promise.reject(error);
      }

      try {
        // Import refresh token manager
        const { refreshTokenManager } = await import('./refresh-token-manager');
        
        // Try to refresh token
        const refreshSuccess = await refreshTokenManager.refreshToken();
        
        if (refreshSuccess) {
          // Token refreshed successfully, retry original request
          return apiClient(originalRequest);
        } else {
          // Refresh failed, clear auth state and redirect to login
          await clearAuthState();
          if (typeof window !== 'undefined') {
            window.location.href = '/send-otp';
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear auth state and redirect to login
        console.error('Token refresh error:', refreshError);
        await clearAuthState();
        if (typeof window !== 'undefined') {
          window.location.href = '/send-otp';
        }
      }
    }

    return Promise.reject(error);
  }
);
