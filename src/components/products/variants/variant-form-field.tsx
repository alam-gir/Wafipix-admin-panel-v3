/**
 * Variant Form Field - Small, focused component for individual variant editing
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Save, X, Plus, Image as ImageIcon, Type, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useProductAttributes, useProductAttributeValues } from '@/lib/query/hooks/product-queries';

interface VariantFormFieldProps {
  productId: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  weight?: number;
  dimensions?: string;
  barcode?: string;
  isActive: boolean;
  isTracked: boolean;
  variantAttributeValues?: Array<{
    attributeId: string;
    attributeName: string;
    valueId: string;
    value: string;
    imageUrl?: string;
  }>;
  onSkuChange: (sku: string) => void;
  onPriceChange: (price: number) => void;
  onCompareAtPriceChange: (price: number | undefined) => void;
  onCostPriceChange: (price: number | undefined) => void;
  onStockChange: (stock: number) => void;
  onLowStockThresholdChange: (threshold: number | undefined) => void;
  onWeightChange: (weight: number | undefined) => void;
  onDimensionsChange: (dimensions: string | undefined) => void;
  onBarcodeChange: (barcode: string | undefined) => void;
  onActiveChange: (active: boolean) => void;
  onTrackedChange: (tracked: boolean) => void;
  onAttributeValuesChange?: (values: Array<{
    attributeId: string;
    attributeName: string;
    valueId: string;
    value: string;
    imageUrl?: string;
  }>) => void;
  onSave: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
  isSaving?: boolean;
  isDeleting?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const VariantFormField: React.FC<VariantFormFieldProps> = ({
  productId,
  sku,
  price,
  compareAtPrice,
  costPrice,
  stockQuantity,
  lowStockThreshold,
  weight,
  dimensions,
  barcode,
  isActive,
  isTracked,
  variantAttributeValues,
  onSkuChange,
  onPriceChange,
  onCompareAtPriceChange,
  onCostPriceChange,
  onStockChange,
  onLowStockThresholdChange,
  onWeightChange,
  onDimensionsChange,
  onBarcodeChange,
  onActiveChange,
  onTrackedChange,
  onAttributeValuesChange,
  onSave,
  onDelete,
  onEdit,
  onCancel,
  isEditing = false,
  isSaving = false,
  isDeleting = false,
  isLoading = false,
  className,
}) => {
  const [selectedAttributeId, setSelectedAttributeId] = useState<string>('');
  const [selectedValueId, setSelectedValueId] = useState<string>('');

  // Fetch all product attributes
  const { data: attributes = [] } = useProductAttributes(productId);
  
  // Fetch attribute values for the selected attribute
  const { data: attributeValues = [] } = useProductAttributeValues(
    productId, 
    selectedAttributeId, 
    { size: 100 } // Get all values
  );

  // Get available attributes (not already assigned to this variant)
  const availableAttributes = attributes.filter(attr => 
    !variantAttributeValues?.some(vav => vav.attributeId === attr.id)
  );

  // Get available values for the selected attribute (not already assigned)
  const availableValues = attributeValues.filter(val => 
    !variantAttributeValues?.some(vav => vav.valueId === val.id)
  );

  const handleAddAttribute = () => {
    if (!selectedAttributeId || !selectedValueId) return;

    const selectedAttribute = attributes.find(attr => attr.id === selectedAttributeId);
    const selectedValue = attributeValues.find(val => val.id === selectedValueId);

    if (selectedAttribute && selectedValue) {
      const newAttributeValue = {
        attributeId: selectedAttribute.id,
        attributeName: selectedAttribute.name,
        valueId: selectedValue.id,
        value: selectedValue.value,
        imageUrl: selectedValue.imageUrl,
      };

      onAttributeValuesChange?.([...(variantAttributeValues || []), newAttributeValue]);
      
      // Reset selections
      setSelectedAttributeId('');
      setSelectedValueId('');
    }
  };

  const getAttributeTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return <ImageIcon className="h-3 w-3" />;
      case 'TEXT':
        return <Type className="h-3 w-3" />;
      case 'NUMBER':
        return <Hash className="h-3 w-3" />;
      default:
        return <Type className="h-3 w-3" />;
    }
  };

  return (
    <div className={cn('p-4 border rounded-lg space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium text-lg">{sku || 'New Variant'}</span>
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? 'default' : 'secondary'} className="text-xs">
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
            {isTracked && (
              <Badge variant="outline" className="text-xs">Tracked</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                onClick={onSave}
                disabled={isSaving || isLoading}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onCancel}
                disabled={isSaving || isLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                disabled={isDeleting || isLoading}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={onEdit}
                className="flex items-center gap-1"
              >
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Attribute Values Display - Always visible at top */}
      {variantAttributeValues && variantAttributeValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {variantAttributeValues.map((attr, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border">
              {attr.imageUrl && (
                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src={attr.imageUrl}
                    alt={attr.value}
                    fill
                    className="object-cover"
                    sizes="20px"
                  />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {attr.attributeName}: <span className="text-gray-900 font-semibold">{attr.value}</span>
              </span>
              {isEditing && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newValues = variantAttributeValues.filter((_, i) => i !== index);
                    onAttributeValuesChange?.(newValues);
                  }}
                  className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Simple Add Attribute Section - Only show in edit mode */}
      {isEditing && (
        <div className="border-t pt-4">
          <label className="text-sm font-medium text-gray-700 mb-3 block">Add new attribute</label>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <Select
              value={selectedAttributeId}
              onValueChange={setSelectedAttributeId}
              disabled={availableAttributes.length === 0}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Choose attribute..." />
              </SelectTrigger>
              <SelectContent>
                {availableAttributes.map((attr) => (
                  <SelectItem key={attr.id} value={attr.id}>
                    <div className="flex items-center gap-2">
                      {getAttributeTypeIcon(attr.attributeType)}
                      <span>{attr.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedValueId}
              onValueChange={setSelectedValueId}
              disabled={!selectedAttributeId || availableValues.length === 0}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Choose value..." />
              </SelectTrigger>
              <SelectContent>
                {availableValues.map((val) => (
                  <SelectItem key={val.id} value={val.id}>
                    <div className="flex items-center gap-2">
                      {val.imageUrl && (
                        <div className="relative w-4 h-4 rounded-full overflow-hidden">
                          <Image
                            src={val.imageUrl}
                            alt={val.value}
                            fill
                            className="object-cover"
                            sizes="16px"
                          />
                        </div>
                      )}
                      <span>{val.value}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleAddAttribute}
              disabled={!selectedAttributeId || !selectedValueId}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Attribute
            </Button>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">SKU *</Label>
          <Input
            value={sku}
            onChange={(e) => onSkuChange(e.target.value)}
            placeholder="e.g., TSHIRT-RED-L"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Price *</Label>
          <Input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => onPriceChange(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Compare At Price</Label>
          <Input
            type="number"
            step="0.01"
            value={compareAtPrice || ''}
            onChange={(e) => onCompareAtPriceChange(e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="0.00"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Cost Price</Label>
          <Input
            type="number"
            step="0.01"
            value={costPrice || ''}
            onChange={(e) => onCostPriceChange(e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="0.00"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Stock Quantity *</Label>
          <Input
            type="number"
            value={stockQuantity}
            onChange={(e) => onStockChange(parseInt(e.target.value) || 0)}
            placeholder="0"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Low Stock Threshold</Label>
          <Input
            type="number"
            value={lowStockThreshold || ''}
            onChange={(e) => onLowStockThresholdChange(e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="0"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Weight (kg)</Label>
          <Input
            type="number"
            step="0.01"
            value={weight || ''}
            onChange={(e) => onWeightChange(e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="0.00"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Dimensions</Label>
          <Input
            value={dimensions || ''}
            onChange={(e) => onDimensionsChange(e.target.value || undefined)}
            placeholder="e.g., 30x20x2"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Barcode</Label>
          <Input
            value={barcode || ''}
            onChange={(e) => onBarcodeChange(e.target.value || undefined)}
            placeholder="123456789"
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => onActiveChange(e.target.checked)}
            className="rounded"
            disabled={!isEditing}
          />
          <span className="text-sm">Active</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isTracked}
            onChange={(e) => onTrackedChange(e.target.checked)}
            className="rounded"
            disabled={!isEditing}
          />
          <span className="text-sm">Track Inventory</span>
        </label>
      </div>
    </div>
  );
};


