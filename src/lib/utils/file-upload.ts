import { AxiosProgressEvent } from 'axios'

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
  speed: string
  estimatedTime: string
}

export interface UploadStats {
  startTime: number
  lastProgressTime: number
  lastLoaded: number
}

/**
 * Calculate upload speed and estimated time
 */
export function calculateUploadStats(
  progressEvent: AxiosProgressEvent,
  stats: UploadStats
): { speed: string; estimatedTime: string } {
  const now = Date.now()
  const timeDiff = now - stats.lastProgressTime
  const loadedDiff = progressEvent.loaded - stats.lastLoaded

  // Update stats
  stats.lastProgressTime = now
  stats.lastLoaded = progressEvent.loaded

  if (timeDiff > 0 && loadedDiff > 0) {
    const speedBytesPerMs = loadedDiff / timeDiff
    const speedBytesPerSecond = speedBytesPerMs * 1000
    const speedKBPerSecond = speedBytesPerSecond / 1024
    const speedMBPerSecond = speedKBPerSecond / 1024

    let speed: string
    if (speedMBPerSecond >= 1) {
      speed = `${speedMBPerSecond.toFixed(1)} MB/s`
    } else {
      speed = `${speedKBPerSecond.toFixed(1)} KB/s`
    }

  // Calculate estimated time
  const remainingBytes = progressEvent.total ? progressEvent.total - progressEvent.loaded : 0
  const estimatedMs = remainingBytes / speedBytesPerMs
  const estimatedSeconds = Math.ceil(estimatedMs / 1000)

    let estimatedTime: string
    if (estimatedSeconds < 60) {
      estimatedTime = `${estimatedSeconds}s`
    } else if (estimatedSeconds < 3600) {
      const minutes = Math.floor(estimatedSeconds / 60)
      const seconds = estimatedSeconds % 60
      estimatedTime = `${minutes}m ${seconds}s`
    } else {
      const hours = Math.floor(estimatedSeconds / 3600)
      const minutes = Math.floor((estimatedSeconds % 3600) / 60)
      estimatedTime = `${hours}h ${minutes}m`
    }

    return { speed, estimatedTime }
  }

  return { speed: 'Calculating...', estimatedTime: 'Calculating...' }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Validate file before upload
 */
export function validateFile(file: File, options: {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  allowedExtensions?: string[]
}): { isValid: boolean; error?: string } {
  const { maxSize = 100 * 1024 * 1024, allowedTypes = [], allowedExtensions = [] } = options

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${formatFileSize(maxSize)}`
    }
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.startsWith(type))) {
    return {
      isValid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`
    }
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        error: `File extension must be one of: ${allowedExtensions.join(', ')}`
      }
    }
  }

  return { isValid: true }
}

/**
 * Create a progress handler with enhanced statistics
 */
export function createProgressHandler(
  onProgress: (progress: UploadProgress) => void
) {
  const stats: UploadStats = {
    startTime: Date.now(),
    lastProgressTime: Date.now(),
    lastLoaded: 0
  }

  return (progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total) {
      const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      const { speed, estimatedTime } = calculateUploadStats(progressEvent, stats)

      onProgress({
        loaded: progressEvent.loaded,
        total: progressEvent.total,
        percentage,
        speed,
        estimatedTime
      })
    }
  }
}

/**
 * Retry configuration for different file types
 */
export const RETRY_CONFIGS = {
  // Small files (< 10MB)
  small: {
    maxRetries: 2,
    retryDelay: 1000,
    timeout: 120000 // 2 minutes
  },
  // Medium files (10MB - 100MB)
  medium: {
    maxRetries: 3,
    retryDelay: 2000,
    timeout: 600000 // 10 minutes
  },
  // Large files (> 100MB)
  large: {
    maxRetries: 5,
    retryDelay: 3000,
    timeout: 1800000 // 30 minutes
  }
} as const

/**
 * Get retry configuration based on file size
 */
export function getRetryConfig(fileSize: number) {
  if (fileSize < 10 * 1024 * 1024) {
    return RETRY_CONFIGS.small
  } else if (fileSize < 100 * 1024 * 1024) {
    return RETRY_CONFIGS.medium
  } else {
    return RETRY_CONFIGS.large
  }
}
