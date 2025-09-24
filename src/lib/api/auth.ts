import { apiService } from './index'
import { getDeviceId } from '../auth/device-id'
import { ApiErrorHandler } from './error-handler'
import { 
  ApiResponse, 
  SendOtpRequest,
  VerifyOtpRequest, 
  VerifyOtpResponse,
  User
} from '@/types/api'

export const authApi = {
  /**
   * Send OTP to email for authentication
   * Handles Spring Boot ResponseUtil.success() responses
   */
  sendOtp: async (email: string): Promise<ApiResponse<string>> => {
    const deviceId = getDeviceId()
    const requestData: SendOtpRequest = {
      email,
      deviceId
    }
    
    const response = await apiService.post<string>('/v3/admin/auth/send-otp', requestData)
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Verify OTP and complete authentication
   * Handles Spring Boot ResponseUtil.success() responses with cookie setting
   */
  verifyOtp: async (email: string, otpCode: string): Promise<ApiResponse<VerifyOtpResponse>> => {
    const deviceId = getDeviceId()
    const requestData: VerifyOtpRequest = {
      email,
      otpCode,
      deviceId
    }
    
    const response = await apiService.post<VerifyOtpResponse>('/v3/admin/auth/verify-otp', requestData)
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Get current user information
   * Handles Spring Boot ResponseUtil.success() responses
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiService.get<User>('/v3/admin/auth/me')
    
    // Validate response structure
    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }
    
    return response
  },

  /**
   * Logout user (clear tokens)
   * Handles Spring Boot ResponseUtil.success() responses
   */
  logout: async (): Promise<void> => {
    try {
      const deviceId = getDeviceId()
      
      if (!deviceId) {
        throw new Error('No device ID available')
      }

      const response = await apiService.post<void>(`/v3/auth/logout/${deviceId}`)
      
      // Check if logout was successful
      if (!ApiErrorHandler.isSuccess(response)) {
        console.warn('Logout API call failed:', ApiErrorHandler.getErrorMessage(response))
      }
    } catch (error) {
      console.warn('Logout API call error:', error)
    } finally {
      // Always clear local tokens regardless of API response
      apiService.logout()
    }
  },

  /**
   * Refresh access token
   * Handles Spring Boot ResponseUtil.success() responses
   * Uses HTTP-only cookies automatically sent by browser
   */
  refreshToken: async (): Promise<ApiResponse<{ accessToken: string; refreshToken: string; expiresIn: number }>> => {
    const deviceId = getDeviceId()

    if (!deviceId) {
      throw new Error('No device ID available')
    }

    const response = await apiService.post<{ accessToken: string; refreshToken: string; expiresIn: number }>(
      `/v3/auth/refresh-token/${deviceId}`
    )

    if (!ApiErrorHandler.isSuccess(response)) {
      throw new Error(ApiErrorHandler.getErrorMessage(response))
    }

    return response
  }
}


// Re-export types for convenience
export type { User } from '@/types/api'
