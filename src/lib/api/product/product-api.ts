/**
 * Product API functions
 */

import { API_CONFIG, API_ENDPOINTS } from '../config';
import { apiClient, fileUploadClient } from '../client';
import type {
  Product,
  ProductSummary,
  ProductVariant,
  ProductAttribute,
  ProductAttributeValue,
  ProductSpecification,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateProductStatusRequest,
  CreateProductAttributeRequest,
  UpdateProductAttributeRequest,
  CreateAttributeValueRequest,
  UpdateAttributeValueRequest,
  CreateProductVariantRequest,
  UpdateProductVariantRequest,
  CreateProductSpecificationRequest,
  UpdateProductSpecificationRequest,
  ProductApiResponse,
  ProductSummaryApiResponse,
  ProductsApiResponse,
  ProductVariantApiResponse,
  ProductVariantsApiResponse,
  ProductAttributeApiResponse,
  ProductAttributesApiResponse,
  ProductAttributeValueApiResponse,
  ProductAttributeValuesApiResponse,
  ProductSpecificationApiResponse,
  ProductSpecificationsApiResponse,
  BooleanApiResponse,
} from '../types/product';

// Product CRUD Operations
export const createProduct = async (data: CreateProductRequest): Promise<boolean> => {
  const formData = new FormData();
  
  formData.append('title', data.title);
  formData.append('categoryId', data.categoryId);
  
  if (data.description) formData.append('description', data.description);
  if (data.minimumOrderQuantity) formData.append('minimumOrderQuantity', data.minimumOrderQuantity.toString());
  if (data.profileImage) formData.append('profileImage', data.profileImage);
  
  if (data.images) {
    data.images.forEach(image => formData.append('images', image));
  }
  
  if (data.descriptionImages) {
    data.descriptionImages.forEach(image => formData.append('descriptionImages', image));
  }

  const response = await fileUploadClient.post<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS.BASE}`,
    formData
  );
  
  return response.data.data;
};

export const updateProduct = async (id: string, data: UpdateProductRequest): Promise<boolean> => {
  const formData = new FormData();
  
  formData.append('title', data.title);
  formData.append('categoryId', data.categoryId);
  
  if (data.description) formData.append('description', data.description);
  if (data.minimumOrderQuantity) formData.append('minimumOrderQuantity', data.minimumOrderQuantity.toString());
  if (data.profileImage) formData.append('profileImage', data.profileImage);
  
  if (data.images) {
    data.images.forEach(image => formData.append('images', image));
  }
  
  if (data.descriptionImages) {
    data.descriptionImages.forEach(image => formData.append('descriptionImages', image));
  }
  
  if (data.existingImages) {
    data.existingImages.forEach(url => formData.append('existingImages', url));
  }
  
  if (data.existingDescriptionImages) {
    data.existingDescriptionImages.forEach(url => formData.append('existingDescriptionImages', url));
  }

  const response = await fileUploadClient.put<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS.BY_ID(id)}`,
    formData
  );
  
  return response.data.data;
};

export const updateProductStatus = async (id: string, data: UpdateProductStatusRequest): Promise<boolean> => {
  const response = await apiClient.put<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS.UPDATE_STATUS(id)}`,
    data
  );
  
  return response.data.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await apiClient.get<ProductApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS.BY_ID(id)}`
  );
  
  return response.data.data;
};

export const getProductSummary = async (id: string): Promise<ProductSummary> => {
  const response = await apiClient.get<ProductSummaryApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS.SUMMARY(id)}`
  );
  
  return response.data.data;
};

export const getProducts = async (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
  categoryId?: string | null;
} = {}): Promise<{ products: ProductSummary[]; pagination: Record<string, unknown> }> => {
  const searchParams = new URLSearchParams();
  
  if (params.page !== undefined) searchParams.append('page', params.page.toString());
  if (params.size !== undefined) searchParams.append('size', params.size.toString());
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortDir) searchParams.append('sortDir', params.sortDir);
  if (params.search) searchParams.append('search', params.search);
  if (params.categoryId) searchParams.append('categoryId', params.categoryId);

  const response = await apiClient.get<ProductsApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS.BASE}?${searchParams.toString()}`
  );
  
  return {
    products: response.data.data,
    pagination: (response.data.pagination || {}) as Record<string, unknown>
  };
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const response = await apiClient.delete<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS.BY_ID(id)}`
  );
  
  return response.data.data;
};

// Product Attributes API
export const getProductAttributes = async (productId: string, params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}): Promise<ProductAttribute[]> => {
  const searchParams = new URLSearchParams();
  
  if (params?.page !== undefined) searchParams.append('page', params.page.toString());
  if (params?.size !== undefined) searchParams.append('size', params.size.toString());
  if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params?.sortDir) searchParams.append('sortDir', params.sortDir);

  const response = await apiClient.get<ProductAttributesApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_ATTRIBUTES.BASE(productId)}?${searchParams.toString()}`
  );
  
  return response.data.data;
};

