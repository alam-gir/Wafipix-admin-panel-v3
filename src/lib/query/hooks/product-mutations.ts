/**
 * Product mutation hooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PRODUCT_KEYS } from '../types/product';
import {
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  createProductAttribute,
  updateProductAttribute,
  deleteProductAttribute,
  createProductAttributeValue,
  updateProductAttributeValue,
  deleteProductAttributeValue,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  createProductSpecification,
  updateProductSpecification,
  deleteProductSpecification,
  updateProductProfileImage,
  addProductImages,
  removeProductImages,
  addProductDescriptionImages,
  removeProductDescriptionImages
} from '@/lib/api/product/product-api';
import type { 
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
  UpdateProductSpecificationRequest
} from '@/lib/api/types/product';

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) => 
      updateProduct(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific product and list
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
    },
  });
};

// Update product status mutation
export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductStatusRequest }) => 
      updateProductStatus(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific product and list
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
    },
  });
};

// Product Attribute mutations
export const useCreateProductAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: CreateProductAttributeRequest }) => 
      createProductAttribute(productId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.attributes(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

export const useUpdateProductAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, attributeId, data }: { productId: string; attributeId: string; data: UpdateProductAttributeRequest }) => 
      updateProductAttribute(productId, attributeId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.attributes(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

export const useDeleteProductAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, attributeId }: { productId: string; attributeId: string }) => 
      deleteProductAttribute(productId, attributeId),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.attributes(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

// Product Attribute Value mutations
export const useCreateProductAttributeValue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, attributeId, data }: { productId: string; attributeId: string; data: CreateAttributeValueRequest }) => 
      createProductAttributeValue(productId, attributeId, data),
    onSuccess: (_, { productId, attributeId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.attributeValues(productId, attributeId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.attributes(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

export const useUpdateProductAttributeValue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, attributeId, valueId, data }: { productId: string; attributeId: string; valueId: string; data: UpdateAttributeValueRequest }) => 
      updateProductAttributeValue(productId, attributeId, valueId, data),
    onSuccess: (_, { productId, attributeId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.attributeValues(productId, attributeId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.attributes(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

export const useDeleteProductAttributeValue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, attributeId, valueId }: { productId: string; attributeId: string; valueId: string }) => 
      deleteProductAttributeValue(productId, attributeId, valueId),
    onSuccess: (_, { productId, attributeId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.attributeValues(productId, attributeId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.attributes(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

// Product Variant mutations
export const useCreateProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: CreateProductVariantRequest }) => 
      createProductVariant(productId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.variants(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

export const useUpdateProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, variantId, data }: { productId: string; variantId: string; data: UpdateProductVariantRequest }) => 
      updateProductVariant(productId, variantId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.variants(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

export const useDeleteProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, variantId }: { productId: string; variantId: string }) => 
      deleteProductVariant(productId, variantId),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.variants(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

// Product Specification mutations
export const useCreateProductSpecification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: CreateProductSpecificationRequest }) =>
      createProductSpecification(productId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.specifications(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

export const useUpdateProductSpecification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, specificationId, data }: { productId: string; specificationId: string; data: UpdateProductSpecificationRequest }) =>
      updateProductSpecification(productId, specificationId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.specifications(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

export const useDeleteProductSpecification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, specificationId }: { productId: string; specificationId: string }) =>
      deleteProductSpecification(productId, specificationId),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.specifications(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

// Image management mutations
export const useUpdateProductProfileImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, imageFile }: { productId: string; imageFile: File }) =>
      updateProductProfileImage(productId, imageFile),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.summary(productId) });
    },
  });
};

export const useAddProductImages = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, imageFiles }: { productId: string; imageFiles: File[] }) =>
      addProductImages(productId, imageFiles),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

export const useRemoveProductImages = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, imageUrls }: { productId: string; imageUrls: string[] }) =>
      removeProductImages(productId, imageUrls),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

export const useAddProductDescriptionImages = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, imageFiles }: { productId: string; imageFiles: File[] }) =>
      addProductDescriptionImages(productId, imageFiles),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};

export const useRemoveProductDescriptionImages = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, descriptionImageUrls }: { productId: string; descriptionImageUrls: string[] }) =>
      removeProductDescriptionImages(productId, descriptionImageUrls),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
    },
  });
};
