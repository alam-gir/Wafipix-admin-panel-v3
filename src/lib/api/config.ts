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
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
    BY_TITLE: (title: string) => `/categories/by-title/${title}`,
    ROOT: '/categories/root',
    TREE: '/categories/tree',
    HIERARCHY: (id: string) => `/categories/${id}/hierarchy`,
    UPDATE_PARENT: (id: string) => `/categories/${id}/parent`,
    UPDATE_STATUS: (id: string) => `/categories/${id}/status`,
    OPTIONS: '/categories/options',
    PARENT_OPTIONS: (categoryId: string) => `/categories/${categoryId}/parent-options`,
    MAX_LEVEL: '/categories/max-level',
  },
} as const;
