/**
 * VariantsTab Component - Tab for managing product variants
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';
import { VariantFormField } from './variant-form-field';
import { useVariantEditing } from '@/lib/hooks/use-variant-editing';
import { ProductVariant, VariantAttributeValue } from '@/lib/api/types/product';

interface VariantData extends ProductVariant {
  // Internal state format (for editing)
  variantAttributeValues?: VariantAttributeValue[];
}

interface VariantsTabProps {
  productId: string;
  variants: unknown[];
  onNavigateToAttributes: () => void;
  onUpdate?: () => void;
}

export const VariantsTab: React.FC<VariantsTabProps> = ({
  productId,
  variants,
  onNavigateToAttributes,
  onUpdate,
}) => {
  const {
    variantData,
    error,
    startEditing,
    startCreating,
    updateVariantField,
    updateVariantAttributeValues,
    saveVariant,
    cancelEditing,
    deleteVariant,
    isEditing,
    isUpdating,
    isDeleting,
  } = useVariantEditing({ productId, onUpdate });

  if (variants.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
            <p className="text-sm text-gray-500">
              Manage individual product variants
            </p>
          </div>
          <Button
            onClick={startCreating}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Variant
          </Button>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Variants Yet</h3>
            <p className="text-gray-500 mb-4">Create variants manually or generate them from attributes.</p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={startCreating}>
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
              <Button variant="outline" onClick={onNavigateToAttributes}>
                Generate from Attributes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* New Variant Form */}
        {isEditing('new') && (
          <VariantFormField
            productId={productId}
            sku={variantData['new']?.sku || ''}
            price={variantData['new']?.price || 0}
            compareAtPrice={variantData['new']?.compareAtPrice}
            costPrice={variantData['new']?.costPrice}
            stockQuantity={variantData['new']?.stockQuantity || 0}
            lowStockThreshold={variantData['new']?.lowStockThreshold}
            weight={variantData['new']?.weight}
            dimensions={variantData['new']?.dimensions}
            barcode={variantData['new']?.barcode}
            isActive={variantData['new']?.isActive ?? true}
            isTracked={variantData['new']?.isTracked ?? true}
            variantAttributeValues={variantData['new']?.variantAttributeValues}
            onSkuChange={(sku) => updateVariantField('new', 'sku', sku)}
            onPriceChange={(price) => updateVariantField('new', 'price', price)}
            onCompareAtPriceChange={(price) => updateVariantField('new', 'compareAtPrice', price)}
            onCostPriceChange={(price) => updateVariantField('new', 'costPrice', price)}
            onStockChange={(stock) => updateVariantField('new', 'stockQuantity', stock)}
            onLowStockThresholdChange={(threshold) => updateVariantField('new', 'lowStockThreshold', threshold)}
            onWeightChange={(weight) => updateVariantField('new', 'weight', weight)}
            onDimensionsChange={(dimensions) => updateVariantField('new', 'dimensions', dimensions)}
            onBarcodeChange={(barcode) => updateVariantField('new', 'barcode', barcode)}
            onActiveChange={(isActive) => updateVariantField('new', 'isActive', isActive)}
            onTrackedChange={(isTracked) => updateVariantField('new', 'isTracked', isTracked)}
            onAttributeValuesChange={(values) => updateVariantAttributeValues('new', values)}
            onSave={() => saveVariant('new')}
            onDelete={() => cancelEditing('new')}
            onEdit={() => {}}
            onCancel={() => cancelEditing('new')}
            isEditing={true}
            isSaving={isUpdating}
            isDeleting={false}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
          <p className="text-sm text-gray-500">
            Manage individual product variants ({variants.length} total)
          </p>
        </div>
        <Button
          onClick={startCreating}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Variant
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* New Variant Form */}
      {isEditing('new') && (
        <VariantFormField
          productId={productId}
          sku={variantData['new']?.sku || ''}
          price={variantData['new']?.price || 0}
          compareAtPrice={variantData['new']?.compareAtPrice}
          costPrice={variantData['new']?.costPrice}
          stockQuantity={variantData['new']?.stockQuantity || 0}
          lowStockThreshold={variantData['new']?.lowStockThreshold}
          weight={variantData['new']?.weight}
          dimensions={variantData['new']?.dimensions}
          barcode={variantData['new']?.barcode}
          isActive={variantData['new']?.isActive ?? true}
          isTracked={variantData['new']?.isTracked ?? true}
          variantAttributeValues={variantData['new']?.variantAttributeValues}
          onSkuChange={(sku) => updateVariantField('new', 'sku', sku)}
          onPriceChange={(price) => updateVariantField('new', 'price', price)}
          onCompareAtPriceChange={(price) => updateVariantField('new', 'compareAtPrice', price)}
          onCostPriceChange={(price) => updateVariantField('new', 'costPrice', price)}
          onStockChange={(stock) => updateVariantField('new', 'stockQuantity', stock)}
          onLowStockThresholdChange={(threshold) => updateVariantField('new', 'lowStockThreshold', threshold)}
          onWeightChange={(weight) => updateVariantField('new', 'weight', weight)}
          onDimensionsChange={(dimensions) => updateVariantField('new', 'dimensions', dimensions)}
          onBarcodeChange={(barcode) => updateVariantField('new', 'barcode', barcode)}
          onActiveChange={(isActive) => updateVariantField('new', 'isActive', isActive)}
          onTrackedChange={(isTracked) => updateVariantField('new', 'isTracked', isTracked)}
          onAttributeValuesChange={(values) => updateVariantAttributeValues('new', values)}
          onSave={() => saveVariant('new')}
          onDelete={() => cancelEditing('new')}
          onEdit={() => {}}
          onCancel={() => cancelEditing('new')}
          isEditing={true}
          isSaving={isUpdating}
          isDeleting={false}
        />
      )}

      {/* Existing Variants */}
      {variants.map((variant: unknown) => {
        const v = variant as Record<string, unknown>;
        const variantId = v.id as string;
        const isCurrentlyEditing = isEditing(variantId);
        const currentData = variantData[variantId] || v;

        return (
            <VariantFormField
              key={variantId}
              productId={productId}
              sku={currentData.sku as string}
            price={currentData.price as number}
            compareAtPrice={currentData.compareAtPrice as number}
            costPrice={currentData.costPrice as number}
            stockQuantity={currentData.stockQuantity as number}
            lowStockThreshold={currentData.lowStockThreshold as number}
            weight={currentData.weight as number}
            dimensions={currentData.dimensions as string}
            barcode={currentData.barcode as string}
            isActive={currentData.isActive as boolean}
            isTracked={currentData.isTracked as boolean}
            variantAttributeValues={isCurrentlyEditing 
              ? (currentData.variantAttributeValues as Array<{
                  attributeId: string;
                  attributeName: string;
                  valueId: string;
                  value: string;
                  imageUrl?: string;
                }>)
              : ((v as unknown as VariantData).attributeValues || []).map((attr) => ({
                  attributeId: attr.attributeId,
                  attributeName: attr.attributeName,
                  valueId: attr.valueId,
                  value: attr.value,
                  imageUrl: attr.imageUrl,
                }))
            }
            onSkuChange={(sku) => updateVariantField(variantId, 'sku', sku)}
            onPriceChange={(price) => updateVariantField(variantId, 'price', price)}
            onCompareAtPriceChange={(price) => updateVariantField(variantId, 'compareAtPrice', price)}
            onCostPriceChange={(price) => updateVariantField(variantId, 'costPrice', price)}
            onStockChange={(stock) => updateVariantField(variantId, 'stockQuantity', stock)}
            onLowStockThresholdChange={(threshold) => updateVariantField(variantId, 'lowStockThreshold', threshold)}
            onWeightChange={(weight) => updateVariantField(variantId, 'weight', weight)}
            onDimensionsChange={(dimensions) => updateVariantField(variantId, 'dimensions', dimensions)}
            onBarcodeChange={(barcode) => updateVariantField(variantId, 'barcode', barcode)}
            onActiveChange={(isActive) => updateVariantField(variantId, 'isActive', isActive)}
            onTrackedChange={(isTracked) => updateVariantField(variantId, 'isTracked', isTracked)}
            onAttributeValuesChange={(values) => updateVariantAttributeValues(variantId, values)}
            onSave={() => saveVariant(variantId)}
            onDelete={() => deleteVariant(variantId)}
            onEdit={() => startEditing(v as unknown as VariantData)}
            onCancel={() => cancelEditing(variantId)}
            isEditing={isCurrentlyEditing}
            isSaving={isUpdating}
            isDeleting={isDeleting}
          />
        );
      })}
    </div>
  );
};
