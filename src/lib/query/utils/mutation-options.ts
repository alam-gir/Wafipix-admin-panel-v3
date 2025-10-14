/**
 * Common mutation options factory
 */

import { mutationOptions } from '@tanstack/react-query';
import { MutationFunction } from '@tanstack/react-query';

export function createMutationOptions<TData = unknown, TVariables = unknown>(
  mutationKey: unknown[],
  mutationFn: MutationFunction<TData, TVariables>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
  }
) {
  return mutationOptions({
    mutationKey,
    mutationFn,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
