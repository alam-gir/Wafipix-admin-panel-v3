/**
 * Category Page Content Component
 * Handles filters, content display, and pagination
 */

'use client';

import { CategoryFiltersData } from '@/lib/schemas';
import { Category } from '@/lib/query/types';
import { CategoryFilters } from './category-filters';
import { CategoryListContent } from './category-list-content';
import { CategoryTreeContent } from './category-tree-content';

type ViewMode = 'list' | 'tree';

interface CategoryPageContentProps {
  viewMode: ViewMode;
  filters: CategoryFiltersData;
  onFiltersChange: (filters: CategoryFiltersData) => void;
  onFiltersReset: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onCategorySelect: (category: Category) => void;
  onCategoryEdit: (category: Category) => void;
  onCategoryDelete: (category: Category) => void;
  onCategoryToggleStatus: (category: Category) => void;
  onCreateSubcategory: (parentCategory: Category) => void;
}

export function CategoryPageContent({
  viewMode,
  filters,
  onFiltersChange,
  onFiltersReset,
  onPageChange,
  onPageSizeChange,
  onCategorySelect,
  onCategoryEdit,
  onCategoryDelete,
  onCategoryToggleStatus,
  onCreateSubcategory
}: CategoryPageContentProps) {
  return (
    <>
      {/* Filters - Only show in list mode */}
      {viewMode === 'list' && (
        <CategoryFilters
          filters={filters}
          onFiltersChange={onFiltersChange}
          onReset={onFiltersReset}
        />
      )}

      {/* Content */}
      {viewMode === 'list' ? (
        <CategoryListContent
          filters={filters}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          onCategorySelect={onCategorySelect}
          onCategoryEdit={onCategoryEdit}
          onCategoryDelete={onCategoryDelete}
          onCategoryToggleStatus={onCategoryToggleStatus}
          onCreateCategory={() => {/* Handled by parent */}}
        />
      ) : (
        <CategoryTreeContent
          onCategorySelect={onCategorySelect}
          onCategoryEdit={onCategoryEdit}
          onCategoryDelete={onCategoryDelete}
          onCreateSubcategory={onCreateSubcategory}
        />
      )}
    </>
  );
}
