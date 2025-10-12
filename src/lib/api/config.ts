/**
 * API Configuration
 */

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/v1',
  TIMEOUT: 10000,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
} as const;
