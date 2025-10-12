/**
 * Category form schemas using Zod
 */

import { z } from 'zod';

// Category status enum
export const categoryStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);

// Create/Update Category Schema
export const categorySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  image: z
    .instanceof(File)
    .optional(),
  status: categoryStatusSchema.optional(),
});

// Category list params schema
export const categoryListParamsSchema = z.object({
  page: z.number().min(0).optional(),
  size: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  status: categoryStatusSchema.optional(),
});

// Update status schema
export const updateCategoryStatusSchema = z.object({
  value: categoryStatusSchema,
});

// Export types
export type CategoryFormData = z.infer<typeof categorySchema>;
export type CategoryListParamsData = z.infer<typeof categoryListParamsSchema>;
export type UpdateCategoryStatusData = z.infer<typeof updateCategoryStatusSchema>;
export type CategoryStatus = z.infer<typeof categoryStatusSchema>;
