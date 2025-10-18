/**
 * Product Number Field - Small, focused component
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ProductNumberFieldProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  min?: number;
  max?: number;
  className?: string;
}

export const ProductNumberField: React.FC<ProductNumberFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  min,
  max,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange(undefined);
    } else {
      const numValue = parseInt(inputValue, 10);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={label.toLowerCase().replace(/\s+/g, '-')}
        type="number"
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className={cn(error && 'border-red-500')}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};


