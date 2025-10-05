import { apiService } from './index'
import { ApiErrorHandler } from './error-handler'
import { 
  ApiResponse, 
  Client,
  CreateClientRequest,
  UpdateClientRequest
} from '@/types/api'

export const clientsApi = {
  /**
   * Get all clients
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getAllClients: async (): Promise<ApiResponse<Client[]>> => {
    const response = await apiService.get<Client[]>('/v3/admin/clients')
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Get client by ID
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getClientById: async (id: string): Promise<ApiResponse<Client>> => {
    const response = await apiService.get<Client>(`/v3/admin/clients/${id}`)
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Create a new client
   * Handles Spring Boot ResponseUtil.success() responses with multipart form data
   */
  createClient: async (clientData: CreateClientRequest, config?: { onUploadProgress?: (progressEvent: any) => void }): Promise<ApiResponse<Client>> => {
    // Create FormData for multipart request
    const formData = new FormData()
    formData.append('title', clientData.title)
    
    if (clientData.description) {
      formData.append('description', clientData.description)
    }
    
    if (clientData.companyUrl) {
      formData.append('companyUrl', clientData.companyUrl)
    }
    
    if (clientData.logo) {
      formData.append('logo', clientData.logo)
    }

    const response = await apiService.postWithRetry<Client>('/v3/admin/clients', formData, {
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
   * Update an existing client
   * Handles Spring Boot ResponseUtil.success() responses with multipart form data
   */
  updateClient: async (id: string, clientData: UpdateClientRequest, config?: { onUploadProgress?: (progressEvent: any) => void }): Promise<ApiResponse<Client>> => {
    // Create FormData for multipart request
    const formData = new FormData()
    formData.append('title', clientData.title)
    
    if (clientData.description) {
      formData.append('description', clientData.description)
    }
    
    if (clientData.companyUrl) {
      formData.append('companyUrl', clientData.companyUrl)
    }
    
    if (clientData.logo) {
      formData.append('logo', clientData.logo)
    }

    const response = await apiService.putWithRetry<Client>(`/v3/admin/clients/${id}`, formData, {
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
   * Update client activity status
   * Handles Spring Boot ResponseUtil.success() responses
   */
  updateClientActivityStatus: async (id: string, active: boolean): Promise<ApiResponse<Client>> => {
    const response = await apiService.put<Client>(`/v3/admin/clients/${id}/activity-status`, null, {
      params: {
        active: active.toString()
      }
    })
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Delete a client
   * Handles Spring Boot ResponseUtil.success() responses (204 No Content)
   */
  deleteClient: async (id: string): Promise<void> => {
    const response = await apiService.delete(`/v3/admin/clients/${id}`)
    
    // For delete operations, we expect 204 No Content
    // The response might be empty, so we don't validate the response structure
    if (response.statusCode && response.statusCode >= 400) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
  }
}

// Re-export types for convenience
export type { Client, CreateClientRequest, UpdateClientRequest } from '@/types/api'
