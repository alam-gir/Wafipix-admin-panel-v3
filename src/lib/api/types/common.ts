/**
 * Common API response types
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  errors?: FieldError[];
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface FieldError {
  field: string | null;
  message: string;
  rejectedValue?: any;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: FieldError[];
  timestamp: string;
}
