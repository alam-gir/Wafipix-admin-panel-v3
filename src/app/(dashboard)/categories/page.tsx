'use client';

/**
 * Categories list page with filtering and pagination
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PaginationComponent } from '@/components/ui/pagination-component';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Loader2,
  Image as ImageIcon,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  getCategories, 
  deleteCategory, 
  updateCategoryStatus 
} from '@/lib/api/category/category-api';
import { Category, CategoryStatus, CategoryListParams } from '@/lib/api/types/category';
import { Pagination as PaginationType } from '@/lib/api/types/common';
import { handleApiError } from '@/lib/utils/form-error-handler';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CategoryStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // Load categories
  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const params: CategoryListParams = {
        page,
        size,
        search: search || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      };
      
      console.log('Loading categories with params:', params);
      
      const response = await getCategories(params);
      
      if (response.success) {
        setCategories(response.data);
        setPagination(response.pagination || null);
        console.log('Categories loaded:', response.data.length, 'Pagination:', response.pagination);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      const { message } = handleApiError(err);
      setError(message);
      console.error('Error loading categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load categories when filters change
  useEffect(() => {
    loadCategories();
  }, [page, size, statusFilter]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0); // Reset to first page when searching
      loadCategories();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (categoryId: string, categoryTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryTitle}"?`)) {
      return;
    }

    try {
      const response = await deleteCategory(categoryId);
      if (response.success) {
        loadCategories(); // Reload the list
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      const { message } = handleApiError(err);
      setError(message);
    }
  };

  const handleStatusChange = async (categoryId: string, newStatus: CategoryStatus) => {
    try {
      const response = await updateCategoryStatus(categoryId, { value: newStatus });
      if (response.success) {
        loadCategories(); // Reload the list
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
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>
        <Button onClick={() => router.push('/categories/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Category
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as CategoryStatus | 'ALL')}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories List</CardTitle>
          <CardDescription>
            {pagination ? `${pagination.totalElements} categories found` : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600 mb-4">
                {search || statusFilter !== 'ALL' 
                  ? 'Try adjusting your filters to see more results.' 
                  : 'Get started by creating your first category.'
                }
              </p>
              {!search && statusFilter === 'ALL' && (
                <Button onClick={() => router.push('/categories/create')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Category
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Image */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {category.description || 'No description'}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge className={getStatusColor(category.status)}>
                          {category.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Created {formatDate(category.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/categories/${category.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/categories/${category.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        
                        {category.status === 'ACTIVE' ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(category.id, 'INACTIVE')}>
                            <Filter className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusChange(category.id, 'ACTIVE')}>
                            <Filter className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(category.id, category.title)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <PaginationComponent
          pagination={pagination}
          onPageChange={setPage}
          onSizeChange={setSize}
          pageSizeOptions={[10, 20, 50, 100]}
        />
      )}
    </div>
  );
}
