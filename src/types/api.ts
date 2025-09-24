// API Response Types based on the Java ApiResponse class
export interface FieldError {
  field: string;
  message: string;
  rejectedValue?: any;
}

export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
  path?: string;
  statusCode?: number;
  errors?: FieldError[];
  pagination?: PaginationInfo;
}

// Authentication specific types
export interface SendOtpRequest {
  email: string;
  deviceId: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
  deviceId: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
