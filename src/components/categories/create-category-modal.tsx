/**
 * Create Category Modal Component
 * Dedicated modal for creating new categories
 */

'use client';

import { Modal } from '@/components/ui/modal';
import { CategoryForm } from './category-form';
import { CreateCategoryFormData } from '@/lib/schemas';
import { Category } from '@/lib/query/types';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryFormData) => void;
  isLoading?: boolean;
  parentCategory?: Category | null;
}

export function CreateCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  parentCategory
}: CreateCategoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Category" size="lg">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {parentCategory ? 'Create Subcategory' : 'Create New Category'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {parentCategory 
              ? `Create a new subcategory under "${parentCategory.title}"`
              : 'Fill in the details below to create a new category'
            }
          </p>
        </div>

        <CategoryForm
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          parentCategory={parentCategory}
        />
      </div>
    </Modal>
  );
}
