/**
 * Custom hook for managing variant editing
 */

import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateProductVariant, useDeleteProductVariant, useCreateProductVariant } from '@/lib/query/hooks/product-mutations';
import { ProductVariant } from '@/lib/api/types/product';

interface VariantData extends ProductVariant {
  // Internal state format (for editing)
  variantAttributeValues?: Array<{
    attributeId: string;
    attributeName: string;
    valueId: string;
    value: string;
    imageUrl?: string;
  }>;
}

interface UseVariantEditingProps {
  productId: string;
  onUpdate?: () => void;
}

export const useVariantEditing = ({ productId, onUpdate }: UseVariantEditingProps) => {
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [variantData, setVariantData] = useState<Record<string, VariantData>>({});
  const [error, setError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const updateVariantMutation = useUpdateProductVariant();
  const deleteVariantMutation = useDeleteProductVariant();
  const createVariantMutation = useCreateProductVariant();

  const startEditing = useCallback((variant: VariantData) => {
    setEditingVariant(variant.id);
    setVariantData(prev => ({
      ...prev,
      [variant.id]: { 
        ...variant,
        // Map backend attributeValues to variantAttributeValues for editing
        variantAttributeValues: variant.attributeValues?.map(attr => ({
          attributeId: attr.attributeId,
          attributeName: attr.attributeName,
          attributeType: attr.attributeType,
          valueId: attr.valueId,
          value: attr.value,
          imageUrl: attr.imageUrl,
        })) || []
      }
    }));
  }, []);

  const startCreating = useCallback(() => {
    setEditingVariant('new');
    setVariantData(prev => ({
      ...prev,
      'new': {
        id: 'new',
        sku: '',
        price: 0,
        stockQuantity: 0,
        isActive: true,
        isTracked: true,
        attributeValues: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        variantAttributeValues: [],
      }
    }));
  }, []);

  const updateVariantField = useCallback((variantId: string, field: keyof VariantData, value: string | number | boolean | undefined) => {
    setVariantData(prev => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        [field]: value
      }
    }));
  }, []);

  const updateVariantAttributeValues = useCallback((variantId: string, attributeValues: Array<{
    attributeId: string;
    attributeName: string;
    valueId: string;
    value: string;
    imageUrl?: string;
  }>) => {
    setVariantData(prev => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        variantAttributeValues: attributeValues
      }
    }));
  }, []);

  const saveVariant = useCallback(async (variantId: string) => {
    const data = variantData[variantId];
    if (!data) {
      setError('Variant data not found');
      return false;
    }

    // Basic validation
    if (!data.sku.trim()) {
      setError('SKU is required');
      return false;
    }

    if (data.price <= 0) {
      setError('Price must be greater than 0');
      return false;
    }

    if (data.stockQuantity < 0) {
      setError('Stock quantity cannot be negative');
      return false;
    }

    try {
      setError(null);
      
      if (variantId === 'new') {
        // Create new variant
        await createVariantMutation.mutateAsync({
          productId,
          data: {
            sku: data.sku,
            price: data.price,
            compareAtPrice: data.compareAtPrice,
            costPrice: data.costPrice,
            stockQuantity: data.stockQuantity,
            lowStockThreshold: data.lowStockThreshold,
            weight: data.weight,
            dimensions: data.dimensions,
            barcode: data.barcode,
            isActive: data.isActive,
            isTracked: data.isTracked,
            attributeValueIds: data.variantAttributeValues?.map(attr => attr.valueId) || [],
          },
        });
      } else {
        // Update existing variant
        await updateVariantMutation.mutateAsync({
          productId,
          variantId,
          data: {
            sku: data.sku,
            price: data.price,
            compareAtPrice: data.compareAtPrice,
            costPrice: data.costPrice,
            stockQuantity: data.stockQuantity,
            lowStockThreshold: data.lowStockThreshold,
            weight: data.weight,
            dimensions: data.dimensions,
            barcode: data.barcode,
            isActive: data.isActive,
            isTracked: data.isTracked,
            attributeValueIds: data.variantAttributeValues?.map(attr => attr.valueId) || [],
          },
        });
      }

      // Clear editing state
      setEditingVariant(null);
      setVariantData(prev => {
        const newData = { ...prev };
        delete newData[variantId];
        return newData;
      });

      onUpdate?.();
      return true;
    } catch (err) {
      console.error('Failed to save variant:', err);
      setError('Failed to save variant. Please try again.');
      return false;
    }
  }, [variantData, productId, updateVariantMutation, createVariantMutation, onUpdate]);

  const cancelEditing = useCallback((variantId: string) => {
    setEditingVariant(null);
    setVariantData(prev => {
      const newData = { ...prev };
      delete newData[variantId];
      return newData;
    });
  }, []);

  const deleteVariant = useCallback(async (variantId: string) => {
    if (!window.confirm('Are you sure you want to delete this variant?')) {
      return false;
    }

    try {
      setError(null);
      await deleteVariantMutation.mutateAsync({
        productId,
        variantId,
      });

      onUpdate?.();
      return true;
    } catch (err) {
      console.error('Failed to delete variant:', err);
      setError('Failed to delete variant. Please try again.');
      return false;
    }
  }, [productId, deleteVariantMutation, onUpdate]);

  return {
    // State
    editingVariant,
    variantData,
    error,
    
    // Actions
    startEditing,
    startCreating,
    updateVariantField,
    updateVariantAttributeValues,
    saveVariant,
    cancelEditing,
    deleteVariant,
    
    // Computed
    isEditing: (variantId: string) => editingVariant === variantId,
    isUpdating: updateVariantMutation.isPending || createVariantMutation.isPending,
    isDeleting: deleteVariantMutation.isPending,
  };
};
