/**
 * Product query hooks
 */

import { useQuery } from '@tanstack/react-query';
import { PRODUCT_KEYS } from '../types/product';
import { 
  getProducts, 
  getProduct, 
  getProductSummary,
  getProductAttributes,
  getProductAttribute,
  getProductAttributeValues,
  getProductAttributeValue,
  getProductVariants,
  getProductVariant,
  getProductSpecifications,
  getProductSpecification
} from '@/lib/api/product/product-api';

// Products list query
export const useProducts = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
  categoryId?: string;
} = {}) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: () => getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Single product query
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Product summary query
export const useProductSummary = (id: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.summary(id),
    queryFn: () => getProductSummary(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Product attributes queries
export const useProductAttributes = (productId: string, params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.attributes(productId, params),
    queryFn: () => getProductAttributes(productId, params),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductAttribute = (productId: string, attributeId: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.attribute(productId, attributeId),
    queryFn: () => getProductAttribute(productId, attributeId),
    enabled: !!productId && !!attributeId,
    staleTime: 5 * 60 * 1000,
  });
};

// Product attribute values queries
export const useProductAttributeValues = (productId: string, attributeId: string, params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.attributeValues(productId, attributeId, params),
    queryFn: () => getProductAttributeValues(productId, attributeId, params),
    enabled: !!productId && !!attributeId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductAttributeValue = (productId: string, attributeId: string, valueId: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.attributeValue(productId, attributeId, valueId),
    queryFn: () => getProductAttributeValue(productId, attributeId, valueId),
    enabled: !!productId && !!attributeId && !!valueId,
    staleTime: 5 * 60 * 1000,
  });
};

// Product variants queries
export const useProductVariants = (productId: string, params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.variants(productId, params),
    queryFn: () => getProductVariants(productId, params),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductVariant = (productId: string, variantId: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.variant(productId, variantId),
    queryFn: () => getProductVariant(productId, variantId),
    enabled: !!productId && !!variantId,
    staleTime: 5 * 60 * 1000,
  });
};

// Product specifications queries
export const useProductSpecifications = (productId: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.specifications(productId),
    queryFn: () => getProductSpecifications(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductSpecification = (productId: string, specificationId: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.specification(productId, specificationId),
    queryFn: () => getProductSpecification(productId, specificationId),
    enabled: !!productId && !!specificationId,
    staleTime: 5 * 60 * 1000,
  });
};
