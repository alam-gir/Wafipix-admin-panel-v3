/**
 * Inventory mutation hooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { INVENTORY_KEYS } from '../types/inventory';
import {
  bulkUpdateStock,
  adjustStock,
  updateAlertConfiguration,
} from '@/lib/api/inventory/inventory-api';
import type {
  BulkStockUpdateRequest,
  StockAdjustmentRequest,
  AlertConfiguration,
} from '@/lib/api/types/inventory';

// Bulk stock update mutation
export const useBulkStockUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdateStock,
    onSuccess: () => {
      // Invalidate all inventory-related queries
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all() });
    },
  });
};

// Stock adjustment mutation
export const useStockAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adjustStock,
    onSuccess: () => {
      // Invalidate inventory queries
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all() });
    },
  });
};

// Alert configuration update mutation
export const useUpdateAlertConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAlertConfiguration,
    onSuccess: () => {
      // Invalidate alert configuration query
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.alertConfig() });
    },
  });
};
