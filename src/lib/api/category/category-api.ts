/**
 * Category API functions
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryListParams,
  UpdateCategoryStatusRequest,
  CreateCategoryApiResponse,
  UpdateCategoryApiResponse,
  GetCategoryApiResponse,
  GetCategoriesApiResponse,
  UpdateCategoryStatusApiResponse,
  DeleteCategoryApiResponse,
} from '../types/category';

/**
 * Create a new category
 */
export async function createCategory(request: CreateCategoryRequest): Promise<CreateCategoryApiResponse> {
  const formData = new FormData();
  formData.append('title', request.title);
  
  if (request.description) {
    formData.append('description', request.description);
  }
  
  if (request.image) {
    formData.append('image', request.image);
  }
  
  if (request.status) {
    formData.append('status', request.status);
  }

  const response = await apiClient.post<CreateCategoryApiResponse>(
    API_ENDPOINTS.CATEGORIES.CREATE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

/**
 * Update an existing category
 */
export async function updateCategory(
  categoryId: string,
  request: UpdateCategoryRequest
): Promise<UpdateCategoryApiResponse> {
  const formData = new FormData();
  formData.append('title', request.title);
  
  if (request.description) {
    formData.append('description', request.description);
  }
  
  if (request.image) {
    formData.append('image', request.image);
  }
  
  if (request.status) {
    formData.append('status', request.status);
  }

  const response = await apiClient.put<UpdateCategoryApiResponse>(
    `${API_ENDPOINTS.CATEGORIES.UPDATE}/${categoryId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

/**
 * Get category by ID
 */
export async function getCategory(categoryId: string): Promise<GetCategoryApiResponse> {
  const response = await apiClient.get<GetCategoryApiResponse>(
    `${API_ENDPOINTS.CATEGORIES.GET_BY_ID}/${categoryId}`
  );
  return response.data;
}

/**
 * Get all categories with pagination and filtering
 */
export async function getCategories(params: CategoryListParams = {}): Promise<GetCategoriesApiResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page !== undefined) {
    searchParams.append('page', params.page.toString());
  }
  
  if (params.size !== undefined) {
    searchParams.append('size', params.size.toString());
  }
  
  if (params.search) {
    searchParams.append('search', params.search);
  }
  
  if (params.status) {
    searchParams.append('status', params.status);
  }

  const queryString = searchParams.toString();
  const url = queryString ? `${API_ENDPOINTS.CATEGORIES.GET_ALL}?${queryString}` : API_ENDPOINTS.CATEGORIES.GET_ALL;
  
  const response = await apiClient.get<GetCategoriesApiResponse>(url);
  return response.data;
}

/**
 * Update category status
 */
export async function updateCategoryStatus(
  categoryId: string,
  request: UpdateCategoryStatusRequest
): Promise<UpdateCategoryStatusApiResponse> {
  const response = await apiClient.put<UpdateCategoryStatusApiResponse>(
    `${API_ENDPOINTS.CATEGORIES.UPDATE_STATUS}/${categoryId}/status?value=${request.value}`
  );
  return response.data;
}

/**
 * Delete category (soft delete)
 */
export async function deleteCategory(categoryId: string): Promise<DeleteCategoryApiResponse> {
  const response = await apiClient.delete<DeleteCategoryApiResponse>(
    `${API_ENDPOINTS.CATEGORIES.DELETE}/${categoryId}`
  );
  return response.data;
}
