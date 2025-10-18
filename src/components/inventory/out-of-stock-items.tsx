/**
 * Out of Stock Items Component
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { XCircle, RefreshCw, Search, Calendar } from 'lucide-react';
import { useOutOfStockItems } from '@/lib/query/hooks/inventory-queries';
import { PaginationComponent } from '@/components/ui/pagination-component';

export const OutOfStockItems: React.FC = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const { data, isLoading, error, refetch } = useOutOfStockItems({
    page,
    size: 20,
  });

  const handleSearch = (value: string) => {
    setSearch(value.toLowerCase());
    setPage(0); // Reset to first page when searching
  };

  const filteredItems = data?.data?.filter(item =>
    item.productTitle.toLowerCase().includes(search) ||
    item.variantSku.toLowerCase().includes(search)
  ) || [];

  const getUrgencyColor = (daysOutOfStock: number) => {
    if (daysOutOfStock >= 30) return 'bg-red-100 text-red-800';
    if (daysOutOfStock >= 14) return 'bg-orange-100 text-orange-800';
    if (daysOutOfStock >= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getUrgencyText = (daysOutOfStock: number) => {
    if (daysOutOfStock >= 30) return 'Critical';
    if (daysOutOfStock >= 14) return 'High';
    if (daysOutOfStock >= 7) return 'Medium';
    return 'Low';
  };

  const getSalesTrend = (averageDailySales: number) => {
    if (averageDailySales >= 5) return 'High Demand';
    if (averageDailySales >= 2) return 'Medium Demand';
    if (averageDailySales >= 1) return 'Low Demand';
    return 'Very Low Demand';
  };

  const getSalesTrendColor = (averageDailySales: number) => {
    if (averageDailySales >= 5) return 'bg-green-100 text-green-800';
    if (averageDailySales >= 2) return 'bg-blue-100 text-blue-800';
    if (averageDailySales >= 1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Out of Stock Items
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
            <XCircle className="h-5 w-5 text-red-600" />
            Out of Stock Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 py-4">
            Failed to load out of stock items
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
            <XCircle className="h-5 w-5 text-red-600" />
            Out of Stock Items
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
        {/* Search */}
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products or SKUs..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Results */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {search ? 'No items match your search' : 'No out of stock items found'}
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
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Last sold: {new Date(item.lastSold).toLocaleDateString()}</span>
                      </div>
                      <span>Avg. daily sales: <strong>{item.averageDailySales.toFixed(1)}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getSalesTrendColor(item.averageDailySales)}>
                      {getSalesTrend(item.averageDailySales)}
                    </Badge>
                    <div className="text-right">
                      <Badge className={getUrgencyColor(item.daysOutOfStock)}>
                        {getUrgencyText(item.daysOutOfStock)}
                      </Badge>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.daysOutOfStock} days out
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
