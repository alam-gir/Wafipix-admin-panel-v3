/**
 * Variant Attribute Form Field - Small, focused component
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VariantAttributeFormFieldProps {
  name: string;
  attributeType: 'TEXT' | 'IMAGE' | 'NUMBER';
  onNameChange: (name: string) => void;
  onTypeChange: (type: 'TEXT' | 'IMAGE' | 'NUMBER') => void;
  onDelete: () => void;
  error?: string;
  className?: string;
}

export const VariantAttributeFormField: React.FC<VariantAttributeFormFieldProps> = ({
  name,
  attributeType,
  onNameChange,
  onTypeChange,
  onDelete,
  error,
  className,
}) => {
  return (
    <div className={cn('flex items-end gap-3 p-3 bg-gray-50 rounded-lg', className)}>
      <div className="flex-1 space-y-2">
        <Label className="text-sm font-medium">Attribute Name</Label>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g., Color, Size, Material"
          className={cn(error && 'border-red-500')}
        />
      </div>
      
      <div className="flex-1 space-y-2">
        <Label className="text-sm font-medium">Type</Label>
        <Select value={attributeType} onValueChange={(value: 'TEXT' | 'IMAGE' | 'NUMBER') => onTypeChange(value)}>
          <SelectTrigger className={cn(error && 'border-red-500')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TEXT">Text</SelectItem>
            <SelectItem value="IMAGE">Image</SelectItem>
            <SelectItem value="NUMBER">Number</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
  );
};


