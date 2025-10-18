/**
 * Product Edit Page - Dedicated page for editing products
 */

'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { ArrowLeft, Eye } from 'lucide-react';
import { ProductForm } from '@/components/products/form/product-form';
import { useProduct } from '@/lib/query/hooks/product-queries';
import { useUpdateProduct } from '@/lib/query/hooks/product-mutations';
import { useCategoryOptions } from '@/lib/query';
import type { UpdateProductFormData } from '@/lib/schemas';

interface ProductEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductEditPage({ params }: ProductEditPageProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  // Unwrap params using React.use()
  const { id } = use(params);
  
  const { data: product, isLoading, error: fetchError } = useProduct(id);
  const { data: categories = [] } = useCategoryOptions();
  const updateProductMutation = useUpdateProduct();

  const handleSubmit = async (data: UpdateProductFormData) => {
    try {
      setError(null);
      await updateProductMutation.mutateAsync({ id, data });
      router.push(`/products/${id}`);
    } catch (error: unknown) {
      console.error('Failed to update product:', error);
      
      // Handle different types of errors
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          setError(apiError.response.data.message);
        } else {
          setError('Failed to update product. Please try again.');
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const messageError = error as { message: string };
        setError(messageError.message);
      } else if (error && typeof error === 'object' && 'code' in error) {
        const codeError = error as { code: string };
        if (codeError.code === 'TIMEOUT') {
          setError('Request timed out. Please try again with fewer images or check your connection.');
        } else {
          setError('Failed to update product. Please try again.');
        }
      } else {
        setError('Failed to update product. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    router.push(`/products/${id}`);
  };

  const handleView = () => {
    router.push(`/products/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => router.push('/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Layout */}
            <div className="flex items-center gap-4 sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-lg font-semibold text-gray-900">
                Edit Product
              </h1>
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Product
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Edit Product</h1>
            </div>
            
            {/* View Button - Always visible */}
            <Button
              variant="outline"
              onClick={handleView}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">View</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <p className="text-sm">{error}</p>
            </Alert>
          )}

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <ProductForm
                mode="edit"
                onSubmit={handleSubmit}
                isLoading={updateProductMutation.isPending}
                categories={categories}
                initialData={{
                  title: product.title,
                  description: product.description,
                  categoryId: product.category.id,
                  minimumOrderQuantity: product.minimumOrderQuantity,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
