import { apiService } from './index'
import { User } from '@/types/api'
import { ApiResponse } from '@/types/api'

export interface CreateUserRequest {
  email: string
  firstName: string
  lastName: string
  password: string
  role: string
  isActive?: boolean
}

export interface UpdateUserRequest {
  email?: string
  firstName?: string
  lastName?: string
  role?: string
  isActive?: boolean
}

export interface UserFilters {
  search?: string
  role?: string
  isActive?: boolean
  page?: number
  limit?: number
}

export interface UsersResponse {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const usersApi = {
  getUsers: async (filters?: UserFilters): Promise<ApiResponse<UsersResponse>> => {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.role) params.append('role', filters.role)
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString())
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    return apiService.get<UsersResponse>(`/users${queryString ? `?${queryString}` : ''}`)
  },

  getUser: async (id: string): Promise<ApiResponse<User>> => {
    return apiService.get<User>(`/users/${id}`)
  },

  createUser: async (user: CreateUserRequest): Promise<ApiResponse<User>> => {
    return apiService.post<User>('/users', user)
  },

  updateUser: async (id: string, user: UpdateUserRequest): Promise<ApiResponse<User>> => {
    return apiService.put<User>(`/users/${id}`, user)
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(`/users/${id}`)
  },

  toggleUserStatus: async (id: string): Promise<ApiResponse<User>> => {
    return apiService.put<User>(`/users/${id}/toggle-status`)
  },

  resetUserPassword: async (id: string): Promise<ApiResponse<{ temporaryPassword: string }>> => {
    return apiService.post<{ temporaryPassword: string }>(`/users/${id}/reset-password`)
  }
}
