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

// Advertisement Video Types
export interface AdvertisementVideo {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateAdvertisementVideoRequest {
  videoFile: File;
}

export interface AdvertisementVideoResponse extends ApiResponse<AdvertisementVideo> {}

// Social Media Types
export interface SocialMedia {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateSocialMediaRequest {
  title: string;
  url: string;
}

export interface UpdateSocialMediaRequest {
  title: string;
  url: string;
}

export interface SocialMediaResponse extends ApiResponse<SocialMedia> {}
export interface SocialMediasResponse extends ApiResponse<SocialMedia[]> {}

// Review Types
export interface Review {
  id: string;
  reviewImage: string;
  platform: string;
  clientName: string;
  rating: number;
  reviewText: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateReviewRequest {
  platform: string;
  clientName?: string;
  rating: number;
  reviewText?: string;
  reviewImage?: File;
}

export interface UpdateReviewRequest {
  platform?: string;
  clientName?: string;
  rating?: number;
  reviewText?: string;
  reviewImage?: File;
}

export interface ReviewResponse extends ApiResponse<Review> {}
export interface ReviewsResponse extends ApiResponse<Review[]> {}
export interface ReviewPlatformsResponse extends ApiResponse<string[]> {}

// Contact Types
export interface ContactReplyResponse {
  id: string
  message: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface ContactResponse {
  id: string
  fullName: string
  email: string
  phone: string
  message: string
  status: string
  readBy: string
  replies: ContactReplyResponse[]
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface ContactReplyRequest {
  message: string
}

// Contact API Response Types
export interface ContactsResponse extends ApiResponse<Page<ContactResponse>> {}
export interface ContactDetailResponse extends ApiResponse<ContactResponse> {}
export interface ContactReplyApiResponse extends ApiResponse<ContactResponse> {}
export interface UnreadCountResponse extends ApiResponse<number> {}

// Portfolio Types
export interface FileResponse {
  id: string;
  fileName: string;
  originalFileName: string;
  filePath: string;
  publicUrl: string;
  mimeType: string;
  fileSize: number;
  fileExtension: string;
  folderPath: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItemResponse {
  id: string;
  file: FileResponse;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryResponse {
  id: string;
  isMobileGrid: boolean;
  items: GalleryItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkListResponse {
  id: string;
  title: string;
  slug: string;
  service: Service;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkResponse {
  id: string;
  title: string;
  slug: string;
  service: Service;
  description: string;
  coverVideo?: FileResponse;
  coverImage?: FileResponse;
  profileVideo?: FileResponse;
  profileImage?: FileResponse;
  galleries: GalleryResponse[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkRequest {
  title: string;
  serviceId: string;
  description?: string;
  coverVideo?: File;
  coverImage?: File;
  profileVideo?: File;
  profileImage?: File;
}

export interface UpdateWorkRequest {
  title?: string;
  serviceId?: string;
  description?: string;
  coverVideo?: File;
  coverImage?: File;
  profileVideo?: File;
  profileImage?: File;
}

export interface CreateGalleryRequest {
  isMobileGrid?: boolean;
  files?: File[];
}

export interface UpdateGalleryRequest {
  isMobileGrid?: boolean;
}

export interface RemoveGalleryFilesRequest {
  galleryItemIds: string[];
}

// Spring Boot Page structure
export interface Page<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      unsorted: boolean
      empty: boolean
      sorted: boolean
    }
    offset: number
    unpaged: boolean
    paged: boolean
  }
  last: boolean
  totalElements: number
  totalPages: number
  sort: {
    unsorted: boolean
    empty: boolean
    sorted: boolean
  }
  first: boolean
  size: number
  number: number
  numberOfElements: number
  empty: boolean
}

// API Response Types
export interface WorksResponse extends ApiResponse<Page<WorkListResponse>> {}
export interface WorkDetailResponse extends ApiResponse<WorkResponse> {}
export interface GalleriesResponse extends ApiResponse<GalleryResponse[]> {}
export interface GalleryDetailResponse extends ApiResponse<GalleryResponse> {}
