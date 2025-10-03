'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Activity,
  Wallet,
  Target,
  CheckCircle,
  Clock,
  UserCheck,
  Settings,
  Briefcase
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Wafipix Dashboard</h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your design agency today.
        </p>
      </div>

      {/* Financial Metrics */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-semibold">Financial Metrics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-l-emerald-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  </div>
                  <p className="text-3xl font-bold text-emerald-600">$245,680</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-600">+18.5%</span>
                    <span className="text-xs text-muted-foreground">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-red-600" />
                    <p className="text-sm font-medium text-muted-foreground">Total Investment</p>
                  </div>
                  <p className="text-3xl font-bold text-red-600">$45,680</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-red-600" />
                    <span className="text-xs font-medium text-red-600">+5.2%</span>
                    <span className="text-xs text-muted-foreground">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">
                  <Target className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">$200,000</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">+22.3%</span>
                    <span className="text-xs text-muted-foreground">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Metrics */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold">Project Metrics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">156</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">+12.8%</span>
                    <span className="text-xs text-muted-foreground">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-full group-hover:bg-purple-100 transition-colors">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-orange-600" />
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  </div>
                  <p className="text-3xl font-bold text-orange-600">23</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-orange-600" />
                    <span className="text-xs font-medium text-orange-600">+8.5%</span>
                    <span className="text-xs text-muted-foreground">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-l-amber-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <p className="text-sm font-medium text-muted-foreground">Pending Projects</p>
                  </div>
                  <p className="text-3xl font-bold text-amber-600">7</p>
                  <div className="flex items-center space-x-1">
                    <TrendingDown className="h-3 w-3 text-amber-600" />
                    <span className="text-xs font-medium text-amber-600">-15.0%</span>
                    <span className="text-xs text-muted-foreground">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-amber-50 rounded-full group-hover:bg-amber-100 transition-colors">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Client & Services Metrics */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <UserCheck className="h-5 w-5 text-teal-600" />
          <h2 className="text-xl font-semibold">Client & Services Metrics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-l-teal-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-teal-600" />
                    <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                  </div>
                  <p className="text-3xl font-bold text-teal-600">89</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-teal-600" />
                    <span className="text-xs font-medium text-teal-600">+6.2%</span>
                    <span className="text-xs text-muted-foreground">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-teal-50 rounded-full group-hover:bg-teal-100 transition-colors">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-l-indigo-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-indigo-600" />
                    <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                  </div>
                  <p className="text-3xl font-bold text-indigo-600">12</p>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-indigo-600" />
                    <span className="text-xs font-medium text-indigo-600">Stable</span>
                    <span className="text-xs text-muted-foreground">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors">
                  <Settings className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Revenue & Project Analytics */}
        <Card className="lg:col-span-2 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Revenue & Project Analytics
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
              Track your revenue, profit, and project completion over time
            </p>
            
            {/* Legend */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm">Revenue $12,500</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-sm">Profit $8,500</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                <span className="text-sm">Projects 3</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-sm">Clients 2</span>
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
              Today&apos;s Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Overview of today&apos;s design agency performance
            </p>
            <p className="text-sm font-medium mb-6">
              Sunday, September 14, 2025
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Today&apos;s Revenue</span>
                </div>
                <span className="font-semibold">$8,500</span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Today&apos;s Profit</span>
                </div>
                <span className="font-semibold">$6,200</span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Projects Completed</span>
                </div>
                <span className="font-semibold">2</span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">New Clients</span>
                </div>
                <span className="font-semibold">1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
