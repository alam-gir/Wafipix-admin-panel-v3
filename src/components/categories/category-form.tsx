/**
 * Category Form Component
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { 
  createCategorySchema, 
  updateCategorySchema,
  CreateCategoryFormData,
  UpdateCategoryFormData 
} from '@/lib/schemas';
import { Category } from '@/lib/query/types';
import { useCategoryOptions, useCategoryParentOptions } from '@/lib/query';
import { RichTextEditorFormField } from '@/components/rich-text-editor';

interface CategoryFormProps {
  category?: Category;
  parentCategory?: Category | null;
  onSubmit: (data: CreateCategoryFormData | UpdateCategoryFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryForm({ 
  category, 
  parentCategory,
  onSubmit, 
  onCancel, 
  isLoading = false 
}: CategoryFormProps) {
  const isEdit = !!category;
  const schema = isEdit ? updateCategorySchema : createCategorySchema;
  
  // Fetch category options for parent selection
  // For edit mode, use the specific category's parent options
  // For create mode, use the general options endpoint
  const { data: createOptions = [], isLoading: createOptionsLoading } = useCategoryOptions();
  const { data: editOptions = [], isLoading: editOptionsLoading } = useCategoryParentOptions(
    category?.id || '', 
    !!category?.id // Only fetch for edit mode
  );
  
  const categoryOptions = isEdit ? editOptions : createOptions;
  const optionsLoading = isEdit ? editOptionsLoading : createOptionsLoading;

  const form = useForm<CreateCategoryFormData | UpdateCategoryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: category?.title || '',
      description: category?.description || '',
      image: undefined,
      ...(isEdit ? { 
        status: category?.status,
        parentId: category?.parentId || 'root'
      } : { 
        parentId: parentCategory?.id || 'root' // Use parent category ID if provided
      }),
    },
  });

  const handleSubmit = (data: CreateCategoryFormData | UpdateCategoryFormData) => {
    // Clean the data but preserve empty parentId for root categories
    const cleanedData = { ...data };
    
    // Remove undefined values but keep empty strings for parentId
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key as keyof typeof cleanedData] === undefined) {
        delete cleanedData[key as keyof typeof cleanedData];
      }
    });
    
    // Convert "root" value to undefined for API calls
    if ('parentId' in cleanedData && cleanedData.parentId === 'root') {
      cleanedData.parentId = undefined;
    }
    
    onSubmit(cleanedData as CreateCategoryFormData | UpdateCategoryFormData);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  const removeImage = () => {
    form.setValue('image', undefined);
    // Reset the file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const selectedImage = form.watch('image');

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEdit ? 'Edit Category' : 'Create New Category'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter category title" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextEditorFormField
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Enter category description (optional)"
                      label="Description"
                      maxLength={1000}
                      error={form.formState.errors.description?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Parent Category (only for create) */}
            {!isEdit && (
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select
                      value={field.value || 'root'}
                      onValueChange={field.onChange}
                      disabled={optionsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="root">Root Category (No Parent)</SelectItem>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Status (only for edit) */}
            {isEdit && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={field.value || 'ACTIVE'}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Parent Category (for edit mode) */}
            {isEdit && (
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select
                      value={field.value || 'root'}
                      onValueChange={field.onChange}
                      disabled={optionsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="root">Root Category (No Parent)</SelectItem>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Category Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Current Image Display */}
                      {category?.image && !selectedImage && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                          <Image 
                            src={category.image} 
                            alt={category.title}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {/* New Image Preview */}
                      {selectedImage && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                          <Image 
                            src={URL.createObjectURL(selectedImage)} 
                            alt="Preview"
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {/* Upload Button */}
                      <div className="flex items-center gap-4">
                        <label
                          htmlFor="image-upload"
                          className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <Upload className="h-4 w-4" />
                          <span className="text-sm">
                            {selectedImage ? 'Change Image' : 'Upload Image'}
                          </span>
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <span className="text-xs text-muted-foreground">
                          JPEG, PNG, WebP up to 5MB
                        </span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
