/**
 * Authentication API functions
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import {
  SendOtpRequest,
  SendOtpApiResponse,
  VerifyOtpRequest,
  VerifyOtpApiResponse,
  ProfileApiResponse,
  RefreshTokenRequest,
  RefreshTokenApiResponse,
  LogoutRequest,
  LogoutApiResponse,
} from '../types/auth';

/**
 * Send OTP to email
 */
export async function sendOtp(request: SendOtpRequest): Promise<SendOtpApiResponse> {
  const response = await apiClient.post<SendOtpApiResponse>(
    API_ENDPOINTS.AUTH.SEND_OTP,
    request
  );
  return response.data;
}

/**
 * Verify OTP and login
 */
export async function verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpApiResponse> {
  const response = await apiClient.post<VerifyOtpApiResponse>(
    API_ENDPOINTS.AUTH.VERIFY_OTP,
    request
  );
  return response.data;
}

/**
 * Get user profile
 */
export async function getProfile(): Promise<ProfileApiResponse> {
  const response = await apiClient.get<ProfileApiResponse>(
    API_ENDPOINTS.AUTH.PROFILE
  );
  return response.data;
}

/**
 * Refresh authentication tokens
 */
export async function refreshToken(deviceId: string): Promise<RefreshTokenApiResponse> {
  const response = await apiClient.get<RefreshTokenApiResponse>(
    `${API_ENDPOINTS.AUTH.REFRESH}?deviceId=${deviceId}`
  );
  return response.data;
}

/**
 * Logout user
 */
export async function logout(deviceId: string): Promise<LogoutApiResponse> {
  const response = await apiClient.get<LogoutApiResponse>(
    `${API_ENDPOINTS.AUTH.LOGOUT}?deviceId=${deviceId}`
  );
  return response.data;
}
