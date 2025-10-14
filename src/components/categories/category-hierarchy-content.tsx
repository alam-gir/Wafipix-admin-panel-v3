/**
 * Category Hierarchy Content Component
 * Handles hierarchy view using the new tree component
 */

'use client';

import { Category } from '@/lib/query/types';
import { CategoryTreeContent } from './category-tree-content';

interface CategoryHierarchyContentProps {
  onCategorySelect: (category: Category) => void;
  onCategoryEdit: (category: Category) => void;
  onCategoryDelete: (category: Category) => void;
  onCategoryToggleStatus: (category: Category) => void;
  onCreateSubcategory: (parentCategory: Category) => void;
}

export function CategoryHierarchyContent({
  onCategorySelect,
  onCategoryEdit,
  onCategoryDelete,
  onCategoryToggleStatus,
  onCreateSubcategory
}: CategoryHierarchyContentProps) {
  return (
    <CategoryTreeContent
      onCategorySelect={onCategorySelect}
      onCategoryEdit={onCategoryEdit}
      onCategoryDelete={onCategoryDelete}
      onCategoryToggleStatus={onCategoryToggleStatus}
      onCreateSubcategory={onCreateSubcategory}
    />
  );
}
