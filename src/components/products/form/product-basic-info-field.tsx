/**
 * Product Basic Info Form Field - Small, focused component
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ProductBasicInfoFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  maxLength?: number;
  className?: string;
}

export const ProductBasicInfoField: React.FC<ProductBasicInfoFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  maxLength,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={label.toLowerCase()}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={label.toLowerCase()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(error && 'border-red-500')}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {maxLength && (
        <p className="text-xs text-gray-500">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
};


