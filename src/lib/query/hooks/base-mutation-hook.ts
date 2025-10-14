/**
 * Base mutation hook factory
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { createMutationOptions } from '../utils';
import { MutationFunction } from '@tanstack/react-query';

export function createMutationHook<TData = unknown, TVariables = unknown, TError = Error>(
  mutationKey: unknown[],
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Partial<UseMutationOptions<TData, TError, TVariables>>
) {
  return function useCustomMutation(
    overrideOptions?: Partial<UseMutationOptions<TData, TError, TVariables>>
  ) {
    return useMutation({
      ...createMutationOptions(mutationKey, mutationFn),
      ...options,
      ...overrideOptions,
    });
  };
}
