'use client';

/**
 * Create category page
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { CategoryForm } from '@/components/category/category-form';
import { createCategory } from '@/lib/api/category/category-api';
import { CategoryFormData } from '@/lib/schemas/category';
import { handleApiError } from '@/lib/utils/form-error-handler';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await createCategory(data);
      
      if (response.success) {
        // Redirect to categories list
        router.push('/categories');
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      const { message } = handleApiError(err);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/categories')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Category</h1>
          <p className="text-gray-600">Add a new category to your store</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <CategoryForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
