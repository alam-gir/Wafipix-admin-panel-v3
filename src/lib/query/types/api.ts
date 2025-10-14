/**
 * Base types for API responses and pagination
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  size?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  status?: "ACTIVE" | "INACTIVE"
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
