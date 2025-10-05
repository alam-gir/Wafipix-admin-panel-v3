import { toast } from 'sonner'

export interface UploadError {
  message: string
  code?: string
  status?: number
  isRetryable: boolean
  retryCount?: number
}

/**
 * Enhanced error handling for file uploads
 */
export function handleUploadError(error: unknown, context: string = 'Upload'): UploadError {
  const isAxiosError = (err: unknown): err is { 
    response?: { status: number; data?: { message?: string } }; 
    code?: string; 
    message?: string 
  } => {
    return typeof err === 'object' && err !== null && 'response' in err
  }

  if (!isAxiosError(error)) {
    return {
      message: 'An unexpected error occurred',
      isRetryable: false
    }
  }

  const status = error.response?.status
  const message = error.response?.data?.message || error.message || 'Upload failed'
  const code = error.code

  // Determine if error is retryable
  const isRetryable = (
    !status || // Network error
    status >= 500 || // Server errors
    status === 408 || // Request timeout
    status === 429 || // Too many requests
    code === 'ECONNABORTED' || // Timeout
    code === 'ENOTFOUND' || // DNS error
    code === 'ECONNRESET' // Connection reset
  )

  return {
    message,
    code,
    status,
    isRetryable
  }
}

/**
 * Show appropriate error message based on error type
 */
export function showUploadError(error: UploadError, context: string = 'Upload'): void {
  if (error.isRetryable) {
    toast.error(`${context} failed. The system will retry automatically.`, {
      description: error.message,
      duration: 5000
    })
  } else if (error.status === 413) {
    toast.error('File too large', {
      description: 'Please select a smaller file and try again.',
      duration: 5000
    })
  } else if (error.status === 415) {
    toast.error('Unsupported file type', {
      description: 'Please select a supported file format.',
      duration: 5000
    })
  } else if (error.status === 401 || error.status === 403) {
    toast.error('Authentication required', {
      description: 'Please log in again to continue.',
      duration: 5000
    })
  } else {
    toast.error(`${context} failed`, {
      description: error.message,
      duration: 5000
    })
  }
}

/**
 * Show retry attempt notification
 */
export function showRetryAttempt(attempt: number, maxRetries: number): void {
  toast.info(`Retrying upload... (${attempt}/${maxRetries})`, {
    duration: 2000
  })
}

/**
 * Show upload success with file info
 */
export function showUploadSuccess(fileName: string, fileSize?: number): void {
  const sizeText = fileSize ? ` (${formatFileSize(fileSize)})` : ''
  toast.success(`Upload successful: ${fileName}${sizeText}`)
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Enhanced upload wrapper with error handling
 */
export async function withUploadErrorHandling<T>(
  uploadFn: () => Promise<T>,
  context: string = 'Upload'
): Promise<T> {
  try {
    return await uploadFn()
  } catch (error) {
    const uploadError = handleUploadError(error, context)
    showUploadError(uploadError, context)
    throw uploadError
  }
}
