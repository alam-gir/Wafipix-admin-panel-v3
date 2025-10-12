'use client';

/**
 * SWR hook for user profile
 */

import useSWR from 'swr';
import { getProfile } from '../../api/auth/auth-api';
import { User } from '../../api/types/auth';
import { useAuthStore } from '../../../stores/auth-store';

const PROFILE_KEY = '/auth/profile';

/**
 * Fetcher function for SWR
 */
async function profileFetcher(): Promise<User> {
  const response = await getProfile();
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
}

/**
 * Hook to get user profile with SWR
 * Supports server-side initial data
 */
export function useProfile(initialData?: User) {
  const { setUser, setError, logout } = useAuthStore();

  const { data, error, isLoading, mutate } = useSWR(
    PROFILE_KEY,
    profileFetcher,
    {
      fallbackData: initialData,
      onSuccess: (data) => {
        setUser(data);
        setError(null);
      },
      onError: (error) => {
        console.error('Profile fetch error:', error);
        setError(error.message);
        logout(); // Clear auth state on error
      },
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    user: data,
    isLoading,
    error,
    mutate,
    isAuthenticated: !!data,
  };
}
