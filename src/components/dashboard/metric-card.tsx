'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/constants'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: 'primary' | 'success' | 'warning' | 'destructive' | 'purple' | 'teal'
  trend?: {
    value: number
    isPositive: boolean
  }
  format?: 'currency' | 'number' | 'percentage'
  className?: string
}

const colorClasses = {
  primary: 'text-primary',
  success: 'text-green-600',
  warning: 'text-orange-600',
  destructive: 'text-red-600',
  purple: 'text-purple-600',
  teal: 'text-teal-600',
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  format = 'number',
  className
}: MetricCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val)
      case 'percentage':
        return formatPercentage(val)
      default:
        return formatNumber(val)
    }
  }

  return (
    <Card className={cn("p-4 lg:p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]", className)}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-xl lg:text-2xl font-bold">{formatValue(value)}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                <Badge 
                  variant={trend.isPositive ? "default" : "destructive"}
                  className="text-xs transition-all duration-200"
                >
                  {formatPercentage(trend.value)}
                </Badge>
                <span className="text-xs text-muted-foreground hidden sm:inline">vs last month</span>
              </div>
            )}
            <Badge variant="secondary" className="text-xs transition-all duration-200">
              Live Data
            </Badge>
          </div>
          <div className={cn("p-2 lg:p-3 rounded-lg transition-all duration-200 hover:scale-110", colorClasses[color])}>
            <Icon className="h-6 w-6 lg:h-8 lg:w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
