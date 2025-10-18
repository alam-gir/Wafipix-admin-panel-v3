/**
 * Product Form - Combines small form components
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';

// Form Components
import { ProductBasicInfoField } from './product-basic-info-field';
import { ProductCategorySelectField } from './product-category-select-field';
import { ProductNumberField } from './product-number-field';
import { ProductDescriptionField } from './product-description-field';

// Schemas and Types
import { createProductSchema, updateProductSchema, type CreateProductFormData, type UpdateProductFormData } from '@/lib/schemas/product';

interface ProductFormProps {
  mode: 'create' | 'edit';
  onSubmit: (data: CreateProductFormData | UpdateProductFormData) => void;
  isLoading?: boolean;
  categories: Array<{ id: string; title: string }>;
  initialData?: Partial<UpdateProductFormData>;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  onSubmit,
  isLoading = false,
  categories,
  initialData,
}) => {
  
  const schema = mode === 'create' ? createProductSchema : updateProductSchema;
  
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProductFormData | UpdateProductFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      categoryId: initialData?.categoryId || '',
      minimumOrderQuantity: initialData?.minimumOrderQuantity || 1,
    },
  });

  const watchedValues = watch();

  const handleFormSubmit = (data: CreateProductFormData | UpdateProductFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductBasicInfoField
            label="Title"
            value={watchedValues.title || ''}
            onChange={(value) => setValue('title', value)}
            placeholder="Enter product title"
            required
            error={errors.title?.message}
            maxLength={255}
          />

          <ProductCategorySelectField
            value={watchedValues.categoryId || ''}
            onChange={(value) => setValue('categoryId', value)}
            categories={categories}
            required
            error={errors.categoryId?.message}
          />

          <ProductNumberField
            label="Minimum Order Quantity"
            value={watchedValues.minimumOrderQuantity || 1}
            onChange={(value) => setValue('minimumOrderQuantity', value || 1)}
            placeholder="Enter minimum order quantity"
            min={1}
            required
            error={errors.minimumOrderQuantity?.message}
          />
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductDescriptionField
            value={watchedValues.description}
            onChange={(value) => setValue('description', value)}
            placeholder="Enter product description..."
            maxLength={2000}
            error={errors.description?.message}
          />
        </CardContent>
      </Card>


        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[140px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {mode === 'create' ? 'Create Product' : 'Update Product'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};


