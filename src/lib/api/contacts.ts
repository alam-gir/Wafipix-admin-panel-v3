import { apiService } from './index'
import { ApiErrorHandler } from './error-handler'
import {
  ContactResponse,
  ContactReplyRequest,
  ContactsResponse,
  ContactDetailResponse,
  ContactReplyApiResponse,
  UnreadCountResponse,
  Page
} from '@/types/api'

export const contactsApi = {
  /**
   * Get all contacts with pagination
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getAll: async (page: number = 0, size: number = 10): Promise<ContactsResponse> => {
    const response = await apiService.get<Page<ContactResponse>>(`/v3/admin/contacts/paginated?page=${page}&size=${size}`)
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    return response
  },

  /**
   * Get contact by ID
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getById: async (id: string): Promise<ContactDetailResponse> => {
    const response = await apiService.get<ContactResponse>(`/v3/admin/contacts/${id}`)
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    return response
  },

  /**
   * Reply to a contact
   * Handles Spring Boot ResponseUtil.success() responses
   */
  replyToContact: async (id: string, data: ContactReplyRequest): Promise<ContactReplyApiResponse> => {
    const response = await apiService.post<ContactResponse>(`/v3/admin/contacts/${id}/reply`, data)
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    return response
  },

  /**
   * Get unread contacts count
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await apiService.get<number>('/v3/admin/contacts/unread-count')
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    return response
  },

  /**
   * Delete a contact
   * Handles Spring Boot ResponseUtil.success() responses
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiService.delete(`/v3/admin/contacts/${id}`)
    if (response.statusCode && response.statusCode >= 400) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
  }
}
