const DEVICE_ID_KEY = 'wafipix_device_id';

/**
 * Generates a simple random device ID
 * Checks localStorage first, generates new one if not found
 */
export function generateDeviceId(): string {
  // Try to get existing device ID first
  const existingId = getStoredDeviceId();
  if (existingId) {
    return existingId;
  }

  // Generate new random device ID
  const deviceId = 'device_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
  
  // Store the device ID
  storeDeviceId(deviceId);
  
  return deviceId;
}

/**
 * Gets the stored device ID or generates a new one
 */
export function getDeviceId(): string {
  return generateDeviceId();
}

/**
 * Gets the stored device ID from localStorage
 */
function getStoredDeviceId(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(DEVICE_ID_KEY);
  } catch (error) {
    console.warn('Failed to get device ID from localStorage:', error);
    return null;
  }
}

/**
 * Stores the device ID in localStorage
 */
function storeDeviceId(deviceId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  } catch (error) {
    console.warn('Failed to store device ID in localStorage:', error);
  }
}

/**
 * Clears the stored device ID (useful for logout)
 */
export function clearDeviceId(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(DEVICE_ID_KEY);
  } catch (error) {
    console.warn('Failed to clear device ID from localStorage:', error);
  }
}

