/**
 * Product View Page - Dedicated page for viewing product details
 */

'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { ArrowLeft, Edit, Trash2, ToggleLeft, ToggleRight, MoreVertical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProductOverview } from '@/components/products/pages/product-overview';
import { ProductImagesManagement } from '@/components/products/pages/product-images-management';
import { ProductVariantsManagement } from '@/components/products/pages/product-variants-management';
import { ProductSpecificationsManagement } from '@/components/products/pages/product-specifications-management';
import { useProduct } from '@/lib/query/hooks/product-queries';
import { useDeleteProduct, useUpdateProductStatus } from '@/lib/query/hooks/product-mutations';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface ProductViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductViewPage({ params }: ProductViewPageProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Unwrap params using React.use()
  const { id } = use(params);

  const { data: product, isLoading, error: fetchError } = useProduct(id);
  const deleteProductMutation = useDeleteProduct();
  const updateProductStatusMutation = useUpdateProductStatus();

  const handleEdit = () => {
    router.push(`/products/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!product) return;
    
    if (window.confirm(`Are you sure you want to delete "${product.title}"? This action cannot be undone.`)) {
      try {
        setError(null);
        await deleteProductMutation.mutateAsync(product.id);
        router.push('/products');
      } catch (error: unknown) {
        console.error('Failed to delete product:', error);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  const handleToggleStatus = async () => {
    if (!product) return;
    
    try {
      setError(null);
      await updateProductStatusMutation.mutateAsync({
        id: product.id,
        data: { status: isActive ? 'INACTIVE' : 'ACTIVE' }
      });
    } catch (error: unknown) {
      console.error('Failed to toggle product status:', error);
      setError('Failed to update product status. Please try again.');
    }
  };

  const handleBack = () => {
    router.push('/products');
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
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  // Calculate total stock from variants
  const totalStock = product.variants?.reduce((sum, variant) => sum + (variant.stockQuantity || 0), 0) || 0;
  const variantCount = product.variants?.length || 0;
  const isActive = product.status === 'ACTIVE';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="sm:hidden py-4 space-y-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-gray-900 truncate">{product.title}</h1>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleToggleStatus}
                    disabled={updateProductStatusMutation.isPending}
                  >
                    {isActive ? (
                      <>
                        <ToggleLeft className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <ToggleRight className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    disabled={deleteProductMutation.isPending}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Product
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between h-16">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Button>
              <div className="h-6 w-px bg-gray-300 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold text-gray-900 truncate">{product.title}</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-shrink-0">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={handleToggleStatus}
                    disabled={updateProductStatusMutation.isPending}
                  >
                    {isActive ? (
                      <>
                        <ToggleLeft className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <ToggleRight className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    disabled={deleteProductMutation.isPending}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Product
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <p className="text-sm">{error}</p>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ProductOverview product={product} />
          </TabsContent>

          <TabsContent value="images">
            <ProductImagesManagement product={product} />
          </TabsContent>

          <TabsContent value="variants">
            <ProductVariantsManagement product={product} />
          </TabsContent>

          <TabsContent value="specifications">
            <ProductSpecificationsManagement product={product} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
