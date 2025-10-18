/**
 * Inventory query hooks
 */

import { useQuery } from '@tanstack/react-query';
import { INVENTORY_KEYS } from '../types/inventory';
import {
  getInventoryOverview,
  getLowStockAlerts,
  getOutOfStockItems,
  getStockMovementHistory,
  getInventoryReport,
  getAlertConfiguration,
} from '@/lib/api/inventory/inventory-api';
import type {
  LowStockAlertsParams,
  OutOfStockParams,
  StockMovementParams,
  InventoryReportParams,
} from '@/lib/api/types/inventory';

// Inventory overview query
export const useInventoryOverview = () => {
  return useQuery({
    queryKey: INVENTORY_KEYS.overview(),
    queryFn: getInventoryOverview,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// Low stock alerts query
export const useLowStockAlerts = (params: LowStockAlertsParams = {}) => {
  return useQuery({
    queryKey: INVENTORY_KEYS.lowStock(params),
    queryFn: () => getLowStockAlerts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: false, // Disable auto-refetch for this query
  });
};

// Out of stock items query
export const useOutOfStockItems = (params: OutOfStockParams = {}) => {
  return useQuery({
    queryKey: INVENTORY_KEYS.outOfStock(params),
    queryFn: () => getOutOfStockItems(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: false, // Disable auto-refetch for this query
  });
};

// Stock movement history query
export const useStockMovementHistory = (params: StockMovementParams = {}) => {
  return useQuery({
    queryKey: INVENTORY_KEYS.stockMovement(params),
    queryFn: () => getStockMovementHistory(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: false, // Disable auto-refetch for this query
  });
};

// Inventory report query
export const useInventoryReport = (params: InventoryReportParams) => {
  return useQuery({
    queryKey: INVENTORY_KEYS.report(params),
    queryFn: () => getInventoryReport(params),
    enabled: !!params.from && !!params.to,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: false, // Disable auto-refetch for this query
  });
};

// Alert configuration query
export const useAlertConfiguration = () => {
  return useQuery({
    queryKey: INVENTORY_KEYS.alertConfig(),
    queryFn: getAlertConfiguration,
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: false, // Disable auto-refetch for this query
  });
};
