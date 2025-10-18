/**
 * Product Description Field - Small, focused component
 */

import React from 'react';
import { RichTextEditorFormField } from '@/components/rich-text-editor';
import { cn } from '@/lib/utils';

interface ProductDescriptionFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  maxLength?: number;
  className?: string;
}

export const ProductDescriptionField: React.FC<ProductDescriptionFieldProps> = ({
  value,
  onChange,
  placeholder = 'Enter product description...',
  required = false,
  error,
  maxLength = 2000,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <RichTextEditorFormField
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        label="Description"
        required={required}
        maxLength={maxLength}
        error={error}
        showToolbar={true}
        editable={true}
      />
    </div>
  );
};


