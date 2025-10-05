const DEVICE_ID_KEY = 'wafipix_device_id'

/**
 * Simple device ID utility
 * Generates a persistent device ID and stores it in localStorage
 * Same ID is used for the entire browser session
 */
export function getDeviceId(): string {
  // Try to get existing device ID
  if (typeof window !== 'undefined') {
    const existingId = localStorage.getItem(DEVICE_ID_KEY)
    if (existingId) {
      return existingId
    }
  }

  // Generate new simple device ID
  const deviceId = Math.random().toString(36).substring(2, 15)
  
  // Store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  
  return deviceId
}

/**
 * Clear device ID (useful for logout)
 */
export function clearDeviceId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEVICE_ID_KEY)
  }
}

