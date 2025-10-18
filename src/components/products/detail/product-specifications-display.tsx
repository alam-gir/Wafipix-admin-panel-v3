/**
 * Product Specifications Display - Small, focused component
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { List, Plus, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductSpecification } from '@/lib/api/types/product';

interface ProductSpecificationsDisplayProps {
  specifications: ProductSpecification[];
  onAddSpecification: () => void;
  onEditSpecification: (spec: ProductSpecification) => void;
  className?: string;
}

export const ProductSpecificationsDisplay: React.FC<ProductSpecificationsDisplayProps> = ({
  specifications,
  onAddSpecification,
  onEditSpecification,
  className,
}) => {
  if (specifications.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <List className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500 mb-4">No specifications added yet</p>
            <Button onClick={onAddSpecification} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Specification
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
            <List className="h-5 w-5" />
            Specifications ({specifications.length})
          </CardTitle>
          <Button onClick={onAddSpecification} size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {specifications.map((spec) => (
            <div key={spec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{spec.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {spec.value}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditSpecification(spec)}
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


