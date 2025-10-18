/**
 * Product Card Component - Small, focused component
 */

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Eye, Edit, Trash2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { ProductSummary } from '@/lib/api/types/product';

interface ProductCardProps {
  product: ProductSummary;
  onView: (product: ProductSummary) => void;
  onEdit: (product: ProductSummary) => void;
  onDelete: (product: ProductSummary) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
}) => {
  const isActive = product.status === 'ACTIVE';
  const isLowStock = product.totalStock > 0 && product.totalStock < 10;
  const hasVariants = product.variantCount > 0;

  const getStatusIcon = () => {
    if (!isActive) return <XCircle className="h-4 w-4 text-red-500" />;
    if (isLowStock) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!isActive) return 'Inactive';
    if (isLowStock) return 'Low Stock';
    return 'Active';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative w-full h-48 rounded-t-lg overflow-hidden bg-gray-100">
          {product.profileImage ? (
            <Image
              src={product.profileImage}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge 
              variant={isActive ? (isLowStock ? "destructive" : "default") : "secondary"}
              className="text-xs"
            >
              {getStatusIcon()}
              <span className="ml-1">{getStatusText()}</span>
            </Badge>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-1">{product.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{product.category.title}</p>
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-500">
                <strong className="text-gray-900">{product.totalStock}</strong> in stock
              </span>
              {hasVariants && (
                <span className="text-gray-500">
                  <strong className="text-gray-900">{product.variantCount}</strong> variants
                </span>
              )}
            </div>
            <span className="text-gray-500">MOQ: {product.minimumOrderQuantity}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(product)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(product)}
              className="px-3"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(product)}
              className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


