/**
 * Form error handling utilities
 */

import { FieldError } from '../api/types/common';

export interface FormError {
  message: string;
  fieldErrors: FieldError[];
  generalError: string;
  statusCode?: number;
  errorType: 'validation' | 'business' | 'general' | 'network' | 'unknown';
}

/**
 * Extract error message from Zod validation error
 */
export function getZodErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'errors' in error) {
    const zodError = error as { errors: Array<{ message: string }> };
    if (zodError.errors?.[0]?.message) {
      return zodError.errors[0].message;
    }
  }
  return 'Validation failed';
}

/**
 * Handle API response errors based on your backend format
 */
export function handleApiError(error: unknown): FormError {
  const fieldErrors: FieldError[] = [];
  let message = 'An unexpected error occurred';
  let errorType: FormError['errorType'] = 'unknown';
  let statusCode: number | undefined;

  // Type guard for error with response
  const isAxiosError = (err: unknown): err is { response: { status: number; data: unknown } } => {
    return err !== null && typeof err === 'object' && 'response' in err;
  };

  // Get status code
  if (isAxiosError(error) && error.response?.status) {
    statusCode = error.response.status;
  }

  // Handle Axios errors with response
  if (isAxiosError(error) && error.response?.data) {
    const responseData = error.response.data;
    
    // Check if it's your API response format
    if (typeof responseData === 'object' && responseData !== null && 'success' in responseData) {
      const apiResponse = responseData as { message?: string; errors?: FieldError[] };
      message = apiResponse.message || 'An error occurred';
      
      // Handle errors array
      if (apiResponse.errors && Array.isArray(apiResponse.errors)) {
        fieldErrors.push(...apiResponse.errors);
        
        // Determine error type based on field errors
        const hasFieldErrors = apiResponse.errors.some((err: FieldError) => err.field !== null);
        const hasGeneralErrors = apiResponse.errors.some((err: FieldError) => err.field === null);
        
        if (hasFieldErrors) {
          errorType = 'validation';
          message = 'Please fix the errors below';
        } else if (hasGeneralErrors) {
          errorType = 'business';
        }
      }
    } else {
      // Fallback for non-standard responses
      const errorWithMessage = responseData as { message?: string };
      message = errorWithMessage.message || 'An error occurred';
    }
  }
  
  // Handle network errors
  else if (isAxiosError(error) && error.response === undefined) {
    errorType = 'network';
    message = 'Network error. Please check your connection.';
  }
  
  // Handle other errors
  else if (error && typeof error === 'object' && 'message' in error) {
    const errorWithMessage = error as { message: string };
    message = errorWithMessage.message;
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
    generalError: message,
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
         (error.statusCode !== undefined && [408, 429, 500, 502, 503, 504].includes(error.statusCode));
}

/**
 * Check if error requires authentication refresh
 */
export function requiresAuthRefresh(error: FormError): boolean {
  return error.statusCode === 401 && error.errorType !== 'business';
}
