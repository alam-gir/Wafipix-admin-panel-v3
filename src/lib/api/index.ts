import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { getDeviceId } from '../device-id'
import { ApiResponse, User, PaginationInfo } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/'

// Enhanced API service that properly handles Spring Boot ResponseUtil responses
class ApiService {
  private axiosInstance: AxiosInstance
  private isRefreshing = false
  private refreshPromise: Promise<string> | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 300000, // 5 minutes default timeout
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Important for cookies
      // Enhanced configuration for file uploads
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - no token handling needed for HTTP-only cookies
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // HTTP-only cookies are automatically sent by the browser
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor - handle 401 (token expired) responses
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      async (error) => {
        const originalRequest = error.config

        // Don't retry refresh token endpoint - it would cause infinite loop
        const isRefreshEndpoint = originalRequest.url?.includes('/refresh-token')
        
        console.log('Response interceptor triggered:', {
          url: originalRequest.url,
          status: error.response?.status,
          isRefreshEndpoint,
          hasRetry: originalRequest._retry
        })
        
        // Handle 401 (Unauthorized) - Access token expired, try refresh
        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
          console.log('Access token expired, attempting refresh for:', originalRequest.url)
          originalRequest._retry = true

          try {
            // Try to refresh the token
            await this.refreshAccessToken()
            // Retry the original request with new token
            console.log('Token refresh successful, retrying request:', originalRequest.url)
            return this.axiosInstance(originalRequest)
          } catch (refreshError) {
            // Refresh failed, redirect to login
            console.warn('Token refresh failed, redirecting to login:', refreshError)
            this.logout()
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            return Promise.reject(refreshError)
          }
        }

        // Handle 403 (Forbidden) - Authentication required, redirect to login
        if (error.response?.status === 403) {
          console.warn('Authentication required, redirecting to login:', error.response?.data?.message || 'No message')
          this.logout()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          return Promise.reject(error)
        }

        // If this is a retry that failed again, don't retry anymore
        if (error.response?.status === 401 && originalRequest._retry) {
          console.warn('Request failed after token refresh, redirecting to login')
          this.logout()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }

