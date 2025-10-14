/**
 * Category Filters Component
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';
import { CategoryFiltersData } from '@/lib/schemas';
import { useCategoryMaxLevel } from '@/lib/query';

interface CategoryFiltersProps {
  filters: CategoryFiltersData;
  onFiltersChange: (filters: CategoryFiltersData) => void;
  onReset: () => void;
}

export function CategoryFilters({ filters, onFiltersChange, onReset }: CategoryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: maxLevel = 0 } = useCategoryMaxLevel();

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value, page: 0 });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      status: value === 'all' ? undefined : value as 'ACTIVE' | 'INACTIVE',
      page: 0 
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortDir] = value.split('-');
    onFiltersChange({ 
      ...filters, 
      sortBy: sortBy as 'title' | 'createdAt' | 'updatedAt',
      sortDir: sortDir as 'asc' | 'desc',
      page: 0 
    });
  };

  const handlePageSizeChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      size: parseInt(value),
      page: 0 
    });
  };

  const hasActiveFilters = filters.search || filters.status || filters.level !== undefined;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Main Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="shrink-0"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onReset}
                className="shrink-0"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select
                  value={`${filters.sortBy}-${filters.sortDir}`}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sort option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
                    <SelectItem value="updatedAt-asc">Least Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Level</label>
                <Select
                  value={filters.level?.toString() || 'all'}
                  onValueChange={(value) => {
                    onFiltersChange({ 
                      ...filters, 
                      level: value === 'all' ? undefined : parseInt(value),
                      page: 0 
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="0">Root Categories (0)</SelectItem>
                    {Array.from({ length: maxLevel }, (_, i) => i + 1).map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        Level {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Items Per Page</label>
                <Select
                  value={filters.size.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select page size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
