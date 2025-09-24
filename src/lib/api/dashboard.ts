import { apiService } from './index'

export interface DateRange {
  start: string
  end: string
}

export interface MetricCard {
  id: string
  title: string
  value: number
  icon: string
  color: 'primary' | 'success' | 'warning' | 'destructive' | 'purple' | 'teal'
  trend?: {
    value: number
    isPositive: boolean
  }
  format?: 'currency' | 'number' | 'percentage'
}

export interface ChartData {
  date: string
  sales: number
  profit: number
  purchase: number
  orders: number
}

export interface DashboardMetrics {
  totalSales: MetricCard
  totalProfit: MetricCard
  totalPurchase: MetricCard
  totalOrders: MetricCard
  totalStores: MetricCard
  pendingOrders: MetricCard
  totalInventory: MetricCard
  inventoryValue: MetricCard
}

export interface TodayReport {
  sales: number
  profit: number
  purchase: number
  orders: number
}

export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    return apiService.get<DashboardMetrics>('/dashboard/metrics')
  },

  getCharts: async (dateRange: DateRange): Promise<ChartData[]> => {
    return apiService.get<ChartData[]>(`/dashboard/charts?start=${dateRange.start}&end=${dateRange.end}`)
  },

  getTodayReport: async (): Promise<TodayReport> => {
    return apiService.get<TodayReport>('/dashboard/today')
  },

  getQuickStats: async (): Promise<MetricCard[]> => {
    return apiService.get<MetricCard[]>('/dashboard/quick-stats')
  }
}
