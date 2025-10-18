/**
 * Product Multiple Images Upload Field - Small, focused component
 */

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductMultipleImagesUploadFieldProps {
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
  required?: boolean;
  error?: string;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  className?: string;
}

export const ProductMultipleImagesUploadField: React.FC<ProductMultipleImagesUploadFieldProps> = ({
  label,
  files,
  onChange,
  required = false,
  error,
  accept = 'image/*',
  maxSize = 5, // 5MB default
  maxFiles = 10,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Check if adding these files would exceed maxFiles
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Check file sizes
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed ${maxSize}MB limit`);
      return;
    }

    onChange([...files, ...selectedFiles]);
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
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
          className="w-full h-24 border-dashed border-2 hover:border-gray-400"
          disabled={files.length >= maxFiles}
        >
          <div className="flex flex-col items-center gap-1">
            <Upload className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              Add {label.toLowerCase()}
            </span>
            <span className="text-xs text-gray-400">
              {files.length}/{maxFiles} files • Max {maxSize}MB each
            </span>
          </div>
        </Button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Files List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <ImageIcon className="h-6 w-6 text-gray-400" />
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
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};


