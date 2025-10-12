/**
 * Server-side profile fetching for middleware
 */

import { NextRequest } from 'next/server';
import { API_CONFIG, API_ENDPOINTS } from './config';
import { ProfileApiResponse } from './types/auth';

/**
 * Fetch user profile on server-side with cookies
 */
export async function getServerProfile(request: NextRequest): Promise<ProfileApiResponse | null> {
  try {
    // Get cookies from the request
    const cookies = request.headers.get('cookie');
    
    if (!cookies) {
      return null;
    }

    // Make request to backend with cookies
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.PROFILE}`, {
      method: 'GET',
      headers: {
        'Cookie': cookies,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache auth requests
    });

    if (!response.ok) {
      return null;
    }

    const data: ProfileApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Server-side profile fetch failed:', error);
    return null;
  }
}
