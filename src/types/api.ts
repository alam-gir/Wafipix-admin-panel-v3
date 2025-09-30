// API Response Types based on the Java ApiResponse class
export interface FieldError {
  field: string;
  message: string;
  rejectedValue?: any;
}

export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
  path?: string;
  statusCode?: number;
  errors?: FieldError[];
  pagination?: PaginationInfo;
}

// Authentication specific types
export interface SendOtpRequest {
  email: string;
  deviceId: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
  deviceId: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateCategoryRequest {
  title: string;
  subtitle: string;
}

export interface UpdateCategoryRequest {
  title: string;
  subtitle: string;
}

export interface CategoryResponse extends ApiResponse<Category> {}
export interface CategoriesResponse extends ApiResponse<Category[]> {}

// Service Types
export interface Service {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  icon: string;
  categoryId: string;
  categoryTitle: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateServiceRequest {
  title: string;
  subtitle: string;
  description: string;
  icon: File;
  categoryId: string;
}

export interface UpdateServiceRequest {
  title: string;
  subtitle: string;
  description: string;
  icon?: File;
  categoryId: string;
}

export interface ServiceSearchRequest {
  title?: string;
  slug?: string;
  categoryId?: string;
  active?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface ServiceResponse extends ApiResponse<Service> {}
export interface ServicesResponse extends ApiResponse<Service[]> {}

// Service Feature Types
export interface ServiceFeature {
  text: string;
  highlight: boolean;
}

export interface ServiceFeatureRequest {
  text: string;
  highlight: boolean;
}

export interface UpdateServiceFeaturesRequest {
  serviceId: string;
  features: ServiceFeatureRequest[];
}

export interface ServiceFeaturesResponse extends ApiResponse<ServiceFeature[]> {}

// Service FAQ Types
export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceFAQRequest {
  question: string;
  answer: string;
}

export interface UpdateServiceFAQsRequest {
  serviceId: string;
  faqs: ServiceFAQRequest[];
}

export interface ServiceFAQsResponse extends ApiResponse<ServiceFAQ[]> {}

// Client Types
export interface Client {
  id: string;
  title: string;
  logo: string;
  description: string;
  companyUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateClientRequest {
  title: string;
  description?: string;
  companyUrl?: string;
  logo?: File;
}

export interface UpdateClientRequest {
  title: string;
  description?: string;
  companyUrl?: string;
  logo?: File;
}

export interface ClientResponse extends ApiResponse<Client> {}
export interface ClientsResponse extends ApiResponse<Client[]> {}
