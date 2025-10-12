/**
 * Authentication related types
 */

import { ApiResponse } from './common';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface SendOtpRequest {
  email: string;
  deviceId: string;
}

export interface SendOtpResponse {
  message: string;
  expiresAt: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  deviceId: string;
}

export interface VerifyOtpResponse extends User {}

export interface RefreshTokenRequest {
  deviceId: string;
}

export interface LogoutRequest {
  deviceId: string;
}

// API Response Types
export type SendOtpApiResponse = ApiResponse<SendOtpResponse>;
export type VerifyOtpApiResponse = ApiResponse<VerifyOtpResponse>;
export type ProfileApiResponse = ApiResponse<User>;
export type RefreshTokenApiResponse = ApiResponse<boolean>;
export type LogoutApiResponse = ApiResponse<boolean>;
