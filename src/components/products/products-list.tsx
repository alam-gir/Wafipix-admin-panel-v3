/**
 * Products List Component - Combines small components
 */

import React from 'react';
import { ProductCard } from './ui/product-card';
import { ProductFilters } from './ui/product-filters';
import { ProductPagination } from './ui/product-pagination';
import type { ProductSummary } from '@/lib/api/types/product';

interface ProductsListProps {
  products: ProductSummary[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  filters: {
    search: string;
    categoryId: string;
    sortBy: string;
    sortDir: 'asc' | 'desc';
  };
  categories: Array<{ id: string; title: string }>;
  onFiltersChange: (filters: any) => void;
  onPageChange: (page: number) => void;
  onViewProduct: (product: ProductSummary) => void;
  onEditProduct: (product: ProductSummary) => void;
  onDeleteProduct: (product: ProductSummary) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  products,
  pagination,
  filters,
  categories,
  onFiltersChange,
  onPageChange,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <ProductFilters
        search={filters.search}
        categoryId={filters.categoryId}
        sortBy={filters.sortBy}
        sortDir={filters.sortDir}
        onSearchChange={(search) => onFiltersChange({ ...filters, search })}
        onCategoryChange={(categoryId) => onFiltersChange({ ...filters, categoryId })}
        onSortChange={(sortBy, sortDir) => onFiltersChange({ ...filters, sortBy, sortDir })}
        onClearFilters={() => onFiltersChange({ search: '', categoryId: null, sortBy: 'title', sortDir: 'asc' })}
        categories={categories}
      />

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={onViewProduct}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      )}

      {/* Pagination */}
      <ProductPagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
        pageSize={pagination.size}
        onPageChange={onPageChange}
      />
    </div>
  );
};
