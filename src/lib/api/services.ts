import { apiService } from './index'
import { 
  Service, 
  CreateServiceRequest, 
  UpdateServiceRequest,
  ServiceSearchRequest,
  ServiceResponse, 
  ServicesResponse,
  ServiceFeature,
  UpdateServiceFeaturesRequest,
  ServiceFeaturesResponse,
  ServiceFAQ,
  UpdateServiceFAQsRequest,
  ServiceFAQsResponse,
  Package,
  CreatePackageRequest,
  UpdatePackageRequest,
  PackageResponse,
  PackagesResponse,
  ApiResponse
} from '@/types/api'

export const servicesApi = {
  // Get all services
  getAll: async (): Promise<ServicesResponse> => {
    const response = await apiService.get<Service[]>('/v3/admin/services')
    return response as ServicesResponse
  },

  // Search services
  search: async (searchRequest: ServiceSearchRequest): Promise<ServicesResponse> => {
    const response = await apiService.post<Service[]>('/v3/admin/services/search', searchRequest)
    return response as ServicesResponse
  },

  // Get service by ID
  getById: async (id: string): Promise<ServiceResponse> => {
    const response = await apiService.get<Service>(`/v3/admin/services/${id}`)
    return response as ServiceResponse
  },

  // Create new service
  create: async (data: CreateServiceRequest, config?: { onUploadProgress?: (progressEvent: any) => void }): Promise<ServiceResponse> => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('subtitle', data.subtitle)
    formData.append('description', data.description)
    formData.append('icon', data.icon)
    formData.append('categoryId', data.categoryId)

    const response = await apiService.postWithRetry<Service>('/v3/admin/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      isFileUpload: true,
      maxRetries: 3,
      retryDelay: 2000,
      ...config
    })
    return response as ServiceResponse
  },

  // Update service
  update: async (id: string, data: UpdateServiceRequest, config?: { onUploadProgress?: (progressEvent: any) => void }): Promise<ServiceResponse> => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('subtitle', data.subtitle)
    formData.append('description', data.description)
    if (data.icon) {
      formData.append('icon', data.icon)
    }
    formData.append('categoryId', data.categoryId)

    const response = await apiService.putWithRetry<Service>(`/v3/admin/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      isFileUpload: true,
      maxRetries: 3,
      retryDelay: 2000,
      ...config
    })
    return response as ServiceResponse
  },

  // Delete service
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await apiService.delete(`/v3/admin/services/${id}`)
    return response as ApiResponse
  },

  // Update service activity status
  updateActivityStatus: async (id: string, active: boolean): Promise<ApiResponse> => {
    const response = await apiService.put(`/v3/admin/services/${id}/activity-status?active=${active}`)
    return response as ApiResponse
  },

  // Service Features Management
  getFeatures: async (serviceId: string): Promise<ServiceFeaturesResponse> => {
    const response = await apiService.get<ServiceFeature[]>(`/v3/admin/services/${serviceId}/features`)
    return response as ServiceFeaturesResponse
  },

  updateFeatures: async (data: UpdateServiceFeaturesRequest): Promise<ServiceFeaturesResponse> => {
    const response = await apiService.put<ServiceFeature[]>('/v3/admin/services/features', data)
    return response as ServiceFeaturesResponse
  },

  // Service FAQs Management
  getFAQs: async (serviceId: string): Promise<ServiceFAQsResponse> => {
    const response = await apiService.get<ServiceFAQ[]>(`/v3/admin/services/${serviceId}/faqs`)
    return response as ServiceFAQsResponse
  },

  updateFAQs: async (data: UpdateServiceFAQsRequest): Promise<ServiceFAQsResponse> => {
    const response = await apiService.put<ServiceFAQ[]>('/v3/admin/services/faqs', data)
    return response as ServiceFAQsResponse
  },

  // Service Packages Management
  getPackagesByServiceId: async (serviceId: string): Promise<PackagesResponse> => {
    const response = await apiService.get<Package[]>(`/v3/admin/packages/service/${serviceId}`)
    return response as PackagesResponse
  },

  getPackageById: async (packageId: string): Promise<PackageResponse> => {
    const response = await apiService.get<Package>(`/v3/admin/packages/${packageId}`)
    return response as PackageResponse
  },

  createPackage: async (data: CreatePackageRequest): Promise<PackageResponse> => {
    const response = await apiService.post<Package>('/v3/admin/packages', data)
    return response as PackageResponse
  },

  updatePackage: async (packageId: string, data: UpdatePackageRequest): Promise<PackageResponse> => {
    const response = await apiService.put<Package>(`/v3/admin/packages/${packageId}`, data)
    return response as PackageResponse
  },

  deletePackage: async (packageId: string): Promise<ApiResponse> => {
    const response = await apiService.delete(`/v3/admin/packages/${packageId}`)
    return response as ApiResponse
  }
}
