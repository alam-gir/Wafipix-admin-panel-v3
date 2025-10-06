import { apiService } from './index'
import { ApiErrorHandler } from './error-handler'
import { AxiosProgressEvent } from 'axios'
import { 
  ApiResponse, 
  Review,
  CreateReviewRequest,
  UpdateReviewRequest
} from '@/types/api'

export const reviewsApi = {
  /**
   * Get all reviews
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getAll: async (): Promise<ApiResponse<Review[]>> => {
    const response = await apiService.get<Review[]>('/v3/admin/reviews')
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Get active platforms
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getActivePlatforms: async (): Promise<ApiResponse<string[]>> => {
    const response = await apiService.get<string[]>('/v3/admin/reviews/platforms')
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Get review by ID
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getById: async (id: string): Promise<ApiResponse<Review>> => {
    const response = await apiService.get<Review>(`/v3/admin/reviews/${id}`)
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Create a new review
   * Handles Spring Boot ResponseUtil.success() responses with multipart form data
   */
  create: async (data: CreateReviewRequest, config?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }): Promise<ApiResponse<Review>> => {
    // Create FormData for multipart request
    const formData = new FormData()
    formData.append('platform', data.platform)
    if (data.clientName) formData.append('clientName', data.clientName)
    formData.append('rating', data.rating.toString())
    if (data.reviewText) formData.append('reviewText', data.reviewText)
    if (data.reviewImage) formData.append('reviewImage', data.reviewImage as File)

    const response = await apiService.postWithRetry<Review>('/v3/admin/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      isFileUpload: true,
      maxRetries: 3,
      retryDelay: 2000,
      ...config
    })
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Update an existing review
   * Handles Spring Boot ResponseUtil.success() responses with multipart form data
   */
  update: async (id: string, data: UpdateReviewRequest, config?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }): Promise<ApiResponse<Review>> => {
    // Create FormData for multipart request
    const formData = new FormData()
    if (data.platform) formData.append('platform', data.platform)
    if (data.clientName) formData.append('clientName', data.clientName)
    if (data.rating) formData.append('rating', data.rating.toString())
    if (data.reviewText) formData.append('reviewText', data.reviewText)
    if (data.reviewImage) formData.append('reviewImage', data.reviewImage as File)

    const response = await apiService.putWithRetry<Review>(`/v3/admin/reviews/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      isFileUpload: true,
      maxRetries: 3,
      retryDelay: 2000,
      ...config
    })
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Update review activity status
   * Handles Spring Boot ResponseUtil.success() responses
   */
  updateActivityStatus: async (id: string, active: boolean): Promise<ApiResponse<Review>> => {
    const response = await apiService.put<Review>(`/v3/admin/reviews/${id}/activity-status?active=${active}`)

    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }

    return response
  },

  /**
   * Delete a review
   * Handles Spring Boot ResponseUtil.success() responses (204 No Content)
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiService.delete(`/v3/admin/reviews/${id}`)
    
    // For delete operations, we expect 204 No Content
    // The response might be empty, so we don't validate the response structure
    if (response.statusCode && response.statusCode >= 400) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
  }
}

// Re-export types for convenience
export type { Review, CreateReviewRequest, UpdateReviewRequest } from '@/types/api'
