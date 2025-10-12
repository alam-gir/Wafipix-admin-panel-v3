/**
 * Refresh token manager to handle concurrent requests
 */

import { getDeviceId } from '../utils/device-id';
import { apiClient } from './client';

class RefreshTokenManager {
  private refreshPromise: Promise<any> | null = null;
  private isRefreshing = false;

  async refreshToken(): Promise<boolean> {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<boolean> {
    try {
      const deviceId = getDeviceId();
      const response = await apiClient.get(`/auth/refresh?deviceId=${deviceId}`);
      
      return response.data.success;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  isRefreshInProgress(): boolean {
    return this.isRefreshing;
  }

  /**
   * Reset refresh state (call on logout)
   */
  reset(): void {
    this.isRefreshing = false;
    this.refreshPromise = null;
    
    // Clear refresh flag cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'token_refresh_in_progress=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
}

// Export singleton instance
export const refreshTokenManager = new RefreshTokenManager();
