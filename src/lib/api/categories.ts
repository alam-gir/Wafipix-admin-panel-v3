import { apiService } from './index'
import { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest, 
  CategoryResponse, 
  CategoriesResponse,
  ApiResponse
} from '@/types/api'

export const categoriesApi = {
  // Get all categories
  getAll: async (): Promise<CategoriesResponse> => {
    const response = await apiService.get<Category[]>('/v3/admin/categories')
    return response as CategoriesResponse
  },

  // Get category by ID
  getById: async (id: string): Promise<CategoryResponse> => {
    const response = await apiService.get<Category>(`/v3/admin/categories/${id}`)
    return response as CategoryResponse
  },

  // Create new category
  create: async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
    const response = await apiService.post<Category>('/v3/admin/categories', data)
    return response as CategoryResponse
  },

  // Update category
  update: async (id: string, data: UpdateCategoryRequest): Promise<CategoryResponse> => {
    const response = await apiService.put<Category>(`/v3/admin/categories/${id}`, data)
    return response as CategoryResponse
  },

  // Delete category
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await apiService.delete(`/v3/admin/categories/${id}`)
    return response as ApiResponse
  }
}

