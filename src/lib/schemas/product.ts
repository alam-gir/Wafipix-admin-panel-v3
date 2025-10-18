/**
 * Product Form Schemas - Zod validation for product forms
 */

import { z } from 'zod';
import { getTextLength } from '@/lib/utils/rich-text';

// Create Product Schema
export const createProductSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(255, 'Title must be less than 255 characters'),
  
  description: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val || val === '') return true;
      const textLength = getTextLength(val);
      return textLength <= 2000;
    }, 'Description must be less than 2000 characters (plain text)'),
  
  categoryId: z
    .string()
    .uuid('Please select a valid category'),
  
  minimumOrderQuantity: z
    .number()
    .int('Must be a whole number')
    .min(1, 'Minimum order quantity must be at least 1'),
  
  profileImage: z
    .instanceof(File)
    .optional(),
  
  images: z
    .array(z.instanceof(File))
    .optional(),
  
  descriptionImages: z
    .array(z.instanceof(File))
    .optional(),
});

// Update Product Schema
export const updateProductSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(255, 'Title must be less than 255 characters'),
  
  description: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val || val === '') return true;
      const textLength = getTextLength(val);
      return textLength <= 2000;
    }, 'Description must be less than 2000 characters (plain text)'),
  
  categoryId: z
    .string()
    .uuid('Please select a valid category'),
  
  minimumOrderQuantity: z
    .number()
    .int('Must be a whole number')
    .min(1, 'Minimum order quantity must be at least 1'),
});

// Form Types
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;


