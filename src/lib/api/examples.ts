// Example usage of the API service with Spring Boot ResponseUtil structure
import { apiService } from '@/lib/api'
import { ApiErrorHandler, ResponseProcessor, PaginationUtils } from '@/lib/api/error-handler'
import { ApiResponse, User, FieldError } from '@/types/api'

// Example 1: Handling a simple success response
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const response = await apiService.get<User>(`/users/${userId}`)
    
    // Check if response is successful
    if (ApiErrorHandler.isSuccess(response)) {
      return ResponseProcessor.extractData(response)
    } else {
      console.error('API Error:', ApiErrorHandler.getErrorMessage(response))
      return null
    }
  } catch (error) {
    console.error('Network Error:', error)
    return null
  }
}

// Example 2: Handling paginated data (Spring Data Page)
export async function getUsers(page: number = 1, size: number = 10): Promise<{
  users: User[];
  pagination: any;
} | null> {
  try {
    const response = await apiService.getPaginated<User>(`/users`, page, size)
    
    if (ApiErrorHandler.isSuccess(response)) {
      return ResponseProcessor.extractPaginatedData(response)
    } else {
      console.error('API Error:', ApiErrorHandler.getErrorMessage(response))
      return null
    }
  } catch (error) {
    console.error('Network Error:', error)
    return null
  }
}

// Example 3: Handling validation errors (Spring BindingResult)
export async function createUser(userData: Partial<User>): Promise<{
  success: boolean;
  user?: User;
  errors?: FieldError[];
  message?: string;
}> {
  try {
    const response = await apiService.post<User>('/users', userData)
    
    if (ApiErrorHandler.isSuccess(response)) {
      return {
        success: true,
        user: response.data || undefined,
        message: response.message
      }
    } else {
      return {
        success: false,
        errors: ApiErrorHandler.getFieldErrors(response),
        message: ApiErrorHandler.getErrorMessage(response)
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred'
    }
  }
}

// Example 4: Handling different HTTP status codes
export async function deleteUser(userId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await apiService.delete(`/users/${userId}`)
    
    if (ApiErrorHandler.isSuccess(response)) {
      return {
        success: true,
        message: response.message || 'User deleted successfully'
      }
    } else {
      // Handle specific error cases
      if (ApiErrorHandler.isNotFound(response)) {
        return {
          success: false,
          message: 'User not found'
        }
      } else if (ApiErrorHandler.isForbidden(response)) {
        return {
          success: false,
          message: 'You do not have permission to delete this user'
        }
      } else {
        return {
          success: false,
          message: ApiErrorHandler.getErrorMessage(response)
        }
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred'
    }
  }
}

// Example 5: Using pagination utilities
export function handlePaginationResponse(response: ApiResponse<User[]>) {
  if (!ApiErrorHandler.isSuccess(response) || !response.pagination) {
    return null
  }

  const { data, pagination } = ResponseProcessor.extractPaginatedData(response)
  
  // Generate page numbers for UI
  const pageNumbers = PaginationUtils.generatePageNumbers(
    pagination.page, 
    pagination.totalPages, 
    5
  )

  return {
    users: data,
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
    totalElements: pagination.totalElements,
    hasNext: pagination.hasNext,
    hasPrevious: pagination.hasPrevious,
    pageNumbers
  }
}

// Example 6: Form validation with field errors
export function validateFormData(response: ApiResponse<any>, formFields: string[]): {
  isValid: boolean;
  fieldErrors: Record<string, string>;
  generalError?: string;
} {
  const fieldErrors: Record<string, string> = {}
  
  if (ApiErrorHandler.isSuccess(response)) {
    return { isValid: true, fieldErrors }
  }

  // Extract field-specific errors
  const apiFieldErrors = ApiErrorHandler.getFieldErrors(response)
  apiFieldErrors.forEach(error => {
    if (formFields.includes(error.field)) {
      fieldErrors[error.field] = error.message
    }
  })

  return {
    isValid: false,
    fieldErrors,
    generalError: ApiErrorHandler.getErrorMessage(response)
  }
}

// Example 7: React hook for API calls
export function useApiCall<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = async (apiCall: () => Promise<ApiResponse<T>>) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiCall()
      
      if (ApiErrorHandler.isSuccess(response)) {
        setData(ResponseProcessor.extractData(response))
      } else {
        setError(ApiErrorHandler.getErrorMessage(response))
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, data, execute }
}

// Example 8: Error boundary for API errors
export class ApiErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error: error.message }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('API Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

