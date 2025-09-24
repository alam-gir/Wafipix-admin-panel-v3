import { ApiResponse, FieldError } from '@/types/api'

// Error handling utilities that match Spring Boot ResponseUtil patterns
export class ApiErrorHandler {
  
  /**
   * Extract field errors from API response
   * Matches Spring Boot BindingResult field errors
   */
  static getFieldErrors(response: ApiResponse<unknown>): FieldError[] {
    return response.errors || []
  }

  /**
   * Get the main error message from API response
   */
  static getErrorMessage(response: ApiResponse<unknown>): string {
    return response.message || 'An unexpected error occurred'
  }

  /**
   * Check if response has validation errors
   */
  static hasValidationErrors(response: ApiResponse<unknown>): boolean {
    return !!(response.errors && response.errors.length > 0)
  }

  /**
   * Get field-specific error message
   */
  static getFieldError(response: ApiResponse<unknown>, fieldName: string): string | null {
    const fieldErrors = this.getFieldErrors(response)
    const fieldError = fieldErrors.find(error => error.field === fieldName)
    return fieldError?.message || null
  }

  /**
   * Format validation errors for display
   */
  static formatValidationErrors(response: ApiResponse<unknown>): string[] {
    const fieldErrors = this.getFieldErrors(response)
    return fieldErrors.map(error => `${error.field}: ${error.message}`)
  }

  /**
   * Check if response indicates success
   */
  static isSuccess(response: ApiResponse<unknown>): boolean {
    return response.success === true
  }

  /**
   * Check if response indicates failure
   */
  static isError(response: ApiResponse<unknown>): boolean {
    return response.success === false
  }

  /**
   * Get HTTP status code from response
   */
  static getStatusCode(response: ApiResponse<unknown>): number {
    return response.statusCode || 200
  }

  /**
   * Check if response is a specific HTTP status
   */
  static isStatus(response: ApiResponse<unknown>, status: number): boolean {
    return this.getStatusCode(response) === status
  }

  /**
   * Check if response is unauthorized (401)
   */
  static isUnauthorized(response: ApiResponse<unknown>): boolean {
    return this.isStatus(response, 401)
  }

  /**
   * Check if response is forbidden (403)
   */
  static isForbidden(response: ApiResponse<unknown>): boolean {
    return this.isStatus(response, 403)
  }

  /**
   * Check if response is not found (404)
   */
  static isNotFound(response: ApiResponse<unknown>): boolean {
    return this.isStatus(response, 404)
  }

  /**
   * Check if response is bad request (400)
   */
  static isBadRequest(response: ApiResponse<unknown>): boolean {
    return this.isStatus(response, 400)
  }

  /**
   * Check if response is internal server error (500)
   */
  static isInternalError(response: ApiResponse<unknown>): boolean {
    return this.isStatus(response, 500)
  }

  /**
   * Create a standardized error response
   */
  static createErrorResponse(message: string, statusCode: number = 500, errors?: FieldError[]): ApiResponse<unknown> {
    return {
      success: false,
      message,
      statusCode,
      errors,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Create a standardized success response
   */
  static createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    }
  }
}

// Pagination utilities that match Spring Data Page structure
export class PaginationUtils {
  
  /**
   * Calculate pagination info from Spring Data Page
   */
  static calculatePaginationInfo(page: number, size: number, totalElements: number): {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } {
    const totalPages = Math.ceil(totalElements / size)
    
    return {
      page,
      size,
      totalElements,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    }
  }

  /**
   * Convert frontend page (1-based) to Spring Data page (0-based)
   */
  static toSpringPage(frontendPage: number): number {
    return Math.max(0, frontendPage - 1)
  }

  /**
   * Convert Spring Data page (0-based) to frontend page (1-based)
   */
  static fromSpringPage(springPage: number): number {
    return springPage + 1
  }

  /**
   * Generate page numbers for pagination UI
   */
  static generatePageNumbers(currentPage: number, totalPages: number, maxVisible: number = 5): number[] {
    const pages: number[] = []
    const halfVisible = Math.floor(maxVisible / 2)
    
    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, currentPage + halfVisible)
    
    // Adjust if we're near the beginning or end
    if (end - start + 1 < maxVisible) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisible - 1)
      } else {
        start = Math.max(1, end - maxVisible + 1)
      }
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }
}

// Response processing utilities
export class ResponseProcessor {
  
  /**
   * Process API response and handle common patterns
   */
  static processResponse<T>(response: ApiResponse<T>): {
    data: T | null;
    error: string | null;
    fieldErrors: FieldError[];
    pagination: unknown;
    isSuccess: boolean;
  } {
    return {
      data: response.success ? response.data || null : null,
      error: response.success ? null : ApiErrorHandler.getErrorMessage(response),
      fieldErrors: ApiErrorHandler.getFieldErrors(response),
      pagination: response.pagination || null,
      isSuccess: response.success
    }
  }

  /**
   * Extract data from successful response
   */
  static extractData<T>(response: ApiResponse<T>): T | null {
    if (!response.success) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    return response.data || null
  }

  /**
   * Extract paginated data
   */
  static extractPaginatedData<T>(response: ApiResponse<T[]>): {
    data: T[];
    pagination: unknown;
  } {
    if (!response.success) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return {
      data: response.data || [],
      pagination: response.pagination || null
    }
  }
}
