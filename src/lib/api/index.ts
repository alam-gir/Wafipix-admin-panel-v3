import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

class ApiService {
  private axiosInstance: AxiosInstance
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          this.clearToken()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('auth_token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('auth_token')
  }

  getToken() {
    return this.token || localStorage.getItem('auth_token')
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config)
      return response.data
    } catch (error) {
      // For development, return mock data if API fails
      if (process.env.NODE_ENV === 'development') {
        return this.getMockData<T>(url)
      }
      throw error
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config)
      return response.data
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        return this.getMockData<T>(url, data)
      }
      throw error
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config)
      return response.data
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        return this.getMockData<T>(url, data)
      }
      throw error
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config)
      return response.data
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        return this.getMockData<T>(url)
      }
      throw error
    }
  }

  private async getMockData<T>(url: string, data?: any): Promise<T> {
    // Import mock data dynamically
    const mockData = await import('../mock-data')
    return mockData.getMockResponse<T>(url, data)
  }
}

// Create singleton instance
export const apiService = new ApiService()

// Export individual API modules
export * from './auth'
export * from './dashboard'
export * from './users'
export * from './roles'
