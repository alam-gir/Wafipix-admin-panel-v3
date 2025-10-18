/**
 * Inventory management API types
 */

import { ApiResponse, Pagination } from './common';

// API 1: Inventory Overview Dashboard
export interface InventoryOverview {
  totalProducts: number;
  totalVariants: number;
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockItems: number;
  totalStockQuantity: number;
  lastUpdated: string;
}

export type InventoryOverviewResponse = ApiResponse<InventoryOverview>;

// API 2: Low Stock Alerts
export interface LowStockItem {
  productId: string;
  productTitle: string;
  variantId: string;
  variantSku: string;
  currentStock: number;
  lowStockThreshold: number;
  lastSold: string;
  daysUntilOutOfStock: number;
}

export interface LowStockAlertsParams {
  page?: number;
  size?: number;
  threshold?: number;
}

export type LowStockAlertsResponse = ApiResponse<LowStockItem[]>;

// API 3: Out of Stock Items
export interface OutOfStockItem {
  productId: string;
  productTitle: string;
  variantId: string;
  variantSku: string;
  lastSold: string;
  daysOutOfStock: number;
  averageDailySales: number;
}

export interface OutOfStockParams {
  page?: number;
  size?: number;
}

export type OutOfStockResponse = ApiResponse<OutOfStockItem[]>;

// API 4: Stock Movement History
export interface StockMovement {
  id: string;
  productId: string;
  productTitle: string;
  variantId: string;
  variantSku: string;
  movementType: 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'RESTOCK' | 'TRANSFER';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  referenceId?: string;
  createdAt: string;
  createdBy: string;
}

export interface StockMovementParams {
  productId?: string;
  variantId?: string;
  page?: number;
  size?: number;
  from?: string;
  to?: string;
}

export type StockMovementResponse = ApiResponse<StockMovement[]>;

// API 5: Bulk Stock Update
export interface BulkStockUpdateItem {
  variantId: string;
  stockQuantity: number;
  lowStockThreshold: number;
  reason: string;
}

export interface BulkStockUpdateRequest {
  updates: BulkStockUpdateItem[];
  reason: string;
  createdBy: string;
}

export interface BulkStockUpdateResult {
  variantId: string;
  previousStock: number;
  newStock: number;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
}

export interface BulkStockUpdateResponse {
  updatedCount: number;
  failedCount: number;
  updatedVariants: BulkStockUpdateResult[];
  failedVariants: BulkStockUpdateResult[];
}

export type BulkStockUpdateApiResponse = ApiResponse<BulkStockUpdateResponse>;

// API 6: Stock Adjustment
export interface StockAdjustmentRequest {
  variantId: string;
  adjustmentType: 'ADD' | 'REMOVE' | 'SET';
  quantity: number;
  reason: string;
  createdBy: string;
}

export interface StockAdjustmentResponse {
  variantId: string;
  previousStock: number;
  newStock: number;
  adjustmentType: 'ADD' | 'REMOVE' | 'SET';
  quantity: number;
  movementId: string;
}

export type StockAdjustmentApiResponse = ApiResponse<StockAdjustmentResponse>;

// API 7: Inventory Reports
export interface TopSellingVariant {
  variantId: string;
  variantSku: string;
  productTitle: string;
  salesQuantity: number;
  revenue: number;
}

export interface SlowMovingVariant {
  variantId: string;
  variantSku: string;
  productTitle: string;
  salesQuantity: number;
  daysInStock: number;
}

export interface InventoryReportSummary {
  totalSales: number;
  totalReturns: number;
  totalAdjustments: number;
  netStockChange: number;
  topSellingVariants: TopSellingVariant[];
  slowMovingVariants: SlowMovingVariant[];
}

export interface InventoryReport {
  period: {
    from: string;
    to: string;
  };
  summary: InventoryReportSummary;
}

export interface InventoryReportParams {
  from: string;
  to: string;
}

export type InventoryReportApiResponse = ApiResponse<InventoryReport>;

// API 8: Alert Configuration
export interface AlertConfiguration {
  globalLowStockThreshold: number;
  enableEmailAlerts: boolean;
  enableDashboardAlerts: boolean;
  alertFrequency: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  alertRecipients: string[];
}

export type AlertConfigurationResponse = ApiResponse<AlertConfiguration>;
