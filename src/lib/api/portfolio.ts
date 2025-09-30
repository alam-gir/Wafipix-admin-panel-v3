import { apiService } from './index'
import { ApiErrorHandler } from './error-handler'
import { AxiosProgressEvent } from 'axios'
import {
  ApiResponse,
  WorkListResponse,
  WorkResponse,
  CreateWorkRequest,
  UpdateWorkRequest,
  GalleryResponse,
  CreateGalleryRequest,
  UpdateGalleryRequest,
  RemoveGalleryFilesRequest,
  Page
} from '@/types/api'

interface UploadConfig {
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
}

export const portfolioApi = {
  /**
   * Get all works with pagination
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getAll: async (page: number = 0, size: number = 10): Promise<ApiResponse<Page<WorkListResponse>>> => {
    const response = await apiService.get<Page<WorkListResponse>>(`/v3/admin/works?page=${page}&size=${size}`)

    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }

    return response
  },

  /**
   * Get work by ID
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getById: async (id: string): Promise<ApiResponse<WorkResponse>> => {
    const response = await apiService.get<WorkResponse>(`/v3/admin/works/${id}`)

    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }

    return response
  },

  /**
   * Create a new work
   * Handles Spring Boot ResponseUtil.success() responses with multipart form data
   */
  create: async (data: CreateWorkRequest, config?: UploadConfig): Promise<ApiResponse<WorkResponse>> => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('serviceId', data.serviceId)
    if (data.description) formData.append('description', data.description)
    if (data.coverVideo) formData.append('coverVideo', data.coverVideo)
    if (data.coverImage) formData.append('coverImage', data.coverImage)
    if (data.profileVideo) formData.append('profileVideo', data.profileVideo)
    if (data.profileImage) formData.append('profileImage', data.profileImage)

    const response = await apiService.post<WorkResponse>('/v3/admin/works', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config
    })

    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }

    return response
  },

  /**
   * Update an existing work
   * Handles Spring Boot ResponseUtil.success() responses with multipart form data
   */
  update: async (id: string, data: UpdateWorkRequest, config?: UploadConfig): Promise<ApiResponse<WorkResponse>> => {
    const formData = new FormData()
    if (data.title) formData.append('title', data.title)
    if (data.serviceId) formData.append('serviceId', data.serviceId)
    if (data.description) formData.append('description', data.description)
    if (data.coverVideo) formData.append('coverVideo', data.coverVideo)
    if (data.coverImage) formData.append('coverImage', data.coverImage)
    if (data.profileVideo) formData.append('profileVideo', data.profileVideo)
    if (data.profileImage) formData.append('profileImage', data.profileImage)

    const response = await apiService.put<WorkResponse>(`/v3/admin/works/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config
    })

    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }

    return response
  },

  /**
   * Update work activity status
   * Handles Spring Boot ResponseUtil.success() responses
   */
  updateActivityStatus: async (id: string, active: boolean): Promise<ApiResponse<WorkResponse>> => {
    const response = await apiService.put<WorkResponse>(`/v3/admin/works/${id}/activity-status?active=${active}`)

    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }

    return response
  },

  /**
   * Delete a work
   * Handles Spring Boot ResponseUtil.success() responses (204 No Content)
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiService.delete(`/v3/admin/works/${id}`)

    // For delete operations, we expect 204 No Content
    if (response.statusCode && response.statusCode >= 400) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
  },

  /**
   * Get work galleries
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getGalleries: async (workId: string): Promise<ApiResponse<GalleryResponse[]>> => {
    const response = await apiService.get<GalleryResponse[]>(`/v3/admin/works/${workId}/galleries`)

    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }

    return response
  },

  /**
   * Create a new gallery
   * Handles Spring Boot ResponseUtil.success() responses with multipart form data
   */
  createGallery: async (workId: string, data: CreateGalleryRequest, config?: UploadConfig): Promise<ApiResponse<GalleryResponse>> => {
    const formData = new FormData()
    if (data.isMobileGrid !== undefined) formData.append('isMobileGrid', data.isMobileGrid.toString())
    if (data.files) {
      data.files.forEach((file) => {
        formData.append('files', file)
      })
    }

    const response = await apiService.post<GalleryResponse>(`/v3/admin/works/${workId}/galleries`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config
    })

    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }

    return response
  },

  /**
   * Update a gallery
   * Handles Spring Boot ResponseUtil.success() responses
   */
  updateGallery: async (galleryId: string, data: UpdateGalleryRequest): Promise<ApiResponse<GalleryResponse>> => {
    const response = await apiService.put<GalleryResponse>(`/v3/admin/works/galleries/${galleryId}`, data)

    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }

    return response
  },

  /**
   * Delete a gallery
   * Handles Spring Boot ResponseUtil.success() responses (204 No Content)
   */
  deleteGallery: async (galleryId: string): Promise<void> => {
    const response = await apiService.delete(`/v3/admin/works/galleries/${galleryId}`)

    // For delete operations, we expect 204 No Content
    if (response.statusCode && response.statusCode >= 400) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
  },

  /**
   * Add files to gallery
   * Handles Spring Boot ResponseUtil.success() responses with multipart form data
   */
  addFilesToGallery: async (galleryId: string, files: File[], config?: UploadConfig): Promise<ApiResponse<GalleryResponse>> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await apiService.post<GalleryResponse>(`/v3/admin/works/galleries/${galleryId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config
    })

    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }

    return response
  },

  /**
   * Remove files from gallery
   * Handles Spring Boot ResponseUtil.success() responses
   */
  removeFilesFromGallery: async (galleryId: string, data: RemoveGalleryFilesRequest): Promise<ApiResponse<GalleryResponse>> => {
    const response = await apiService.delete<GalleryResponse>(`/v3/admin/works/galleries/${galleryId}/files`, {
      data
    })

    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }

    return response
  }
}

// Re-export types for convenience
export type {
  WorkListResponse,
  WorkResponse,
  CreateWorkRequest,
  UpdateWorkRequest,
  GalleryResponse,
  CreateGalleryRequest,
  UpdateGalleryRequest,
  RemoveGalleryFilesRequest
} from '@/types/api'
