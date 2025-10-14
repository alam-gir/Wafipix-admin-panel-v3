/**
 * Base query hook factory
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { createQueryOptions } from '../utils';
import { QueryFunction } from '@tanstack/react-query';

export function createQueryHook<TData = unknown, TError = Error>(
  queryKey: unknown[],
  queryFn: QueryFunction<TData>,
  options?: Partial<UseQueryOptions<TData, TError>>
) {
  return function useCustomQuery(overrideOptions?: Partial<UseQueryOptions<TData, TError>>) {
    return useQuery({
      ...createQueryOptions(queryKey, queryFn),
      ...options,
      ...overrideOptions,
    });
  };
}
