/**
 * Variant Attribute Value Form Field - Small, focused component
 */

import React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Image as ImageIcon, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VariantAttributeValueFormFieldProps {
  value: string;
  imageUrl?: string;
  previewUrl?: string;
  onValueChange: (value: string) => void;
  onImageChange: (file: File | null) => void;
  onDelete: () => void;
  onSave?: () => void;
  attributeType: 'TEXT' | 'IMAGE' | 'NUMBER';
  error?: string;
  className?: string;
  isSaving?: boolean;
}

export const VariantAttributeValueFormField: React.FC<VariantAttributeValueFormFieldProps> = ({
  value,
  imageUrl,
  previewUrl,
  onValueChange,
  onImageChange,
  onDelete,
  onSave,
  attributeType,
  error,
  className,
  isSaving = false,
}) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onImageChange(file || null);
  };

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors', className)}>
      {attributeType === 'IMAGE' ? (
        // Image attribute - show as card with preview
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Image Preview */}
            <div className="flex-shrink-0">
              {(previewUrl || imageUrl) ? (
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden relative">
                  <Image 
                    src={(previewUrl || imageUrl)!} 
                    alt="Preview" 
                    fill
                    className="object-cover" 
                    quality={90}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Value</Label>
                <Input
                  value={value}
                  onChange={(e) => onValueChange(e.target.value)}
                  placeholder="Enter value"
                  className={cn('mt-1', error && 'border-red-500')}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Image</Label>
                <div className="mt-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id={`image-${value}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById(`image-${value}`)?.click()}
                    className="flex items-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    {(previewUrl || imageUrl) ? 'Change Image' : 'Upload Image'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {onSave && (
                <Button
                  type="button"
                  size="sm"
                  onClick={onSave}
                  disabled={isSaving || !value.trim()}
                  className="flex items-center gap-1"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Text/Number attribute - show as simple row
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3 flex-1">
            <div>
              <Label className="text-sm font-medium text-gray-700">Value</Label>
              <Input
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder={`Enter ${attributeType.toLowerCase()} value`}
                type={attributeType === 'NUMBER' ? 'number' : 'text'}
                className={cn('mt-1', error && 'border-red-500')}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {onSave && (
              <Button
                type="button"
                size="sm"
                onClick={onSave}
                disabled={isSaving || !value.trim()}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};


