/**
 * Product Images Display - Small, focused component
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/api/types/product';

interface ProductImagesDisplayProps {
  product: Product;
  className?: string;
}

export const ProductImagesDisplay: React.FC<ProductImagesDisplayProps> = ({
  product,
  className,
}) => {
  const allImages = [
    ...(product.profileImage ? [{ url: product.profileImage, type: 'Profile' }] : []),
    ...(product.images || []).map(url => ({ url, type: 'Product' })),
    ...(product.descriptionImages || []).map(url => ({ url, type: 'Description' })),
  ];

  if (allImages.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No images uploaded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Images ({allImages.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={`${image.type} image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Badge 
                variant="secondary" 
                className="absolute top-2 left-2 text-xs"
              >
                {image.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


