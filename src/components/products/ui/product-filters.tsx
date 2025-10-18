/**
 * Product Filters Component - Small, focused component
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  search: string;
  categoryId: string | null;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
  onClearFilters: () => void;
  categories: Array<{ id: string; title: string }>;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  categoryId,
  sortBy,
  sortDir,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onClearFilters,
  categories,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasActiveFilters = search || categoryId !== null || sortBy !== 'title';

  const activeFilterCount = [
    search && 'Search',
    categoryId && 'Category',
    sortBy !== 'title' && 'Sort'
  ].filter(Boolean).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className={cn("pt-0", !isExpanded && "hidden")}>
        <div className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title..."
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select value={categoryId || 'all'} onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sort by</label>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={(value) => onSortChange(value, sortDir)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="updatedAt">Updated Date</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="totalStock">Stock Quantity</SelectItem>
                    <SelectItem value="variantCount">Variant Count</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSortChange(sortBy, sortDir === 'asc' ? 'desc' : 'asc')}
                  className="px-3"
                >
                  {sortDir === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
