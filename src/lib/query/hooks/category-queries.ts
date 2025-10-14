/**
 * Category query hooks based on actual API endpoints
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/category-api';
import { queryKeys } from '../utils';
import { Category, CategoryFilters, PaginationParams } from '../types';

/**
 * Hook to get category options for parent selection (for create mode)
 */
export function useCategoryOptions() {
  return useQuery({
    queryKey: queryKeys.categories.options(),
    queryFn: categoryApi.getOptions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get category parent options for parent selection (for edit mode)
 */
export function useCategoryParentOptions(categoryId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.categories.parentOptions(categoryId),
    queryFn: () => categoryApi.getParentOptions(categoryId),
    enabled: enabled && !!categoryId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get maximum level in categories
 */
export function useCategoryMaxLevel() {
  return useQuery({
    queryKey: queryKeys.categories.maxLevel(),
    queryFn: categoryApi.getMaxLevel,
    staleTime: 30 * 60 * 1000, // 30 minutes - max level doesn't change often
  });
}

/**
 * Hook to get all categories with filters and pagination
 */
export function useCategories(params?: PaginationParams & CategoryFilters) {
  return useQuery({
    queryKey: queryKeys.categories.list(params || {}),
    queryFn: () => categoryApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a single category by ID
 */
export function useCategory(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoryApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get a single category by title
 */
export function useCategoryByTitle(title: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.categories.detail(`title-${title}`),
    queryFn: () => categoryApi.getByTitle(title),
    enabled: enabled && !!title,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get root categories (categories without parent)
 */
export function useRootCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list({ type: 'root' }),
    queryFn: () => categoryApi.getRootCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get all categories in tree format
 */
export function useCategoryTree() {
  return useQuery({
    queryKey: queryKeys.categories.tree(),
    queryFn: categoryApi.getTree,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get category hierarchy (with parent & children)
 */
export function useCategoryHierarchy(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.categories.detail(`${id}-hierarchy`),
    queryFn: () => categoryApi.getHierarchy(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get categories with infinite scroll
 */
export function useInfiniteCategories(filters?: CategoryFilters) {
  return useInfiniteQuery({
    queryKey: queryKeys.categories.list({ ...filters, infinite: true }),
    queryFn: ({ pageParam = 0 }) => 
      categoryApi.getAll({ ...filters, page: pageParam, size: 20 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
}
