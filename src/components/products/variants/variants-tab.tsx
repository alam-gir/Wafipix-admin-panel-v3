/**
 * VariantsTab Component - Tab for managing product variants
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';
import { VariantFormField } from './variant-form-field';

interface VariantsTabProps {
  variants: unknown[];
  onNavigateToAttributes: () => void;
}

export const VariantsTab: React.FC<VariantsTabProps> = ({
  variants,
  onNavigateToAttributes,
}) => {
  if (variants.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Variants Yet</h3>
          <p className="text-gray-500 mb-4">Create attributes and generate variants to get started.</p>
          <Button onClick={onNavigateToAttributes}>
            <Plus className="h-4 w-4 mr-2" />
            Create Attributes
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {variants.map((variant: unknown) => {
        const v = variant as Record<string, unknown>;
        return (
          <VariantFormField
            key={v.id as string}
            sku={v.sku as string}
            price={v.price as number}
            compareAtPrice={v.compareAtPrice as number}
            costPrice={v.costPrice as number}
            stockQuantity={v.stockQuantity as number}
            lowStockThreshold={v.lowStockThreshold as number}
            weight={v.weight as number}
            dimensions={v.dimensions as string}
            barcode={v.barcode as string}
            isActive={v.isActive as boolean}
            isTracked={v.isTracked as boolean}
            attributeValues={v.attributeValues as Array<{ attributeName: string; value: string }>}
            onSkuChange={() => {}}
            onPriceChange={() => {}}
            onCompareAtPriceChange={() => {}}
            onCostPriceChange={() => {}}
            onStockChange={() => {}}
            onLowStockThresholdChange={() => {}}
            onWeightChange={() => {}}
            onDimensionsChange={() => {}}
            onBarcodeChange={() => {}}
            onActiveChange={() => {}}
            onTrackedChange={() => {}}
            onSave={() => {}}
            onDelete={() => {}}
          />
        );
      })}
    </div>
  );
};
