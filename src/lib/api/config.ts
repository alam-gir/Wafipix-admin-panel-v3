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
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    SUMMARY: (id: string) => `/products/${id}/summary`,
    BY_CATEGORY: (categoryId: string) => `/products/category/${categoryId}`,
    LOW_STOCK: '/products/low-stock',
    WITHOUT_VARIANTS: '/products/without-variants',
    WITH_VARIANTS: '/products/with-variants',
    UPDATE_CATEGORY: (id: string) => `/products/${id}/category`,
    UPDATE_PROFILE_IMAGE: (id: string) => `/products/${id}/profile-image`,
    ADD_IMAGES: (id: string) => `/products/${id}/images`,
    REMOVE_IMAGES: (id: string) => `/products/${id}/images`,
    ADD_DESCRIPTION_IMAGES: (id: string) => `/products/${id}/description-images`,
    REMOVE_DESCRIPTION_IMAGES: (id: string) => `/products/${id}/description-images`,
    UPDATE_STATUS: (id: string) => `/products/${id}/status`,
  },
  PRODUCT_VARIANTS: {
    BASE: (productId: string) => `/products/${productId}/variants`,
    BY_ID: (productId: string, variantId: string) => `/products/${productId}/variants/${variantId}`,
    UPDATE_STOCK: (productId: string, variantId: string) => `/products/${productId}/variants/${variantId}/stock`,
    UPDATE_ATTRIBUTES: (productId: string, variantId: string) => `/products/${productId}/variants/${variantId}/attributes`,
    LOW_STOCK: (productId: string) => `/products/${productId}/variants/low-stock`,
    OUT_OF_STOCK: (productId: string) => `/products/${productId}/variants/out-of-stock`,
    IN_STOCK: (productId: string) => `/products/${productId}/variants/in-stock`,
    WITH_DISCOUNT: (productId: string) => `/products/${productId}/variants/with-discount`,
  },
  PRODUCT_ATTRIBUTES: {
    BASE: (productId: string) => `/products/${productId}/attributes`,
    BY_ID: (productId: string, attributeId: string) => `/products/${productId}/attributes/${attributeId}`,
    VALUES: (productId: string, attributeId: string) => `/products/${productId}/attributes/${attributeId}/values`,
    VALUE_BY_ID: (productId: string, attributeId: string, valueId: string) => `/products/${productId}/attributes/${attributeId}/values/${valueId}`,
  },
  PRODUCT_SPECIFICATIONS: {
    BASE: (productId: string) => `/products/${productId}/specifications`,
    BY_ID: (productId: string, specificationId: string) => `/products/${productId}/specifications/${specificationId}`,
  },
} as const;
