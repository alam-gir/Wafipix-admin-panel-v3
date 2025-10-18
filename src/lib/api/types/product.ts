/**
 * Product related types
 */

import { ApiResponse, Pagination } from './common';

// Base Product Types
export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  profileImage?: string;
  images: string[];
  descriptionImages: string[];
  minimumOrderQuantity: number;
  status: 'ACTIVE' | 'INACTIVE';
  category: {
    id: string;
    title: string;
    image?: string;
  };
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductSummary {
  id: string;
  title: string;
  slug: string;
  description?: string;
  profileImage?: string;
  minimumOrderQuantity: number;
  status: 'ACTIVE' | 'INACTIVE';
  category: {
    id: string;
    title: string;
    image?: string;
  };
  variantCount: number;
  totalStock: number;
  createdAt: string;
  updatedAt: string;
}

// Product Attribute Types
export interface ProductAttribute {
  id: string;
  name: string;
  attributeType: 'TEXT' | 'IMAGE' | 'NUMBER';
  values: ProductAttributeValue[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductAttributeValue {
  id: string;
  value: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Product Variant Types
export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  weight?: number;
  dimensions?: string;
  barcode?: string;
  isActive: boolean;
  isTracked: boolean;
  attributeValues: VariantAttributeValue[];
  createdAt: string;
  updatedAt: string;
}

export interface VariantAttributeValue {
  attributeValueId: string;
  attributeName: string;
  value: string;
  imageUrl?: string;
}

// Product Specification Types
export interface ProductSpecification {
  id: string;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

// Request Types
export interface CreateProductRequest {
  title: string;
  description?: string;
  categoryId: string;
  minimumOrderQuantity?: number;
  profileImage?: File;
  images?: File[];
  descriptionImages?: File[];
}

export interface UpdateProductRequest {
  title: string;
  description?: string;
  categoryId: string;
  minimumOrderQuantity?: number;
  profileImage?: File;
  images?: File[];
  descriptionImages?: File[];
  existingImages?: string[];
  existingDescriptionImages?: string[];
}

export interface UpdateProductStatusRequest {
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CreateProductVariantRequest {
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  weight?: number;
  dimensions?: string;
  barcode?: string;
  isActive?: boolean;
  isTracked?: boolean;
  attributeValueIds?: string[];
}

export interface UpdateProductVariantRequest {
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  weight?: number;
  dimensions?: string;
  barcode?: string;
  isActive?: boolean;
  isTracked?: boolean;
  attributeValueIds?: string[];
}

export interface CreateProductAttributeRequest {
  name: string;
  attributeType: 'TEXT' | 'IMAGE' | 'NUMBER';
}

export interface UpdateProductAttributeRequest {
  name: string;
  attributeType: 'TEXT' | 'IMAGE' | 'NUMBER';
}

export interface CreateAttributeValueRequest {
  value: string;
  image?: File;
}

export interface UpdateAttributeValueRequest {
  value: string;
  image?: File;
}

export interface CreateProductSpecificationRequest {
  name: string;
  value: string;
}

export interface UpdateProductSpecificationRequest {
  name: string;
  value: string;
}

// API Response Types
export type ProductApiResponse = ApiResponse<Product>;
export type ProductSummaryApiResponse = ApiResponse<ProductSummary>;
export type ProductsApiResponse = ApiResponse<ProductSummary[]>;
export type ProductVariantApiResponse = ApiResponse<ProductVariant>;
export type ProductVariantsApiResponse = ApiResponse<ProductVariant[]>;
export type ProductAttributeApiResponse = ApiResponse<ProductAttribute>;
export type ProductAttributesApiResponse = ApiResponse<ProductAttribute[]>;
export type ProductAttributeValueApiResponse = ApiResponse<ProductAttributeValue>;
export type ProductAttributeValuesApiResponse = ApiResponse<ProductAttributeValue[]>;
export type ProductSpecificationApiResponse = ApiResponse<ProductSpecification>;
export type ProductSpecificationsApiResponse = ApiResponse<ProductSpecification[]>;
export type BooleanApiResponse = ApiResponse<boolean>;
