/**
 * Product query keys
 */

export const PRODUCT_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_KEYS.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...PRODUCT_KEYS.lists(), { filters }] as const,
  details: () => [...PRODUCT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PRODUCT_KEYS.details(), id] as const,
  summary: (id: string) => [...PRODUCT_KEYS.detail(id), 'summary'] as const,
  
  // Variants
  variants: (productId: string, params?: Record<string, any>) => [...PRODUCT_KEYS.detail(productId), 'variants', params] as const,
  variant: (productId: string, variantId: string) => [...PRODUCT_KEYS.variants(productId), variantId] as const,
  
  // Attributes
  attributes: (productId: string, params?: Record<string, any>) => [...PRODUCT_KEYS.detail(productId), 'attributes', params] as const,
  attribute: (productId: string, attributeId: string) => [...PRODUCT_KEYS.attributes(productId), attributeId] as const,
  attributeValues: (productId: string, attributeId: string, params?: Record<string, any>) => [...PRODUCT_KEYS.attribute(productId, attributeId), 'values', params] as const,
  attributeValue: (productId: string, attributeId: string, valueId: string) => [...PRODUCT_KEYS.attributeValues(productId, attributeId), valueId] as const,
  
  // Specifications
  specifications: (productId: string) => [...PRODUCT_KEYS.detail(productId), 'specifications'] as const,
  specification: (productId: string, specificationId: string) => [...PRODUCT_KEYS.specifications(productId), specificationId] as const,
  
  // Special endpoints
  byCategory: (categoryId: string) => [...PRODUCT_KEYS.all, 'category', categoryId] as const,
  lowStock: () => [...PRODUCT_KEYS.all, 'low-stock'] as const,
  withoutVariants: () => [...PRODUCT_KEYS.all, 'without-variants'] as const,
  withVariants: () => [...PRODUCT_KEYS.all, 'with-variants'] as const,
} as const;
