/**
 * AttributeValueCard Component - Individual value card for editing and displaying
 */

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, ImageIcon } from 'lucide-react';

interface AttributeValueCardProps {
  value: {
    id: string;
    value: string;
    imageUrl?: string;
  };
  attributeType: 'TEXT' | 'IMAGE' | 'NUMBER';
  isEditing: boolean;
  editingData?: {
    value: string;
    imageUrl?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: () => void;
  onCancel: () => void;
  onValueChange: (value: string) => void;
  onImageChange: (file: File) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  index: number;
}

export const AttributeValueCard: React.FC<AttributeValueCardProps> = ({
  value,
  attributeType,
  isEditing,
  editingData,
  onEdit,
  onDelete,
  onUpdate,
  onCancel,
  onValueChange,
  onImageChange,
  isUpdating,
  isDeleting,
  index,
}) => {
  if (isEditing && editingData) {
    return (
      <div className="group flex items-center justify-between p-3 border border-blue-300 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-3 flex-1">
          {attributeType === 'IMAGE' && (
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {value.imageUrl ? (
                <Image 
                  src={value.imageUrl} 
                  alt="Current" 
                  width={48} 
                  height={48} 
                  className="w-full h-full object-cover" 
                  quality={90}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="h-5 w-5" />
                </div>
              )}
            </div>
          )}
          
          <div className="flex-1 space-y-2">
            <Input
              value={editingData.value}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder="Enter value"
              className="text-sm"
            />
            {attributeType === 'IMAGE' && (
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onImageChange(file);
                    }
                  }}
                  className="hidden"
                  id={`edit-image-${value.id}`}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => document.getElementById(`edit-image-${value.id}`)?.click()}
                  className="flex items-center gap-1 text-xs"
                >
                  <ImageIcon className="h-3 w-3" />
                  Change Image
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onUpdate}
            disabled={isUpdating || !editingData.value.trim()}
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-3">
        {attributeType === 'IMAGE' ? (
          <>
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image 
                src={value.imageUrl!} 
                alt={value.value} 
                width={48} 
                height={48} 
                className="w-full h-full object-cover" 
                quality={90}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 truncate">
              {value.value}
            </span>
          </>
        ) : (
          <>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-gray-600">
                {index + 1}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {value.value}
            </span>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          onClick={onEdit}
          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
          title="Edit Value"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          disabled={isDeleting}
          title="Delete Value"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
