import React from 'react';
import { ClientOnlyRichTextEditor } from './client-only-rich-text-editor';
import { getTextLength } from '@/lib/utils/rich-text';
import { cn } from '@/lib/utils';

interface RichTextEditorFormFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  showToolbar?: boolean;
  editable?: boolean;
  label?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
}

export const RichTextEditorFormField: React.FC<RichTextEditorFormFieldProps> = ({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  className,
  showToolbar = true,
  editable = true,
  label,
  error,
  required = false,
  maxLength = 1000
}) => {
  const textLength = getTextLength(value);
  const isOverLimit = textLength > maxLength;

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <span className={cn(
            "text-xs",
            isOverLimit ? "text-red-500" : "text-gray-500"
          )}>
            {textLength}/{maxLength} characters
          </span>
        </div>
      )}
      
      <ClientOnlyRichTextEditor
        content={value}
        onChange={onChange}
        placeholder={placeholder}
        showToolbar={showToolbar}
        editable={editable}
      />
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {!label && (
        <div className="mt-2 flex justify-end">
          <span className={cn(
            "text-xs",
            isOverLimit ? "text-red-500" : "text-gray-500"
          )}>
            {textLength}/{maxLength} characters
          </span>
        </div>
      )}
    </div>
  );
};
