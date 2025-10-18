/**
 * Inventory management API client functions
 */

import { apiClient } from "../client";
import type {
  InventoryOverviewResponse,
  LowStockAlertsResponse,
  LowStockAlertsParams,
  OutOfStockResponse,
  OutOfStockParams,
  StockMovementResponse,
  StockMovementParams,
  BulkStockUpdateRequest,
  BulkStockUpdateApiResponse,
  StockAdjustmentRequest,
  StockAdjustmentApiResponse,
  InventoryReportApiResponse,
  InventoryReportParams,
  AlertConfigurationResponse,
  AlertConfiguration,
} from '../types/inventory';

// API 1: Inventory Overview Dashboard
export const getInventoryOverview = async (): Promise<InventoryOverviewResponse> => {
  const response = await apiClient.get('/inventory/overview');
  return response.data;
};

// API 2: Low Stock Alerts
export const getLowStockAlerts = async (params: LowStockAlertsParams = {}): Promise<LowStockAlertsResponse> => {
  const response = await apiClient.get('/inventory/low-stock', { params });
  return response.data;
};

// API 3: Out of Stock Items
export const getOutOfStockItems = async (params: OutOfStockParams = {}): Promise<OutOfStockResponse> => {
  const response = await apiClient.get('/inventory/out-of-stock', { params });
  return response.data;
};

// API 4: Stock Movement History
export const getStockMovementHistory = async (params: StockMovementParams = {}): Promise<StockMovementResponse> => {
  const response = await apiClient.get('/inventory/stock-movement', { params });
  return response.data;
};

// API 5: Bulk Stock Update
export const bulkUpdateStock = async (data: BulkStockUpdateRequest): Promise<BulkStockUpdateApiResponse> => {
  const response = await apiClient.post('/inventory/bulk-update', data);
  return response.data;
};

// API 6: Stock Adjustment
export const adjustStock = async (data: StockAdjustmentRequest): Promise<StockAdjustmentApiResponse> => {
  const response = await apiClient.post('/inventory/adjustment', data);
  return response.data;
};

// API 7: Inventory Reports
export const getInventoryReport = async (params: InventoryReportParams): Promise<InventoryReportApiResponse> => {
  const response = await apiClient.get('/inventory/reports/stock-summary', { params });
  return response.data;
};

// API 8: Alert Configuration
export const getAlertConfiguration = async (): Promise<AlertConfigurationResponse> => {
  const response = await apiClient.get('/inventory/alerts/config');
  return response.data;
};

export const updateAlertConfiguration = async (data: AlertConfiguration): Promise<AlertConfigurationResponse> => {
  const response = await apiClient.put('/inventory/alerts/config', data);
  return response.data;
};
