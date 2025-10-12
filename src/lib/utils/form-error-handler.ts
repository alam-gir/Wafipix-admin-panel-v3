/**
 * Form error handling utilities
 */

import { FieldError } from '../api/types/common';

export interface FormError {
  message: string;
  fieldErrors: FieldError[];
  statusCode?: number;
  errorType: 'validation' | 'business' | 'general' | 'network' | 'unknown';
}

/**
 * Extract error message from Zod validation error
 */
export function getZodErrorMessage(error: any): string {
  if (error?.errors?.[0]?.message) {
    return error.errors[0].message;
  }
  return 'Validation failed';
}

/**
 * Handle API response errors based on your backend format
 */
export function handleApiError(error: any): FormError {
  const fieldErrors: FieldError[] = [];
  let message = 'An unexpected error occurred';
  let errorType: FormError['errorType'] = 'unknown';
  let statusCode: number | undefined;

  // Get status code
  if (error?.response?.status) {
    statusCode = error.response.status;
  }

  // Handle Axios errors with response
  if (error?.response?.data) {
    const responseData = error.response.data;
    
    // Check if it's your API response format
    if (typeof responseData === 'object' && 'success' in responseData) {
      message = responseData.message || 'An error occurred';
      
      // Handle errors array
      if (responseData.errors && Array.isArray(responseData.errors)) {
        fieldErrors.push(...responseData.errors);
        
        // Determine error type based on field errors
        const hasFieldErrors = responseData.errors.some((err: FieldError) => err.field !== null);
        const hasGeneralErrors = responseData.errors.some((err: FieldError) => err.field === null);
        
        if (hasFieldErrors) {
          errorType = 'validation';
          message = 'Please fix the errors below';
        } else if (hasGeneralErrors) {
          errorType = 'business';
        }
      }
    } else {
      // Fallback for non-standard responses
      message = responseData.message || error.message || 'An error occurred';
    }
  }
  
  // Handle network errors
  else if (error?.code === 'NETWORK_ERROR' || !error?.response) {
    errorType = 'network';
    message = 'Network error. Please check your connection.';
  }
  
  // Handle other errors
  else if (error?.message) {
    message = error.message;
    errorType = 'general';
  }

  // Map HTTP status codes to error types
  if (statusCode) {
    switch (statusCode) {
      case 400:
      case 422:
        errorType = 'validation';
        break;
      case 401:
        errorType = 'business';
        message = 'Authentication required. Please login again.';
        break;
      case 403:
        errorType = 'business';
        message = 'Access forbidden. Insufficient permissions.';
        break;
      case 404:
        errorType = 'business';
        message = 'Resource not found.';
        break;
      case 409:
        errorType = 'business';
        message = 'Conflict. Resource already exists.';
        break;
      case 500:
        errorType = 'general';
        message = 'Server error. Please try again later.';
        break;
    }
  }

  return {
    message,
    fieldErrors,
    statusCode,
    errorType,
  };
}

/**
 * Format field errors for display
 */
export function formatFieldErrors(fieldErrors: FieldError[]): string[] {
  return fieldErrors
    .filter(error => error.field !== null) // Only show field-specific errors
    .map(error => `${error.field}: ${error.message}`);
}

/**
 * Get general errors (field === null)
 */
export function getGeneralErrors(fieldErrors: FieldError[]): string[] {
  return fieldErrors
    .filter(error => error.field === null)
    .map(error => error.message);
}

/**
 * Check if error has field-specific errors
 */
export function hasFieldErrors(fieldErrors: FieldError[]): boolean {
  return fieldErrors.some(error => error.field !== null);
}

/**
 * Check if error has general errors
 */
export function hasGeneralErrors(fieldErrors: FieldError[]): boolean {
  return fieldErrors.some(error => error.field === null);
}

/**
 * Get error for specific field
 */
export function getFieldError(fieldErrors: FieldError[], fieldName: string): string | undefined {
  const error = fieldErrors.find(err => err.field === fieldName);
  return error?.message;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: FormError): boolean {
  return error.errorType === 'network' || 
         (error.statusCode && [408, 429, 500, 502, 503, 504].includes(error.statusCode));
}

/**
 * Check if error requires authentication refresh
 */
export function requiresAuthRefresh(error: FormError): boolean {
  return error.statusCode === 401 && error.errorType !== 'business';
}
