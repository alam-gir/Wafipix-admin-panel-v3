/**
 * Product Category Select Field - Small, focused component
 */

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ProductCategorySelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  categories: Array<{ id: string; title: string }>;
  required?: boolean;
  error?: string;
  className?: string;
}

export const ProductCategorySelectField: React.FC<ProductCategorySelectFieldProps> = ({
  value,
  onChange,
  categories,
  required = false,
  error,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label>
        Category {required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn(error && 'border-red-500')}>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};


