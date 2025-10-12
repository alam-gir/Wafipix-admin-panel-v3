'use client';

/**
 * Unified category form for create and update
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { categorySchema, type CategoryFormData, type CategoryStatus } from '@/lib/schemas/category';
import { handleApiError, hasFieldErrors, hasGeneralErrors, getFieldError } from '@/lib/utils/form-error-handler';
import { Category } from '@/lib/api/types/category';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface CategoryFormProps {
  mode: 'create' | 'update';
  initialData?: Category;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isLoading?: boolean;
}

export function CategoryForm({ mode, initialData, onSubmit, isLoading = false }: CategoryFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'ACTIVE',
    },
  });

  const watchedStatus = watch('status');

  // Set image preview when initial data changes
  useEffect(() => {
    if (initialData?.image) {
      setImagePreview(initialData.image);
    }
  }, [initialData]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onFormSubmit = async (data: CategoryFormData) => {
    try {
      setError('');
      setFieldErrors([]);

      const formData: CategoryFormData = {
        ...data,
        image: imageFile || undefined,
      };

      await onSubmit(formData);
    } catch (err: any) {
      const { message, fieldErrors } = handleApiError(err);
      
      if (hasFieldErrors(fieldErrors)) {
        setError('Please fix the errors below');
      } else if (hasGeneralErrors(fieldErrors)) {
        setError(message);
      } else {
        setError(message);
      }
      
      setFieldErrors(fieldErrors);
    }
  };

  const getStatusColor = (status: CategoryStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'INACTIVE':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'SUSPENDED':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {mode === 'create' ? 'Create New Category' : 'Update Category'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'Fill in the details to create a new category' 
            : 'Update the category information below'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter category title"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
            {getFieldError(fieldErrors, 'title') && (
              <p className="text-sm text-red-600">{getFieldError(fieldErrors, 'title')}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter category description (optional)"
              rows={4}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
            {getFieldError(fieldErrors, 'description') && (
              <p className="text-sm text-red-600">{getFieldError(fieldErrors, 'description')}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={watchedStatus}
              onChange={(e) => setValue('status', e.target.value as CategoryStatus)}
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message}</p>
            )}
            {getFieldError(fieldErrors, 'status') && (
              <p className="text-sm text-red-600">{getFieldError(fieldErrors, 'status')}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Category Image</Label>
            <div className="space-y-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={removeImage}
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <Label
                  htmlFor="image"
                  className="flex items-center space-x-2 cursor-pointer border border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </span>
                </Label>
              </div>
            </div>
            {errors.image && (
              <p className="text-sm text-red-600">{errors.image.message}</p>
            )}
            {getFieldError(fieldErrors, 'image') && (
              <p className="text-sm text-red-600">{getFieldError(fieldErrors, 'image')}</p>
            )}
          </div>

          {/* Field Errors */}
          {fieldErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {fieldErrors
                    .filter(err => err.field !== null)
                    .map((fieldError, index) => (
                      <li key={index}>
                        <strong>{fieldError.field}:</strong> {fieldError.message}
                      </li>
                    ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* General Error */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                mode === 'create' ? 'Create Category' : 'Update Category'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