        // If refresh token endpoint returns 401 or 403, redirect to login
        if ((error.response?.status === 401 || error.response?.status === 403) && isRefreshEndpoint) {
          console.warn('Refresh token expired or invalid, redirecting to login')
          this.logout()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.performTokenRefresh()

    try {
      const newAccessToken = await this.refreshPromise
      return newAccessToken
    } catch (error) {
      // Reset refreshing state on error
      this.isRefreshing = false
      this.refreshPromise = null
      throw error
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const deviceId = getDeviceId()

    if (!deviceId) {
      throw new Error('No device ID available')
    }

    console.log('Attempting to refresh token for device:', deviceId)

    try {
      // Use a separate axios instance without interceptors to avoid infinite loops
      const refreshAxios = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const response = await refreshAxios.post<ApiResponse<User>>(
        `/v3/admin/auth/refresh-token/${deviceId}`,
        {} // Empty body - refresh token comes from HTTP-only cookies
      )

      console.log('Token refresh response:', response.data)

      if (response.data.success && response.data.data) {
        // Backend will set new HTTP-only cookies and returns User directly
        console.log('Token refresh successful')
        return 'success' // Just return success since backend handles cookies
      } else {
        throw new Error(response.data.message || 'Token refresh failed')
      }
    } catch (error: unknown) {
      console.error('Token refresh failed:', error)
      
      // If refresh token is expired/invalid, throw a specific error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } }
        if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
          const message = axiosError.response?.data?.message || 'Refresh token expired or invalid - please login again'
          throw new Error(message)
        }
      }
      
      throw error
    }
  }

  logout() {
    // HTTP-only cookies are cleared by the backend logout endpoint
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  // Helper method to determine if we should retry a request
  private shouldRetry(error: unknown, attempt: number, maxRetries: number): boolean {
    // Don't retry if we've exceeded max attempts
    if (attempt >= maxRetries) return false
    
    // Type guard to check if error has response property
    const isAxiosError = (err: unknown): err is { response?: { status: number }; code?: string } => {
      return typeof err === 'object' && err !== null && 'response' in err
    }
    
    if (!isAxiosError(error)) return false
    
    // Don't retry authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) return false
    
    // Don't retry client errors (4xx) except timeout and network issues
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      // Retry only for specific client errors
      const retryableStatuses = [408, 429] // Request Timeout, Too Many Requests
      return retryableStatuses.includes(error.response.status)
    }
    
    // Retry for network errors, timeouts, and server errors
    return (
      !error.response || // Network error
      error.code === 'ECONNABORTED' || // Timeout
      error.code === 'ENOTFOUND' || // DNS error
      error.code === 'ECONNRESET' || // Connection reset
      (error.response.status >= 500) // Server errors
    )
  }

  // Helper method for delays
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Enhanced methods that properly handle Spring Boot ResponseUtil responses
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T>>(url, config)
      return this.processResponse(response)
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  // Enhanced POST method with intelligent timeout for file uploads
  async postWithRetry<T>(
    url: string, 
    data?: unknown, 
    config?: AxiosRequestConfig & { 
      isFileUpload?: boolean
      maxRetries?: number
      retryDelay?: number
    }
  ): Promise<ApiResponse<T>> {
    const maxRetries = config?.maxRetries || 3
    const retryDelay = config?.retryDelay || 1000
    const isFileUpload = config?.isFileUpload || false
    
    // Calculate intelligent timeout based on data size
    let timeout = 300000 // 5 minutes default
    
    if (isFileUpload && data instanceof FormData) {
      // Estimate file size from FormData
      let totalSize = 0
      for (const [key, value] of data.entries()) {
        if (value instanceof File) {
          totalSize += value.size
        }
      }
      
      // Calculate timeout: 1 minute per 10MB + 2 minutes base
      timeout = Math.max(120000, Math.min(1800000, (totalSize / (10 * 1024 * 1024)) * 60000 + 120000))
    }

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const requestConfig = {
          ...config,
          timeout,
          // Remove our custom properties
          isFileUpload: undefined,
          maxRetries: undefined,
          retryDelay: undefined,
        }

        const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, requestConfig)
        return this.processResponse(response)
      } catch (error) {
        const isLastAttempt = attempt === maxRetries
        const shouldRetry = this.shouldRetry(error, attempt, maxRetries)
        
        if (isLastAttempt || !shouldRetry) {
          return this.handleError<T>(error)
        }
        
        // Wait before retry with exponential backoff
        const delay = retryDelay * Math.pow(2, attempt)
        console.log(`Upload attempt ${attempt + 1} failed, retrying in ${delay}ms...`)
        await this.sleep(delay)
      }
    }
    
    return this.handleError<T>(new Error('Max retries exceeded'))
  }

  // Enhanced PUT method with intelligent timeout for file uploads
  async putWithRetry<T>(
    url: string, 
    data?: unknown, 
    config?: AxiosRequestConfig & { 
      isFileUpload?: boolean
      maxRetries?: number
      retryDelay?: number
    }
  ): Promise<ApiResponse<T>> {
    const maxRetries = config?.maxRetries || 3
    const retryDelay = config?.retryDelay || 1000
    const isFileUpload = config?.isFileUpload || false
    
    // Calculate intelligent timeout based on data size
    let timeout = 300000 // 5 minutes default
    
    if (isFileUpload && data instanceof FormData) {
      // Estimate file size from FormData
      let totalSize = 0
      for (const [key, value] of data.entries()) {
        if (value instanceof File) {
          totalSize += value.size
        }
      }
      
      // Calculate timeout: 1 minute per 10MB + 2 minutes base
      timeout = Math.max(120000, Math.min(1800000, (totalSize / (10 * 1024 * 1024)) * 60000 + 120000))
    }

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const requestConfig = {
          ...config,
          timeout,
          // Remove our custom properties
          isFileUpload: undefined,
          maxRetries: undefined,
          retryDelay: undefined,
        }

        const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, requestConfig)
        return this.processResponse(response)
      } catch (error) {
        const isLastAttempt = attempt === maxRetries
        const shouldRetry = this.shouldRetry(error, attempt, maxRetries)
        
        if (isLastAttempt || !shouldRetry) {
          return this.handleError<T>(error)
        }
        
        // Wait before retry with exponential backoff
        const delay = retryDelay * Math.pow(2, attempt)
        console.log(`Upload attempt ${attempt + 1} failed, retrying in ${delay}ms...`)
        await this.sleep(delay)
      }
    }
    
    return this.handleError<T>(new Error('Max retries exceeded'))
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config)
      return this.processResponse(response)
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config)
      return this.processResponse(response)
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config)
      return this.processResponse(response)
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  // Process successful responses from Spring Boot ResponseUtil
  private processResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
    const apiResponse = response.data
    
    // Ensure pagination info is properly calculated if present
    if (apiResponse.pagination) {
      apiResponse.pagination = this.calculatePaginationInfo(apiResponse.pagination)
    }
    
    return apiResponse
  }

  // Calculate missing pagination fields based on Spring Data Page structure
  private calculatePaginationInfo(pagination: PaginationInfo): PaginationInfo {
    const totalPages = Math.ceil(pagination.totalElements / pagination.size)
    
    return {
      ...pagination,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrevious: pagination.page > 1
    }
  }

  // Handle errors from Spring Boot backend
  private handleError<T>(error: unknown): ApiResponse<T> {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown } }
      if (axiosError.response?.data) {
        // Backend returned a structured error response
        return axiosError.response.data as ApiResponse<T>
      }
    }

    // Network or other errors
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? (error as { message: string }).message 
      : 'An unexpected error occurred'
    
    const statusCode = error && typeof error === 'object' && 'response' in error
      ? (error as { response?: { status?: number } }).response?.status || 500
      : 500
    
    return {
      success: false,
      message: errorMessage,
      statusCode,
      timestamp: new Date().toISOString()
    }
  }

  // Utility methods for common operations
  async getPaginated<T>(url: string, page: number = 1, size: number = 10, config?: AxiosRequestConfig): Promise<ApiResponse<T[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })
    
    return this.get<T[]>(`${url}?${params}`, config)
  }

  // For development mock data fallback
  private async getMockData<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const mockData = await import('../mock-data')
      const mockResponse = mockData.getMockResponse<T>(url, data)
      // Ensure mock response is wrapped in ApiResponse format
      if (mockResponse && typeof mockResponse === 'object' && 'success' in mockResponse) {
        return mockResponse as ApiResponse<T>
      } else {
        return {
          success: true,
          data: mockResponse as T,
          timestamp: new Date().toISOString()
        }
      }
    } catch {
      return {
        success: false,
        message: 'Mock data not available',
        statusCode: 404,
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Create singleton instance
export const apiService = new ApiService()

// Export individual API modules
export * from './dashboard'
export * from './users'
export * from './roles'
export * from './clients'
export * from './advertisement-videos'
export * from './social-media'
export * from './reviews'
export * from './contacts'
export * from './categories'
export * from './services'
export * from './portfolio'