/**
 * Low Stock Alerts Component
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Search } from 'lucide-react';
import { useLowStockAlerts } from '@/lib/query/hooks/inventory-queries';
import { PaginationComponent } from '@/components/ui/pagination-component';

export const LowStockAlerts: React.FC = () => {
  const [threshold, setThreshold] = useState(10);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const { data, isLoading, error, refetch } = useLowStockAlerts({
    page,
    size: 20,
    threshold,
  });

  const handleThresholdChange = (newThreshold: number) => {
    setThreshold(newThreshold);
    setPage(0); // Reset to first page when threshold changes
  };

  const handleSearch = (value: string) => {
    setSearch(value.toLowerCase());
    setPage(0); // Reset to first page when searching
  };

  const filteredItems = data?.data?.filter(item =>
    item.productTitle.toLowerCase().includes(search) ||
    item.variantSku.toLowerCase().includes(search)
  ) || [];

  const getUrgencyColor = (daysUntilOutOfStock: number) => {
    if (daysUntilOutOfStock <= 1) return 'bg-red-100 text-red-800';
    if (daysUntilOutOfStock <= 3) return 'bg-orange-100 text-orange-800';
    if (daysUntilOutOfStock <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getUrgencyText = (daysUntilOutOfStock: number) => {
    if (daysUntilOutOfStock <= 1) return 'Critical';
    if (daysUntilOutOfStock <= 3) return 'High';
    if (daysUntilOutOfStock <= 7) return 'Medium';
    return 'Low';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
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
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 py-4">
            Failed to load low stock alerts
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Low Stock Alerts
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Threshold:</label>
            <Input
              type="number"
              value={threshold}
              onChange={(e) => handleThresholdChange(Number(e.target.value))}
              className="w-20"
              min="1"
            />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products or SKUs..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Results */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {search ? 'No items match your search' : 'No low stock items found'}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {item.productTitle}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {item.variantSku}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Current: <strong>{item.currentStock}</strong></span>
                      <span>Threshold: <strong>{item.lowStockThreshold}</strong></span>
                      <span>Last sold: {new Date(item.lastSold).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getUrgencyColor(item.daysUntilOutOfStock)}>
                      {getUrgencyText(item.daysUntilOutOfStock)}
                    </Badge>
                    <div className="text-right text-sm">
                      <div className="font-medium">
                        {item.daysUntilOutOfStock} days
                      </div>
                      <div className="text-gray-500 text-xs">
                        until out of stock
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <PaginationComponent
                pagination={data.pagination}
                onPageChange={setPage}
                onSizeChange={() => {}} // Not needed for this component
                showSizeChanger={false}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
