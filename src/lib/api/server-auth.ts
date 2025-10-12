/**
 * Server-side authentication utilities
 * For use in server components and API routes
 */

import { cookies } from 'next/headers';
import { getProfile } from './auth/auth-api';
import { User } from './types/auth';

/**
 * Get user profile on server-side
 * Returns null if not authenticated
 */
export async function getServerProfile(): Promise<User | null> {
  try {
    const response = await getProfile();
    
    if (!response.success) {
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error('Server-side profile fetch failed:', error);
    return null;
  }
}

/**
 * Check if user is authenticated on server-side
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const profile = await getServerProfile();
  return !!profile;
}

/**
 * Get cookies for server-side requests
 */
export function getServerCookies(): string {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader;
}

/**
 * Redirect to send-otp if not authenticated
 * For use in server components
 */
export async function requireAuth(redirectTo: string = '/send-otp'): Promise<User> {
  const profile = await getServerProfile();
  
  if (!profile) {
    // This will be handled by middleware, but we can throw for server components
    throw new Error('Authentication required');
  }
  
  return profile;
}
