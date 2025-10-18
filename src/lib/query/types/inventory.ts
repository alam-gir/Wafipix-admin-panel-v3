/**
 * Inventory query keys
 */

import type {
  LowStockAlertsParams,
  OutOfStockParams,
  StockMovementParams,
  InventoryReportParams,
} from '@/lib/api/types/inventory';

export const INVENTORY_KEYS = {
  all: () => ['inventory'] as const,
  
  overview: () => [...INVENTORY_KEYS.all(), 'overview'] as const,
  
  lowStock: (params: LowStockAlertsParams = {}) => [...INVENTORY_KEYS.all(), 'lowStock', params] as const,
  
  outOfStock: (params: OutOfStockParams = {}) => [...INVENTORY_KEYS.all(), 'outOfStock', params] as const,
  
  stockMovement: (params: StockMovementParams = {}) => [...INVENTORY_KEYS.all(), 'stockMovement', params] as const,
  
  report: (params: InventoryReportParams) => [...INVENTORY_KEYS.all(), 'report', params] as const,
  
  alertConfig: () => [...INVENTORY_KEYS.all(), 'alertConfig'] as const,
} as const;
