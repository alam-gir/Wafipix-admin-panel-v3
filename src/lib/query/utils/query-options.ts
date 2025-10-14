/**
 * Common query options factory
 */

import { queryOptions } from '@tanstack/react-query';
import { QueryFunction } from '@tanstack/react-query';

export function createQueryOptions<TData = unknown>(
  queryKey: unknown[],
  queryFn: QueryFunction<TData>,
  options?: {
    staleTime?: number;
    gcTime?: number;
    enabled?: boolean;
  }
) {
  return queryOptions({
    queryKey,
    queryFn,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled ?? true,
  });
}
