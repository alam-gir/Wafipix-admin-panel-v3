/**
 * Products Page - Main page component
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Package, TrendingUp, AlertTriangle, Filter, Download, Upload } from 'lucide-react';
import { ProductsList } from '@/components/products/products-list';
import { useProducts } from '@/lib/query/hooks/product-queries';
import { useCategoryOptions } from '@/lib/query';
import { useDeleteProduct } from '@/lib/query/hooks/product-mutations';
import type { ProductSummary } from '@/lib/api/types/product';
import type { Pagination } from '@/lib/api/types/common';

export default function ProductsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: '',
    categoryId: null as string | null,
    sortBy: 'title',
    sortDir: 'asc' as 'asc' | 'desc',
    page: 0,
    size: 12,
  });

  const { data, isLoading, error, refetch } = useProducts({
    ...filters,
    categoryId: filters.categoryId || undefined
  });
  const { data: categories = [] } = useCategoryOptions();
  const deleteProductMutation = useDeleteProduct();

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleViewProduct = (product: ProductSummary) => {
    router.push(`/products/${product.id}`);
  };

  const handleEditProduct = (product: ProductSummary) => {
    router.push(`/products/${product.id}/edit`);
  };

  const handleDeleteProduct = async (product: ProductSummary) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"? This action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        await deleteProductMutation.mutateAsync(product.id);
        console.log('Product deleted successfully');
        refetch();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleCreateProduct = () => {
    router.push('/products/create');
  };

  // Calculate stats from current data
  const stats: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    productsWithVariants: number;
  } | null = data ? {
    totalProducts: Number(data.pagination.totalElements) || 0,
    activeProducts: data.products.filter(p => p.totalStock > 0).length,
    lowStockProducts: data.products.filter(p => p.totalStock > 0 && p.totalStock < 10).length,
    productsWithVariants: data.products.filter(p => p.variantCount > 0).length,
  } : null;

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Products</h3>
            <p className="text-gray-600 mb-4">There was an error loading your products. Please try again.</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={handleCreateProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Create Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.activeProducts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.lowStockProducts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Filter className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">With Variants</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.productsWithVariants || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products List */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : data ? (
        <ProductsList
          products={data.products}
          pagination={data.pagination as unknown as Pagination}
          filters={{
            ...filters,
            categoryId: filters.categoryId || ''
          }}
          categories={categories}
          onFiltersChange={handleFiltersChange}
          onPageChange={handlePageChange}
          onViewProduct={handleViewProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      ) : null}
    </div>
  );
}
