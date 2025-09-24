'use client'

import { StatsGrid } from '@/components/dashboard/stats-grid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  ShoppingBag
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Key Metrics Grid */}
      <StatsGrid />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Sales & Financial Analytics */}
        <Card className="lg:col-span-2 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Sales & Financial Analytics
            </CardTitle>
            <Select defaultValue="aug-sep">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aug-sep">Aug 15 - Sep 14</SelectItem>
                <SelectItem value="jul-aug">Jul 15 - Aug 14</SelectItem>
                <SelectItem value="jun-jul">Jun 15 - Jul 14</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Track your sales, revenue, and purchase costs over time
            </p>
            
            {/* Legend */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm">Total Sales ৳ 322224.35</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-sm">Total Profit ৳ 22840.86</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                <span className="text-sm">Total Purchase Cost ৳ 92227</span>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="h-48 lg:h-64 bg-muted/20 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-muted/30">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Chart will be implemented with Recharts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Report */}
        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Today's Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Overview of today's business performance
            </p>
            <p className="text-sm font-medium mb-6">
              Sunday, September 14, 2025
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Today's Sales</span>
                </div>
                <span className="font-semibold">৳ 0</span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Today's Profit</span>
                </div>
                <span className="font-semibold">৳ 0</span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Today's Purchase</span>
                </div>
                <span className="font-semibold">৳ 0</span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Today's Orders</span>
                </div>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
