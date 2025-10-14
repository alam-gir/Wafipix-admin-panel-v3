/**
 * Category form schemas using Zod - Updated for actual API
 */

import { z } from 'zod';

// Category status enum - matching API
export const categoryStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);

// Create Category Schema
export const createCategorySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  image: z
    .instanceof(File, { message: 'Please select a valid image file' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Image size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    )
    .optional(),
  parentId: z
    .string()
    .optional()
    .or(z.literal(''))
    .or(z.literal('root'))
    .refine((val) => {
      if (!val || val === '' || val === 'root') return true; // Allow empty string and "root" for root categories
      return z.string().uuid().safeParse(val).success; // Validate UUID only if not empty or root
    }, 'Invalid parent category ID'),
});

// Update Category Schema
export const updateCategorySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(255, 'Title must be less than 255 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  image: z
    .instanceof(File, { message: 'Please select a valid image file' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Image size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    )
    .optional(),
  status: categoryStatusSchema.optional(),
  parentId: z
    .string()
    .optional()
    .or(z.literal(''))
    .or(z.literal('root'))
    .refine((val) => {
      if (!val || val === '' || val === 'root') return true; // Allow empty string and "root" for root categories
      return z.string().uuid().safeParse(val).success; // Validate UUID only if not empty or root
    }, 'Invalid parent category ID'),
});

// Category list filters schema
export const categoryFiltersSchema = z.object({
  page: z.number().min(0).default(0),
  size: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(['title', 'createdAt', 'updatedAt']).default('title'),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
  status: categoryStatusSchema.optional(),
  level: z.number().min(0).optional(),
});

// Update parent schema
export const updateParentSchema = z.object({
  parentId: z
    .string()
    .optional()
    .or(z.literal(''))
    .or(z.literal('root'))
    .refine((val) => {
      if (!val || val === '' || val === 'root') return true; // Allow empty string and "root" for root categories
      return z.string().uuid().safeParse(val).success; // Validate UUID only if not empty or root
    }, 'Invalid parent category ID'),
});

// Update status schema
export const updateStatusSchema = z.object({
  status: categoryStatusSchema,
});

// Export types
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
export type CategoryFiltersData = z.infer<typeof categoryFiltersSchema>;
export type UpdateParentData = z.infer<typeof updateParentSchema>;
export type UpdateStatusData = z.infer<typeof updateStatusSchema>;
export type CategoryStatus = z.infer<typeof categoryStatusSchema>;
