/**
 * TanStack Query Client Configuration
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds after which data is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Time in milliseconds after which inactive queries are garbage collected
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      
      // Retry failed requests
      retry: (failureCount, error: Error) => {
        // Don't retry on 4xx errors (client errors)
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: (failureCount, error: Error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
            return false;
          }
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      
      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});
