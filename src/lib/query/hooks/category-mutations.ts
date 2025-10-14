/**
 * Category mutation hooks based on actual API endpoints
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../api/category-api';
import { queryKeys } from '../utils';
import { 
  Category, 
  UpdateCategoryRequest,
  PaginatedResponse
} from '../types';

// Type-safe cache update functions
type CacheData = PaginatedResponse<Category> | Category[] | Category | null | undefined;

// Utility function to update category in list data
function updateCategoryInListData(oldData: CacheData, updatedCategory: Category, categoryId: string): CacheData {
  if (!oldData) return oldData;
  
  // Handle PaginatedResponse structure
  if (typeof oldData === 'object' && oldData !== null && 'data' in oldData) {
    const paginatedData = oldData as PaginatedResponse<Category>;
    if (Array.isArray(paginatedData.data)) {
      return {
        ...paginatedData,
        data: paginatedData.data.map((category: Category) =>
          category.id === categoryId ? updatedCategory : category
        )
      };
    }
  }
  
  // Handle direct array structure
  if (Array.isArray(oldData)) {
    return oldData.map((category: Category) =>
      category.id === categoryId ? updatedCategory : category
    );
  }
  
  return oldData;
}

// Utility function to add category to list data
function addCategoryToListData(oldData: CacheData, newCategory: Category): CacheData {
  if (!oldData) return oldData;
  
  // Handle PaginatedResponse structure
  if (typeof oldData === 'object' && oldData !== null && 'data' in oldData) {
    const paginatedData = oldData as PaginatedResponse<Category>;
    if (Array.isArray(paginatedData.data)) {
      return {
        ...paginatedData,
        data: [newCategory, ...paginatedData.data]
      };
    }
  }
  
  // Handle direct array structure
  if (Array.isArray(oldData)) {
    return [newCategory, ...oldData];
  }
  
  return oldData;
}

// Utility function to remove category from list data
function removeCategoryFromListData(oldData: CacheData, categoryId: string): CacheData {
  if (!oldData) return oldData;
  
  // Handle PaginatedResponse structure
  if (typeof oldData === 'object' && oldData !== null && 'data' in oldData) {
    const paginatedData = oldData as PaginatedResponse<Category>;
    if (Array.isArray(paginatedData.data)) {
      return {
        ...paginatedData,
        data: paginatedData.data.filter((category: Category) => category.id !== categoryId)
      };
    }
  }
  
  // Handle direct array structure
  if (Array.isArray(oldData)) {
    return oldData.filter((category: Category) => category.id !== categoryId);
  }
  
  return oldData;
}

// Reusable optimistic update function for category mutations
function updateCategoryOptimistically(
  queryClient: ReturnType<typeof useQueryClient>,
  updatedCategory: Category,
  categoryId: string
) {
  // Update the specific category in cache
  queryClient.setQueryData(
    queryKeys.categories.detail(categoryId),
    updatedCategory
  );
  
  // Optimistically update the category in all list queries
  queryClient.setQueriesData(
    { queryKey: queryKeys.categories.lists() },
    (oldData: CacheData) => updateCategoryInListData(oldData, updatedCategory, categoryId)
  );
  
  // Update in hierarchical queries
  queryClient.setQueriesData(
    { queryKey: queryKeys.categories.all },
    (oldData: CacheData) => updateCategoryInListData(oldData, updatedCategory, categoryId)
  );
}

// Reusable function to add category optimistically
function addCategoryOptimistically(
  queryClient: ReturnType<typeof useQueryClient>,
  newCategory: Category
) {
  // Add the new category to all list queries
  queryClient.setQueriesData(
    { queryKey: queryKeys.categories.lists() },
    (oldData: CacheData) => addCategoryToListData(oldData, newCategory)
  );
  
  // Add to hierarchical queries
  queryClient.setQueriesData(
    { queryKey: queryKeys.categories.all },
    (oldData: CacheData) => addCategoryToListData(oldData, newCategory)
  );
  
  // Set the individual category data
  queryClient.setQueryData(
    queryKeys.categories.detail(newCategory.id),
    newCategory
  );
}

// Reusable function to remove category optimistically
function removeCategoryOptimistically(
  queryClient: ReturnType<typeof useQueryClient>,
  categoryId: string
) {
  // Remove the category from all list queries
  queryClient.setQueriesData(
    { queryKey: queryKeys.categories.lists() },
    (oldData: CacheData) => removeCategoryFromListData(oldData, categoryId)
  );
  
  // Remove from hierarchical queries
  queryClient.setQueriesData(
    { queryKey: queryKeys.categories.all },
    (oldData: CacheData) => removeCategoryFromListData(oldData, categoryId)
  );
  
  // Remove the individual category data
  queryClient.removeQueries({ 
    queryKey: queryKeys.categories.detail(categoryId) 
  });
}

/**
 * Hook to create a new category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.create,
    onSuccess: (newCategory) => {
      addCategoryOptimistically(queryClient, newCategory);
    },
  });
}

/**
 * Hook to update an existing category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      categoryApi.update(id, data),
    onSuccess: (updatedCategory, variables) => {
      updateCategoryOptimistically(queryClient, updatedCategory, variables.id);
    },
  });
}

/**
 * Hook to update category parent
 */
export function useUpdateCategoryParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, parentId }: { id: string; parentId?: string }) =>
      categoryApi.updateParent(id, parentId),
    onSuccess: (updatedCategory, variables) => {
      updateCategoryOptimistically(queryClient, updatedCategory, variables.id);
    },
  });
}

/**
 * Hook to update category status
 */
export function useUpdateCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'INACTIVE' }) =>
      categoryApi.updateStatus(id, status),
    onSuccess: (updatedCategory, variables) => {
      updateCategoryOptimistically(queryClient, updatedCategory, variables.id);
    },
  });
}

/**
 * Hook to delete a category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: (_, deletedId) => {
      removeCategoryOptimistically(queryClient, deletedId);
    },
  });
}