export const getProductAttribute = async (productId: string, attributeId: string): Promise<ProductAttribute> => {
  const response = await apiClient.get<ProductAttributeApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_ATTRIBUTES.BY_ID(productId, attributeId)}`
  );
  
  return response.data.data;
};

export const createProductAttribute = async (productId: string, data: CreateProductAttributeRequest): Promise<boolean> => {
  const response = await apiClient.post<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_ATTRIBUTES.BASE(productId)}`,
    data
  );
  
  return response.data.data;
};

export const updateProductAttribute = async (productId: string, attributeId: string, data: UpdateProductAttributeRequest): Promise<boolean> => {
  const response = await apiClient.put<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_ATTRIBUTES.BY_ID(productId, attributeId)}`,
    data
  );
  
  return response.data.data;
};

export const deleteProductAttribute = async (productId: string, attributeId: string): Promise<boolean> => {
  const response = await apiClient.delete<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_ATTRIBUTES.BY_ID(productId, attributeId)}`
  );
  
  return response.data.data;
};

// Product Attribute Values API
export const getProductAttributeValues = async (productId: string, attributeId: string, params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}): Promise<ProductAttributeValue[]> => {
  const searchParams = new URLSearchParams();
  
  if (params?.page !== undefined) searchParams.append('page', params.page.toString());
  if (params?.size !== undefined) searchParams.append('size', params.size.toString());
  if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params?.sortDir) searchParams.append('sortDir', params.sortDir);

  const response = await apiClient.get<ProductAttributeValuesApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_ATTRIBUTES.VALUES(productId, attributeId)}?${searchParams.toString()}`
  );
  
  return response.data.data;
};

export const getProductAttributeValue = async (productId: string, attributeId: string, valueId: string): Promise<ProductAttributeValue> => {
  const response = await apiClient.get<ProductAttributeValueApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_ATTRIBUTES.VALUE_BY_ID(productId, attributeId, valueId)}`
  );
  
  return response.data.data;
};

export const createProductAttributeValue = async (productId: string, attributeId: string, data: CreateAttributeValueRequest): Promise<boolean> => {
  const formData = new FormData();
  formData.append('value', data.value);
  if (data.image) formData.append('image', data.image);

  const response = await fileUploadClient.post<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_ATTRIBUTES.VALUES(productId, attributeId)}`,
    formData
  );
  
  return response.data.data;
};

export const updateProductAttributeValue = async (productId: string, attributeId: string, valueId: string, data: UpdateAttributeValueRequest): Promise<boolean> => {
  const formData = new FormData();
  formData.append('value', data.value);
  if (data.image) formData.append('image', data.image);

  const response = await fileUploadClient.put<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_ATTRIBUTES.VALUE_BY_ID(productId, attributeId, valueId)}`,
    formData
  );
  
  return response.data.data;
};

export const deleteProductAttributeValue = async (productId: string, attributeId: string, valueId: string): Promise<boolean> => {
  const response = await apiClient.delete<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_ATTRIBUTES.VALUE_BY_ID(productId, attributeId, valueId)}`
  );
  
  return response.data.data;
};

// Product Variants API
export const getProductVariants = async (productId: string, params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}): Promise<ProductVariant[]> => {
  const searchParams = new URLSearchParams();
  
  if (params?.page !== undefined) searchParams.append('page', params.page.toString());
  if (params?.size !== undefined) searchParams.append('size', params.size.toString());
  if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params?.sortDir) searchParams.append('sortDir', params.sortDir);

  const response = await apiClient.get<ProductVariantsApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_VARIANTS.BASE(productId)}?${searchParams.toString()}`
  );
  
  return response.data.data;
};

