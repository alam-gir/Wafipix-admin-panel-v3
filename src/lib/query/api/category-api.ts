/**
 * Category API functions based on actual backend endpoints
 */

import { apiClient } from '../../api/client';
import { API_ENDPOINTS } from '../../api/config';
import { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest, 
  CategoryFilters,
  CategoryHierarchy,
  CategoryOption,
  PaginatedResponse,
  PaginationParams 
} from '../types';

export const categoryApi = {
  /**
   * Get category options for parent selection (for create mode)
   */
  getOptions: async (): Promise<CategoryOption[]> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.OPTIONS);
    return response.data.data;
  },

  /**
   * Get category parent options for parent selection (for edit mode)
   */
  getParentOptions: async (categoryId: string): Promise<CategoryOption[]> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.PARENT_OPTIONS(categoryId));
    return response.data.data;
  },

  /**
   * Get maximum level in categories
   */
  getMaxLevel: async (): Promise<number> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.MAX_LEVEL);
    return response.data.data;
  },

  /**
   * Get all categories with optional filters and pagination
   */
  getAll: async (params?: PaginationParams & CategoryFilters): Promise<PaginatedResponse<Category>> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.BASE, {
      params,
    });
    return response.data;
  },

  /**
   * Get a single category by ID
   */
  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    return response.data.data;
  },

  /**
   * Get a single category by title
   */
  getByTitle: async (title: string): Promise<Category> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.BY_TITLE(title));
    return response.data.data;
  },

  /**
   * Get root categories (categories without parent)
   */
  getRootCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.ROOT);
    return response.data.data;
  },

  /**
   * Get all categories in tree format
   */
  getTree: async (): Promise<Category[]> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.TREE);
    return response.data.data;
  },

  /**
   * Get category hierarchy (with parent & children)
   */
  getHierarchy: async (id: string): Promise<CategoryHierarchy> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.HIERARCHY(id));
    return response.data.data;
  },

  /**
   * Create a new category
   */
  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const formData = new FormData();
    formData.append('title', data.title);
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    if (data.parentId) {
      formData.append('parentId', data.parentId);
    }

    const response = await apiClient.post(API_ENDPOINTS.CATEGORIES.BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Update an existing category
   */
  update: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const formData = new FormData();
    
    if (data.title) {
      formData.append('title', data.title);
    }
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    if (data.status) {
      formData.append('status', data.status);
    }
    
    if (data.parentId !== undefined) {
      formData.append('parentId', data.parentId || '');
    }

    const response = await apiClient.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Update category parent
   */
  updateParent: async (id: string, parentId?: string): Promise<Category> => {
    const params = parentId ? { parentId } : {};
    const response = await apiClient.put(API_ENDPOINTS.CATEGORIES.UPDATE_PARENT(id), null, {
      params,
    });
    return response.data.data;
  },

  /**
   * Update category status
   */
  updateStatus: async (id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<Category> => {
    const response = await apiClient.put(API_ENDPOINTS.CATEGORIES.UPDATE_STATUS(id), null, {
      params: { value: status },
    });
    return response.data.data;
  },

  /**
   * Delete a category
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};
