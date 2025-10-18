/**
 * Product Overview Component - Dedicated component for product overview
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RichTextEditorFormField } from '@/components/rich-text-editor';
import { formatDistanceToNow } from 'date-fns';
import type { Product } from '@/lib/api/types/product';

interface ProductOverviewProps {
  product: Product;
}

export const ProductOverview: React.FC<ProductOverviewProps> = ({ product }) => {
  // Calculate total stock from variants
  const totalStock = product.variants?.reduce((sum, variant) => sum + (variant.stockQuantity || 0), 0) || 0;
  const variantCount = product.variants?.length || 0;
  const isActive = product.status === 'ACTIVE';

  return (
    <div className="space-y-6">
      {/* Product Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Product ID</label>
              <p className="text-sm">{product.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Category</label>
              <p className="text-sm">{product.category.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge variant={isActive ? 'default' : 'secondary'} className={
                  isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'
                }>
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Total Stock</label>
              <p className="text-sm">{totalStock}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Variants</label>
              <p className="text-sm">{variantCount}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Minimum Order</label>
              <p className="text-sm">{product.minimumOrderQuantity || 'Not set'}</p>
            </div>
          </div>
          
          {product.createdAt && (
            <div>
              <label className="text-sm font-medium text-gray-500">Created</label>
              <p className="text-sm">{formatDistanceToNow(new Date(product.createdAt))} ago</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          {product.description ? (
            <RichTextEditorFormField
              value={product.description}
              editable={false}
              showToolbar={false}
            />
          ) : (
            <p className="text-gray-500 italic">No description provided</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
