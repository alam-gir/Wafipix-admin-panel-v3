/**
 * Category Page Modals Component
 * Handles all modal states and interactions
 */

'use client';

import { Category } from '@/lib/query/types';
import { CreateCategoryModal } from './create-category-modal';
import { CategoryUnifiedModal } from './category-unified-modal';
import { CategoryDeleteDialog } from './category-delete-dialog';
import { CategoryStatusDialog } from './category-status-dialog';
import { useCreateCategory, useUpdateCategory, useDeleteCategory, useUpdateCategoryStatus } from '@/lib/query';
import { CreateCategoryFormData, UpdateCategoryFormData } from '@/lib/schemas';

interface CategoryPageModalsProps {
  showCreateForm: boolean;
  showUnifiedModal: boolean;
  showDeleteDialog: boolean;
  showStatusDialog: boolean;
  selectedCategory: Category | null;
  modalMode: 'view' | 'edit';
  onClose: () => void;
  onCategoryDelete: (category: Category) => void;
  onCategoryToggleStatus: (category: Category) => void;
}

export function CategoryPageModals({
  showCreateForm,
  showUnifiedModal,
  showDeleteDialog,
  showStatusDialog,
  selectedCategory,
  modalMode,
  onClose,
  onCategoryDelete,
  onCategoryToggleStatus
}: CategoryPageModalsProps) {
  // Mutation hooks
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const updateStatus = useUpdateCategoryStatus();

  // Event handlers
  const handleUpdateCategory = async (data: UpdateCategoryFormData) => {
    if (!selectedCategory) return;
    
    try {
      await updateCategory.mutateAsync({
        id: selectedCategory.id,
        data: data
      });
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      await deleteCategory.mutateAsync(selectedCategory.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedCategory) return;
    
    try {
      await updateStatus.mutateAsync({
        id: selectedCategory.id,
        status: selectedCategory.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      });
      onClose();
    } catch (error) {
      console.error('Failed to update category status:', error);
    }
  };

  const handleCreateSubcategory = async (data: CreateCategoryFormData) => {
    try {
      await createCategory.mutateAsync(data);
      onClose();
    } catch (error) {
      console.error('Failed to create subcategory:', error);
    }
  };

  return (
    <>
      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={showCreateForm}
        onClose={onClose}
        onSubmit={handleCreateSubcategory}
        isLoading={createCategory.isPending}
        parentCategory={selectedCategory}
      />

      {/* Unified Modal */}
      <CategoryUnifiedModal
        key={`${selectedCategory?.id}-${modalMode}`}
        category={selectedCategory}
        isOpen={showUnifiedModal}
        initialMode={modalMode}
        onClose={onClose}
        onDelete={onCategoryDelete}
        onToggleStatus={onCategoryToggleStatus}
        onUpdate={handleUpdateCategory}
        isLoading={updateCategory.isPending}
      />

      {/* Delete Dialog */}
      <CategoryDeleteDialog
        category={selectedCategory}
        isOpen={showDeleteDialog}
        onClose={onClose}
        onConfirm={handleConfirmDelete}
        isLoading={deleteCategory.isPending}
      />

      {/* Status Dialog */}
      <CategoryStatusDialog
        category={selectedCategory}
        isOpen={showStatusDialog}
        onClose={onClose}
        onConfirm={handleConfirmStatusChange}
        isLoading={updateStatus.isPending}
      />
    </>
  );
}
