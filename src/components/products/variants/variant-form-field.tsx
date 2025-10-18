/**
 * Variant Form Field - Small, focused component for individual variant editing
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VariantFormFieldProps {
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
  attributeValues: Array<{
    attributeName: string;
    value: string;
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
  onSave: () => void;
  onDelete: () => void;
  isLoading?: boolean;
  className?: string;
}

export const VariantFormField: React.FC<VariantFormFieldProps> = ({
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
  attributeValues,
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
  onSave,
  onDelete,
  isLoading = false,
  className,
}) => {
  return (
    <div className={cn('p-4 border rounded-lg space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{sku}</span>
          <Badge variant={isActive ? 'default' : 'secondary'} className="text-xs">
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
          {isTracked && (
            <Badge variant="outline" className="text-xs">Tracked</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onSave}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Attribute Values */}
      {attributeValues.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {attributeValues.map((attr, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {attr.attributeName}: {attr.value}
            </Badge>
          ))}
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
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Stock Quantity *</Label>
          <Input
            type="number"
            value={stockQuantity}
            onChange={(e) => onStockChange(parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Low Stock Threshold</Label>
          <Input
            type="number"
            value={lowStockThreshold || ''}
            onChange={(e) => onLowStockThresholdChange(e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="0"
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
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Dimensions</Label>
          <Input
            value={dimensions || ''}
            onChange={(e) => onDimensionsChange(e.target.value || undefined)}
            placeholder="e.g., 30x20x2"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Barcode</Label>
          <Input
            value={barcode || ''}
            onChange={(e) => onBarcodeChange(e.target.value || undefined)}
            placeholder="123456789"
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
          />
          <span className="text-sm">Active</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isTracked}
            onChange={(e) => onTrackedChange(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Track Inventory</span>
        </label>
      </div>
    </div>
  );
};