export const getProductVariant = async (productId: string, variantId: string): Promise<ProductVariant> => {
  const response = await apiClient.get<ProductVariantApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_VARIANTS.BY_ID(productId, variantId)}`
  );
  
  return response.data.data;
};

export const createProductVariant = async (productId: string, data: CreateProductVariantRequest): Promise<boolean> => {
  const response = await apiClient.post<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_VARIANTS.BASE(productId)}`,
    data
  );
  
  return response.data.data;
};

export const updateProductVariant = async (productId: string, variantId: string, data: UpdateProductVariantRequest): Promise<boolean> => {
  const response = await apiClient.put<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_VARIANTS.BY_ID(productId, variantId)}`,
    data
  );
  
  return response.data.data;
};

export const deleteProductVariant = async (productId: string, variantId: string): Promise<boolean> => {
  const response = await apiClient.delete<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_VARIANTS.BY_ID(productId, variantId)}`
  );
  
  return response.data.data;
};

// Product Specifications API
export const getProductSpecifications = async (productId: string): Promise<ProductSpecification[]> => {
  const response = await apiClient.get<ProductSpecificationsApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_SPECIFICATIONS.BASE(productId)}`
  );
  
  return response.data.data;
};

export const getProductSpecification = async (productId: string, specificationId: string): Promise<ProductSpecification> => {
  const response = await apiClient.get<ProductSpecificationApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_SPECIFICATIONS.BY_ID(productId, specificationId)}`
  );
  
  return response.data.data;
};

export const createProductSpecification = async (productId: string, data: CreateProductSpecificationRequest): Promise<boolean> => {
  const response = await apiClient.post<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_SPECIFICATIONS.BASE(productId)}`,
    data
  );
  
  return response.data.data;
};

export const updateProductSpecification = async (productId: string, specificationId: string, data: UpdateProductSpecificationRequest): Promise<boolean> => {
  const response = await apiClient.put<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_SPECIFICATIONS.BY_ID(productId, specificationId)}`,
    data
  );
  
  return response.data.data;
};

export const deleteProductSpecification = async (productId: string, specificationId: string): Promise<boolean> => {
  const response = await apiClient.delete<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCT_SPECIFICATIONS.BY_ID(productId, specificationId)}`
  );
  
  return response.data.data;
};

// Image management functions
export const updateProductProfileImage = async (productId: string, imageFile: File): Promise<boolean> => {
  const formData = new FormData();
  formData.append('profileImage', imageFile);
  
  const response = await fileUploadClient.put<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS.UPDATE_PROFILE_IMAGE(productId)}`,
    formData
  );
  
  return response.data.data;
};

export const addProductImages = async (productId: string, imageFiles: File[]): Promise<boolean> => {
  const formData = new FormData();
  imageFiles.forEach((file) => {
    formData.append(`images`, file);
  });
  
  const response = await fileUploadClient.post<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS.ADD_IMAGES(productId)}`,
    formData
  );
  
  return response.data.data;
};

export const removeProductImages = async (productId: string, imageUrls: string[]): Promise<boolean> => {
  const response = await apiClient.delete<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS.REMOVE_IMAGES(productId)}`,
    { data: { imageUrls } }
  );
  
  return response.data.data;
};

export const addProductDescriptionImages = async (productId: string, imageFiles: File[]): Promise<boolean> => {
  const formData = new FormData();
  imageFiles.forEach((file) => {
    formData.append(`descriptionImages`, file);
  });
  
  const response = await fileUploadClient.post<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS.ADD_DESCRIPTION_IMAGES(productId)}`,
    formData
  );
  
  return response.data.data;
};

export const removeProductDescriptionImages = async (productId: string, descriptionImageUrls: string[]): Promise<boolean> => {
  const response = await apiClient.delete<BooleanApiResponse>(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS.REMOVE_DESCRIPTION_IMAGES(productId)}`,
    { data: { descriptionImageUrls } }
  );
  
  return response.data.data;
};
