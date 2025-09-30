import { apiService } from './index'
import { ApiErrorHandler } from './error-handler'
import { 
  ApiResponse, 
  SocialMedia,
  CreateSocialMediaRequest,
  UpdateSocialMediaRequest
} from '@/types/api'

export const socialMediaApi = {
  /**
   * Get all social media links
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getAll: async (): Promise<ApiResponse<SocialMedia[]>> => {
    const response = await apiService.get<SocialMedia[]>('/v3/admin/social-media')
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Get social media by ID
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getById: async (id: string): Promise<ApiResponse<SocialMedia>> => {
    const response = await apiService.get<SocialMedia>(`/v3/admin/social-media/${id}`)
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Create a new social media link
   * Handles Spring Boot ResponseUtil.success() responses
   */
  create: async (data: CreateSocialMediaRequest): Promise<ApiResponse<SocialMedia>> => {
    const response = await apiService.post<SocialMedia>('/v3/admin/social-media', data)
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Update an existing social media link
   * Handles Spring Boot ResponseUtil.success() responses
   */
  update: async (id: string, data: UpdateSocialMediaRequest): Promise<ApiResponse<SocialMedia>> => {
    const response = await apiService.put<SocialMedia>(`/v3/admin/social-media/${id}`, data)
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Delete a social media link
   * Handles Spring Boot ResponseUtil.success() responses (204 No Content)
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiService.delete(`/v3/admin/social-media/${id}`)
    
    // For delete operations, we expect 204 No Content
    // The response might be empty, so we don't validate the response structure
    if (response.statusCode && response.statusCode >= 400) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
  }
}

// Re-export types for convenience
export type { SocialMedia, CreateSocialMediaRequest, UpdateSocialMediaRequest } from '@/types/api'
