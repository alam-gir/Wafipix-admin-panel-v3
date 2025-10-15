import React from 'react';
import { RichTextEditorWrapper } from './rich-text-editor-wrapper';

interface RichTextEditorFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  showToolbar?: boolean;
  editable?: boolean;
  label?: string;
  error?: string;
  required?: boolean;
}

export const RichTextEditorField: React.FC<RichTextEditorFieldProps> = ({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  className,
  showToolbar = true,
  editable = true,
  label,
  error,
  required = false
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <RichTextEditorWrapper
        content={value}
        onChange={onChange}
        placeholder={placeholder}
        showToolbar={showToolbar}
        editable={editable}
      />
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
