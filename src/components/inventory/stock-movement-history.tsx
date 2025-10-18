/**
 * Stock Movement History Component
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  History, 
  RefreshCw, 
  Search, 
  TrendingUp,
  TrendingDown,
  Package,
  ArrowUpDown
} from 'lucide-react';
import { useStockMovementHistory } from '@/lib/query/hooks/inventory-queries';
import { PaginationComponent } from '@/components/ui/pagination-component';

export const StockMovementHistory: React.FC = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [movementType, setMovementType] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<string>('30');

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

  const { data, isLoading, error, refetch } = useStockMovementHistory({
    page,
    size: 20,
    ...dateParams,
  });

  const handleSearch = (value: string) => {
    setSearch(value.toLowerCase());
    setPage(0);
  };

  const handleMovementTypeChange = (value: string) => {
    setMovementType(value);
    setPage(0);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    setPage(0);
  };

  const filteredItems = data?.data?.filter(item => {
    const matchesSearch = item.productTitle.toLowerCase().includes(search) ||
                         item.variantSku.toLowerCase().includes(search) ||
                         item.reason.toLowerCase().includes(search);
    const matchesType = movementType === 'ALL' || item.movementType === movementType;
    return matchesSearch && matchesType;
  }) || [];

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'SALE': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'RETURN': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'ADJUSTMENT': return <ArrowUpDown className="h-4 w-4 text-blue-600" />;
      case 'RESTOCK': return <Package className="h-4 w-4 text-green-600" />;
      case 'TRANSFER': return <ArrowUpDown className="h-4 w-4 text-purple-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'SALE': return 'bg-red-100 text-red-800';
      case 'RETURN': return 'bg-green-100 text-green-800';
      case 'ADJUSTMENT': return 'bg-blue-100 text-blue-800';
      case 'RESTOCK': return 'bg-green-100 text-green-800';
      case 'TRANSFER': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuantityColor = (quantity: number) => {
    if (quantity > 0) return 'text-green-600';
    if (quantity < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            Stock Movement History
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
            <History className="h-5 w-5 text-blue-600" />
            Stock Movement History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 py-4">
            Failed to load stock movement history
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
            <History className="h-5 w-5 text-blue-600" />
            Stock Movement History
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
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products, SKUs, or reasons..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1"
            />
          </div>
          <Select value={movementType} onValueChange={handleMovementTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Movement Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="SALE">Sales</SelectItem>
              <SelectItem value="RETURN">Returns</SelectItem>
              <SelectItem value="ADJUSTMENT">Adjustments</SelectItem>
              <SelectItem value="RESTOCK">Restocks</SelectItem>
              <SelectItem value="TRANSFER">Transfers</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days (including today)</SelectItem>
              <SelectItem value="30">Last 30 days (including today)</SelectItem>
              <SelectItem value="90">Last 90 days (including today)</SelectItem>
              <SelectItem value="365">Last year (including today)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {search || movementType !== 'ALL' ? 'No movements match your filters' : 'No stock movements found'}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getMovementIcon(item.movementType)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {item.productTitle}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {item.variantSku}
                        </Badge>
                        <Badge className={getMovementColor(item.movementType)}>
                          {item.movementType}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.reason}
                        {item.referenceId && (
                          <span className="ml-2 text-blue-600">
                            ({item.referenceId})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getQuantityColor(item.quantity)}`}>
                      {item.quantity > 0 ? '+' : ''}{item.quantity}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.previousStock} → {item.newStock}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
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
