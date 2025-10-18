/**
 * Inventory Reports Component
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Package,
  Calendar
} from 'lucide-react';
import { useInventoryReport } from '@/lib/query/hooks/inventory-queries';

export const InventoryReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('30');

  // Memoize date calculations to prevent infinite re-renders
  const dateParams = useMemo(() => {
    const to = new Date();
    // Set to end of today (23:59:59.999)
    to.setHours(23, 59, 59, 999);
    
    const from = new Date();
    // Go back the specified number of days and set to start of that day (00:00:00.000)
    from.setDate(from.getDate() - parseInt(dateRange));
    from.setHours(0, 0, 0, 0);
    
    return {
      from: from.toISOString(),
      to: to.toISOString(),
    };
  }, [dateRange]);

  const { data, isLoading, error, refetch } = useInventoryReport(dateParams);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getNetChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getNetChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Package className="h-4 w-4 text-gray-600" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Inventory Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Inventory Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 py-4">
            Failed to load inventory report
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-2"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const report = data?.data;

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Inventory Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-4">
            No report data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Inventory Reports
            </CardTitle>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days (including today)</SelectItem>
              <SelectItem value="30">Last 30 days (including today)</SelectItem>
              <SelectItem value="90">Last 90 days (including today)</SelectItem>
              <SelectItem value="365">Last year (including today)</SelectItem>
            </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(report.period.from).toLocaleDateString()} - {new Date(report.period.to).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(report.summary.totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              Units sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(report.summary.totalReturns)}</div>
            <p className="text-xs text-muted-foreground">
              Units returned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adjustments</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(report.summary.totalAdjustments)}</div>
            <p className="text-xs text-muted-foreground">
              Stock adjustments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Change</CardTitle>
            {getNetChangeIcon(report.summary.netStockChange)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getNetChangeColor(report.summary.netStockChange)}`}>
              {report.summary.netStockChange > 0 ? '+' : ''}{formatNumber(report.summary.netStockChange)}
            </div>
            <p className="text-xs text-muted-foreground">
              Net stock change
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Variants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Top Selling Variants
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report.summary.topSellingVariants.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No sales data available
            </div>
          ) : (
            <div className="space-y-3">
              {report.summary.topSellingVariants.map((variant, index) => (
                <div
                  key={variant.variantId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium text-sm">{variant.productTitle}</div>
                      <div className="text-xs text-gray-500">{variant.variantSku}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      {formatNumber(variant.salesQuantity)} units
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(variant.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slow Moving Variants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-600" />
            Slow Moving Variants
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report.summary.slowMovingVariants.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No slow moving items
            </div>
          ) : (
            <div className="space-y-3">
              {report.summary.slowMovingVariants.map((variant, index) => (
                <div
                  key={variant.variantId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium text-sm">{variant.productTitle}</div>
                      <div className="text-xs text-gray-500">{variant.variantSku}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">
                      {formatNumber(variant.salesQuantity)} units
                    </div>
                    <div className="text-sm text-gray-600">
                      {variant.daysInStock} days in stock
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
