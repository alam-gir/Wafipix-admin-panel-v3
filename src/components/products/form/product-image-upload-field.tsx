/**
 * Product Image Upload Field - Small, focused component
 */

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageUploadFieldProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  error?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export const ProductImageUploadField: React.FC<ProductImageUploadFieldProps> = ({
  label,
  file,
  onChange,
  required = false,
  error,
  accept = 'image/*',
  maxSize = 5, // 5MB default
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size
      if (selectedFile.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`);
        return;
      }
      onChange(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="space-y-3">
        {/* Upload Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="w-full h-32 border-dashed border-2 hover:border-gray-400"
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-6 w-6 text-gray-400" />
            <span className="text-sm text-gray-600">
              Click to upload {label.toLowerCase()}
            </span>
            <span className="text-xs text-gray-400">
              Max {maxSize}MB
            </span>
          </div>
        </Button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* File Preview */}
        {file && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};


