/**
 * Category Status Toggle Confirmation Dialog
 */

'use client';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Category } from '@/lib/query/types';

interface CategoryStatusDialogProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (category: Category) => void;
  isLoading?: boolean;
}

export function CategoryStatusDialog({
  category,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}: CategoryStatusDialogProps) {
  if (!category) return null;

  const newStatus = category.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  const isActivating = newStatus === 'ACTIVE';

  const handleConfirm = () => {
    onConfirm(category);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isActivating ? 'Activate Category' : 'Deactivate Category'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isActivating ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {isActivating ? (
              <ToggleRight className="h-5 w-5 text-green-600" />
            ) : (
              <ToggleLeft className="h-5 w-5 text-gray-600" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {isActivating ? 'Activate Category' : 'Deactivate Category'}
            </h2>
            <p className="text-muted-foreground">
              Change category status
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
                Current status: <span className="font-medium">{category.status}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Status Change Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${
              isActivating ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span className="font-medium">
              Status will change to: <span className="uppercase">{newStatus}</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {isActivating 
              ? 'This category will become visible and available for use.'
              : 'This category will be hidden and unavailable for use.'
            }
          </p>
        </div>

        {/* Warning for subcategories */}
        {category.hasChildren && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <div>
              <h4 className="font-semibold">Subcategories Notice</h4>
              <p className="text-sm">
                This category has subcategories. Changing its status may affect the visibility 
                of its children in the hierarchy.
              </p>
            </div>
          </Alert>
        )}

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
            variant={isActivating ? "default" : "outline"}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading 
              ? (isActivating ? 'Activating...' : 'Deactivating...') 
              : (isActivating ? 'Activate Category' : 'Deactivate Category')
            }
          </Button>
        </div>
      </div>
    </Modal>
  );
}
