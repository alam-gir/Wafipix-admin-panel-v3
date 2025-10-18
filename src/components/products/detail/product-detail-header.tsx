/**
 * Product Detail Header - Small, focused component
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/api/types/product';

interface ProductDetailHeaderProps {
  product: Product;
  mode: 'view' | 'edit';
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  className?: string;
}

export const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
  product,
  mode,
  onEdit,
  onDelete,
  onToggleStatus,
  className,
}) => {
  return (
    <div className={cn('flex items-start justify-between', className)}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-gray-900 truncate">
            {product.title}
          </h2>
          <Badge variant={product.isActive ? 'default' : 'secondary'}>
            {product.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>ID: {product.id.slice(0, 8)}...</span>
          <span>Category: {product.category.title}</span>
          <span>Variants: {product.variants.length}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleStatus}
          className="flex items-center gap-1"
        >
          {product.isActive ? (
            <>
              <EyeOff className="h-4 w-4" />
              Deactivate
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Activate
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex items-center gap-1"
        >
          <Edit className="h-4 w-4" />
          {mode === 'view' ? 'Edit' : 'View'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="flex items-center gap-1 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};


