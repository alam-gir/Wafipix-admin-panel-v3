import { apiService } from './index'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
  permissions: string[]
  roles: string[]
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  permissions: string[]
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: string
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiService.post<LoginResponse>('/auth/login', credentials)
  },

  register: async (data: RegisterData): Promise<LoginResponse> => {
    return apiService.post<LoginResponse>('/auth/register', data)
  },

  logout: async (): Promise<void> => {
    return apiService.post<void>('/auth/logout')
  },

  getCurrentUser: async (): Promise<User> => {
    return apiService.get<User>('/auth/me')
  },

  refreshToken: async (): Promise<{ token: string }> => {
    return apiService.post<{ token: string }>('/auth/refresh')
  },

  forgotPassword: async (email: string): Promise<void> => {
    return apiService.post<void>('/auth/forgot-password', { email })
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    return apiService.post<void>('/auth/reset-password', { token, password })
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    return apiService.post<void>('/auth/change-password', { currentPassword, newPassword })
  }
}
