/**
 * Main Category Management Page
 * Modular design with small, focused components
 */

'use client';

import { useState } from 'react';
import { CategoryFiltersData } from '@/lib/schemas';
import { Category } from '@/lib/query/types';
import { 
  CategoryPageHeader, 
  CategoryPageContent, 
  CategoryPageModals 
} from '@/components/categories';

type ViewMode = 'list' | 'tree';

export default function CategoryManagementPage() {
  // State management
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filters, setFilters] = useState<CategoryFiltersData>({
    page: 0,
    size: 10,
    sortBy: 'title',
    sortDir: 'asc'
  });

  // Modal states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUnifiedModal, setShowUnifiedModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  // Event handlers
  const handleFiltersChange = (newFilters: CategoryFiltersData) => {
    setFilters(newFilters);
  };

  const handleFiltersReset = () => {
    setFilters({
      page: 0,
      size: 10,
      sortBy: 'title',
      sortDir: 'asc'
    });
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilters(prev => ({ ...prev, size, page: 0 }));
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setModalMode('view');
    setShowUnifiedModal(true);
  };

  const handleCategoryEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalMode('edit');
    setShowUnifiedModal(true);
  };

  const handleCategoryDelete = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const handleCategoryToggleStatus = (category: Category) => {
    setSelectedCategory(category);
    setShowStatusDialog(true);
  };

  const handleCreateSubcategory = (parentCategory: Category) => {
    setSelectedCategory(parentCategory);
    setShowCreateForm(true);
  };

  const handleCloseModals = () => {
    setShowCreateForm(false);
    setShowUnifiedModal(false);
    setShowDeleteDialog(false);
    setShowStatusDialog(false);
    setSelectedCategory(null);
    setModalMode('view');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <CategoryPageHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateCategory={() => setShowCreateForm(true)}
      />

      {/* Page Content */}
      <CategoryPageContent
        viewMode={viewMode}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onFiltersReset={handleFiltersReset}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onCategorySelect={handleCategorySelect}
        onCategoryEdit={handleCategoryEdit}
        onCategoryDelete={handleCategoryDelete}
        onCategoryToggleStatus={handleCategoryToggleStatus}
        onCreateSubcategory={handleCreateSubcategory}
      />

      {/* Modals */}
      <CategoryPageModals
        showCreateForm={showCreateForm}
        showUnifiedModal={showUnifiedModal}
        showDeleteDialog={showDeleteDialog}
        showStatusDialog={showStatusDialog}
        selectedCategory={selectedCategory}
        modalMode={modalMode}
        onClose={handleCloseModals}
        onCategoryDelete={handleCategoryDelete}
        onCategoryToggleStatus={handleCategoryToggleStatus}
      />
    </div>
  );
}
