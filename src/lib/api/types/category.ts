/**
 * Category related types
 */

import { ApiResponse } from './common';

export interface Category {
  id: string;
  title: string;
  description: string;
  image: string; // Cloudflare R2 URL
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
}

export type CategoryStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface CreateCategoryRequest {
  title: string;
  description?: string;
  image?: File;
  status?: CategoryStatus;
}

export interface UpdateCategoryRequest {
  title: string;
  description?: string;
  image?: File;
  status?: CategoryStatus;
}

export interface CategoryListParams {
  page?: number;
  size?: number;
  search?: string;
  status?: CategoryStatus;
}

export interface UpdateCategoryStatusRequest {
  value: CategoryStatus;
}

// API Response Types
export type CreateCategoryApiResponse = ApiResponse<boolean>;
export type UpdateCategoryApiResponse = ApiResponse<boolean>;
export type GetCategoryApiResponse = ApiResponse<Category>;
export type GetCategoriesApiResponse = ApiResponse<Category[]>;
export type UpdateCategoryStatusApiResponse = ApiResponse<boolean>;
export type DeleteCategoryApiResponse = ApiResponse<boolean>;
