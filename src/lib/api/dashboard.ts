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
  revenue: number
  profit: number
  projects: number
  clients: number
}

export interface DashboardMetrics {
  totalRevenue: MetricCard
  totalInvestment: MetricCard
  netProfit: MetricCard
  totalProjects: MetricCard
  activeProjects: MetricCard
  pendingProjects: MetricCard
  totalClients: MetricCard
  totalServices: MetricCard
}

export interface TodayReport {
  revenue: number
  profit: number
  projects: number
  clients: number
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
