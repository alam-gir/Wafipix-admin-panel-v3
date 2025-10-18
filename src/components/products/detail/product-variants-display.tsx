/**
 * Product Variants Display - Small, focused component
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Plus, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductVariant } from '@/lib/api/types/product';

interface ProductVariantsDisplayProps {
  variants: ProductVariant[];
  onAddVariant: () => void;
  onEditVariant: (variant: ProductVariant) => void;
  className?: string;
}

export const ProductVariantsDisplay: React.FC<ProductVariantsDisplayProps> = ({
  variants,
  onAddVariant,
  onEditVariant,
  className,
}) => {
  if (variants.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Variants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500 mb-4">No variants created yet</p>
            <Button onClick={onAddVariant} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create First Variant
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Variants ({variants.length})
          </CardTitle>
          <Button onClick={onAddVariant} size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Variant
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {variants.map((variant) => (
            <div key={variant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{variant.sku}</span>
                  <Badge variant={variant.isActive ? 'default' : 'secondary'} className="text-xs">
                    {variant.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {variant.isTracked && (
                    <Badge variant="outline" className="text-xs">Tracked</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Price: ${variant.price}</span>
                  {variant.compareAtPrice && (
                    <span>Compare: ${variant.compareAtPrice}</span>
                  )}
                  <span>Stock: {variant.stockQuantity}</span>
                  {variant.attributeValues.length > 0 && (
                    <span>
                      {variant.attributeValues.map(av => av.value).join(', ')}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditVariant(variant)}
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


