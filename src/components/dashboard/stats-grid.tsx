'use client'

import { MetricCard } from './metric-card'
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  FileText, 
  Building, 
  Clock, 
  Package, 
  Calculator 
} from 'lucide-react'

const metricsData = [
  {
    title: 'Total Sales',
    value: 412633,
    icon: DollarSign,
    color: 'primary' as const,
    trend: { value: 12.5, isPositive: true },
    format: 'currency' as const
  },
  {
    title: 'Total Profit',
    value: 27639,
    icon: TrendingUp,
    color: 'success' as const,
    trend: { value: 8.2, isPositive: true },
    format: 'currency' as const
  },
  {
    title: 'Total Purchase',
    value: 2397630,
    icon: ShoppingCart,
    color: 'purple' as const,
    trend: { value: -2.1, isPositive: false },
    format: 'currency' as const
  },
  {
    title: 'Total Orders',
    value: 118,
    icon: FileText,
    color: 'warning' as const,
    trend: { value: 15.3, isPositive: true },
    format: 'number' as const
  },
  {
    title: 'Total Stores',
    value: 39,
    icon: Building,
    color: 'teal' as const,
    trend: { value: 5.0, isPositive: true },
    format: 'number' as const
  },
  {
    title: 'Pending Orders',
    value: 2,
    icon: Clock,
    color: 'warning' as const,
    trend: { value: -50.0, isPositive: true },
    format: 'number' as const
  },
  {
    title: 'Total Inventory Items',
    value: 7355,
    icon: Package,
    color: 'primary' as const,
    trend: { value: 3.2, isPositive: true },
    format: 'number' as const
  },
  {
    title: 'Total Inventory Value',
    value: 2014927,
    icon: Calculator,
    color: 'destructive' as const,
    trend: { value: -1.8, isPositive: false },
    format: 'currency' as const
  }
]

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {metricsData.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          color={metric.color}
          trend={metric.trend}
          format={metric.format}
          className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
        />
      ))}
    </div>
  )
}
