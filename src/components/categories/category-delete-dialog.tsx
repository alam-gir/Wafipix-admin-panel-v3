/**
 * Category Delete Confirmation Dialog
 */

'use client';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Trash2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Category } from '@/lib/query/types';

interface CategoryDeleteDialogProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (category: Category) => void;
  isLoading?: boolean;
}

export function CategoryDeleteDialog({
  category,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}: CategoryDeleteDialogProps) {
  if (!category) return null;

  const handleConfirm = () => {
    onConfirm(category);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Category">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Delete Category</h2>
            <p className="text-muted-foreground">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* Category Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            {category.image ? (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                <Image 
                  src={category.image} 
                  alt={category.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-500">
                  {category.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold">{category.title}</h3>
              <p className="text-sm text-muted-foreground">
                Level {category.level} • {category.status}
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <div>
            <h4 className="font-semibold">Warning</h4>
            <p className="text-sm">
              Deleting this category will permanently remove it and all its data. 
              {category.hasChildren && (
                <span className="block mt-1 text-red-600 font-medium">
                  This category has subcategories. Deleting it may affect the hierarchy.
                </span>
              )}
            </p>
          </div>
        </Alert>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Category'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
