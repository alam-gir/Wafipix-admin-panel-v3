import { apiService } from './index'
import { ApiErrorHandler } from './error-handler'
import { AxiosProgressEvent } from 'axios'
import { 
  ApiResponse, 
  AdvertisementVideo,
  CreateAdvertisementVideoRequest,
  AdvertisementVideoResponse
} from '@/types/api'

export const advertisementVideosApi = {
  /**
   * Get advertisement video
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getAdvertisementVideo: async (): Promise<ApiResponse<AdvertisementVideo>> => {
    const response = await apiService.get<AdvertisementVideo>('/v3/admin/advertisement-videos')
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Create or update advertisement video
   * Handles Spring Boot ResponseUtil.success() responses with multipart form data
   */
  createOrUpdateAdvertisementVideo: async (
    videoFile: File, 
    options?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }
  ): Promise<ApiResponse<AdvertisementVideo>> => {
    // Create FormData for multipart request
    const formData = new FormData()
    formData.append('videoFile', videoFile)

    const response = await apiService.post<AdvertisementVideo>('/v3/admin/advertisement-videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: options?.onUploadProgress,
    })
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Delete advertisement video
   * Handles Spring Boot ResponseUtil.success() responses (204 No Content)
   */
  deleteAdvertisementVideo: async (): Promise<void> => {
    const response = await apiService.delete('/v3/admin/advertisement-videos')
    
    // For delete operations, we expect 204 No Content
    // The response might be empty, so we don't validate the response structure
    if (response.statusCode && response.statusCode >= 400) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
  }
}

// Re-export types for convenience
export type { AdvertisementVideo, CreateAdvertisementVideoRequest } from '@/types/api'
