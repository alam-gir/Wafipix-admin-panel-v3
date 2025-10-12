/**
 * Simple device ID utility for browser
 * Generates 4-5 character alphanumeric ID
 * Stores in localStorage for persistence
 */

const DEVICE_ID_KEY = 'device_id';

/**
 * Generate a random alphanumeric string of 4-5 characters
 */
function generateDeviceId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = Math.floor(Math.random() * 2) + 4; // 4 or 5 characters
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Get device ID from localStorage
 * If not found, generate new one and store it
 */
export function getDeviceId(): string {
  if (typeof window === 'undefined') {
    // Return a temporary ID for SSR
    return 'temp-device-id';
  }
  
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  
  return deviceId;
}

/**
 * Clear device ID from localStorage
 */
export function clearDeviceId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEVICE_ID_KEY);
  }
}
