/**
 * Category List Content Component
 * Handles list view with pagination
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CategoryFiltersData } from '@/lib/schemas';
import { Category } from '@/lib/query/types';
import { useCategories } from '@/lib/query';
import { CategoryListItem } from './category-list-item';
import { CategoryPagination } from './category-pagination';

interface CategoryListContentProps {
  filters: CategoryFiltersData;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onCategorySelect: (category: Category) => void;
  onCategoryEdit: (category: Category) => void;
  onCategoryDelete: (category: Category) => void;
  onCategoryToggleStatus: (category: Category) => void;
  onCreateCategory: () => void;
}

export function CategoryListContent({
  filters,
  onPageChange,
  onPageSizeChange,
  onCategorySelect,
  onCategoryEdit,
  onCategoryDelete,
  onCategoryToggleStatus,
  onCreateCategory
}: CategoryListContentProps) {
  const { data: categoriesData, isLoading, error } = useCategories(filters);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Categories</h2>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (categoriesData?.data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first category
            </p>
            <Button onClick={onCreateCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Categories List */}
      <div className="space-y-4">
        {categoriesData?.data.map((category) => (
          <CategoryListItem
            key={category.id}
            category={category}
            onEdit={onCategoryEdit}
            onDelete={onCategoryDelete}
            onView={onCategorySelect}
            onToggleStatus={onCategoryToggleStatus}
          />
        ))}
      </div>

      {/* Pagination */}
      {categoriesData && categoriesData.pagination.totalPages > 1 && (
        <CategoryPagination
          currentPage={categoriesData.pagination.page}
          totalPages={categoriesData.pagination.totalPages}
          totalElements={categoriesData.pagination.total}
          pageSize={filters.size}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </>
  );
}
