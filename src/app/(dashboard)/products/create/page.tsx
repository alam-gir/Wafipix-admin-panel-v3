/**
 * Product Create Page - Dedicated page for creating products
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { ArrowLeft, Save } from 'lucide-react';
import { ProductForm } from '@/components/products/form/product-form';
import { useCreateProduct } from '@/lib/query/hooks/product-mutations';
import { useCategoryOptions } from '@/lib/query';
import type { CreateProductFormData } from '@/lib/schemas';

export default function CreateProductPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const { data: categories = [] } = useCategoryOptions();
  const createProductMutation = useCreateProduct();

  const handleSubmit = async (data: CreateProductFormData) => {
    try {
      setError(null);
      await createProductMutation.mutateAsync(data);
      router.push('/products');
    } catch (error: unknown) {
      console.error('Failed to create product:', error);
      
      // Handle different types of errors
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          setError(apiError.response.data.message);
        } else {
          setError('Failed to create product. Please try again.');
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const messageError = error as { message: string };
        setError(messageError.message);
      } else if (error && typeof error === 'object' && 'code' in error) {
        const codeError = error as { code: string };
        if (codeError.code === 'TIMEOUT') {
          setError('Request timed out. Please try again with fewer images or check your connection.');
        } else {
          setError('Failed to create product. Please try again.');
        }
      } else {
        setError('Failed to create product. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    router.push('/products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Create New Product</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={createProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Trigger form submission
                  const form = document.querySelector('form');
                  if (form) {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    form.dispatchEvent(submitEvent);
                  }
                }}
                disabled={createProductMutation.isPending}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
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
                mode="create"
                onSubmit={handleSubmit}
                isLoading={createProductMutation.isPending}
                categories={categories}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


