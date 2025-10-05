import { apiService } from './api/index'
import { getDeviceId } from './device-id'
import { 
  ApiResponse, 
  SendOtpRequest,
  VerifyOtpRequest, 
  VerifyOtpResponse,
  User
} from '@/types/api'

/**
 * Clean authentication API
 * Uses your existing apiService
 */
export const authApi = {
  /**
   * Send OTP to email
   */
  sendOtp: async (email: string): Promise<ApiResponse<string>> => {
    const deviceId = getDeviceId()
    const requestData: SendOtpRequest = {
      email,
      deviceId
    }
    
    return apiService.post<string>('/v3/admin/auth/send-otp', requestData)
  },

  /**
   * Verify OTP and complete authentication
   * Backend returns User directly and sets HTTP-only cookies
   */
  verifyOtp: async (email: string, otpCode: string): Promise<ApiResponse<VerifyOtpResponse>> => {
    const deviceId = getDeviceId()
    const requestData: VerifyOtpRequest = {
      email,
      otpCode,
      deviceId
    }
    
    return apiService.post<VerifyOtpResponse>('/v3/admin/auth/verify-otp', requestData)
  },

  /**
   * Get current user information
   * Uses HTTP-only cookies automatically
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiService.get<User>('/v3/admin/auth/me')
  },

  /**
   * Refresh token
   * Backend returns User directly and sets new HTTP-only cookies
   */
  refreshToken: async (): Promise<ApiResponse<User>> => {
    const deviceId = getDeviceId()
    return apiService.post<User>(`/v3/auth/refresh-token/${deviceId}`)
  },

  /**
   * Logout user
   * Backend will clear HTTP-only cookies
   */
  logout: async (): Promise<void> => {
    const deviceId = getDeviceId()
    await apiService.post<void>(`/v3/auth/logout/${deviceId}`)
  }
}

