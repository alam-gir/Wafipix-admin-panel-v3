'use client';

/**
 * Category view/edit page with breadcrumbs
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2, 
  Image as ImageIcon,
  Calendar,
  Clock,
  Filter
} from 'lucide-react';
import { CategoryForm } from '@/components/category/category-form';
import { 
  getCategory, 
  updateCategory, 
  deleteCategory, 
  updateCategoryStatus 
} from '@/lib/api/category/category-api';
import { Category, CategoryStatus } from '@/lib/api/types/category';
import { handleApiError } from '@/lib/utils/form-error-handler';

export default function CategoryViewPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load category data
  const loadCategory = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await getCategory(categoryId);
      
      if (response.success) {
        setCategory(response.data);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      const { message } = handleApiError(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      loadCategory();
    }
  }, [categoryId]);

  const handleUpdate = async (data: any) => {
    if (!category) return;

    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await updateCategory(categoryId, data);
      
      if (response.success) {
        setIsEditing(false);
        loadCategory(); // Reload the data
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

  const handleDelete = async () => {
    if (!category) return;
    
    if (!confirm(`Are you sure you want to delete "${category.title}"?`)) {
      return;
    }

    try {
      const response = await deleteCategory(categoryId);
      if (response.success) {
        router.push('/categories');
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      const { message } = handleApiError(err);
      setError(message);
    }
  };

  const handleStatusChange = async (newStatus: CategoryStatus) => {
    if (!category) return;

    try {
      const response = await updateCategoryStatus(categoryId, { value: newStatus });
      if (response.success) {
        loadCategory(); // Reload the data
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      const { message } = handleApiError(err);
      setError(message);
    }
  };

  const getStatusColor = (status: CategoryStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading category...</span>
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/categories')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Category not found</h3>
        <p className="text-gray-600 mb-4">The category you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/categories')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm">
        <Link href="/categories" className="text-gray-500 hover:text-gray-700">
          Categories
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">{category.title}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="text-2xl font-bold text-gray-900">{category.title}</h1>
            <p className="text-gray-600">Category details and management</p>
          </div>
        </div>
        
        {!isEditing && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Content */}
      {isEditing ? (
        <CategoryForm
          mode="update"
          initialData={category}
          onSubmit={handleUpdate}
          isLoading={isSubmitting}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Category details and description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-gray-600 mt-1">
                    {category.description || 'No description provided'}
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(category.status)}>
                    {category.status}
                  </Badge>
                  
                  {category.status === 'ACTIVE' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange('INACTIVE')}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange('ACTIVE')}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Activate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle>Timestamps</CardTitle>
                <CardDescription>Creation and modification dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">{formatDate(category.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-600">{formatDate(category.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Image */}
            <Card>
              <CardHeader>
                <CardTitle>Category Image</CardTitle>
              </CardHeader>
              <CardContent>
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Category
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/categories')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to List
                </Button>
                
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Category
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
