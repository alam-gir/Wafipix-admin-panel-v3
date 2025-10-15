/**
 * Unified Category Modal Component
 * Handles both viewing and editing categories in a single modal
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Edit, 
  Trash2, 
  FolderOpen,
  Calendar,
  Layers,
  User
} from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Category } from '@/lib/query/types';
import { useCategory } from '@/lib/query';
import { CategoryForm } from './category-form';
import { CreateCategoryFormData, UpdateCategoryFormData } from '@/lib/schemas';

interface CategoryUnifiedModalProps {
  category: Category | null;
  isOpen: boolean;
  initialMode?: 'view' | 'edit';
  onClose: () => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
  onUpdate: (data: UpdateCategoryFormData) => Promise<void>;
  isLoading?: boolean;
}

export function CategoryUnifiedModal({
  category,
  isOpen,
  initialMode = 'view',
  onClose,
  onDelete,
  onToggleStatus,
  onUpdate,
  isLoading = false
}: CategoryUnifiedModalProps) {
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode);
  
  // Fetch the latest category data from cache
  const { data: latestCategory, isLoading: isLoadingCategory } = useCategory(
    category?.id || '', 
    !!category?.id && isOpen
  );
  
  // Use the latest category data if available, otherwise fall back to the prop
  const displayCategory = latestCategory || category;

  // Debug logging (remove in production)
  console.log('CategoryUnifiedModal Debug:', {
    categoryId: category?.id,
    isOpen,
    hasLatestCategory: !!latestCategory,
    hasCategory: !!category,
    isLoadingCategory,
    displayCategory: displayCategory ? {
      id: displayCategory.id,
      title: displayCategory.title,
      hasCreatedAt: !!displayCategory.createdAt,
      hasUpdatedAt: !!displayCategory.updatedAt,
      hasDescription: !!displayCategory.description,
      hasImage: !!displayCategory.image
    } : null
  });

  if (!displayCategory) return null;

  // Show loading state if we're fetching full category data
  if (isLoadingCategory && !latestCategory) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Loading Category...">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading category details...</span>
        </div>
      </Modal>
    );
  }

  const handleEdit = () => {
    setMode('edit');
  };

  const handleCancel = () => {
    setMode('view');
  };

  const handleSave = async (data: CreateCategoryFormData | UpdateCategoryFormData) => {
    await onUpdate(data as UpdateCategoryFormData);
    setMode('view');
  };

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Category Details">
      <div className="space-y-6">
        {mode === 'view' ? (
          <>
            {/* Row 1: Header Section (Facebook Post Style) */}
            <div className="space-y-4">
              {/* Top Row: Image, Title, Badges, Actions */}
              <div className="flex items-start gap-4">
                {/* Category Image */}
                <div className="flex-shrink-0">
                  {displayCategory.image ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                      <Image 
                        src={displayCategory.image} 
                        alt={displayCategory.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Title and Badges */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h2 className="text-xl font-bold truncate">{displayCategory.title}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getStatusColor(displayCategory.status)}>
                        {displayCategory.status}
                      </Badge>
                      {displayCategory.hasChildren && (
                        <Badge variant="outline" className="text-xs">
                          Has Children
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleStatus(displayCategory)}
                    className="hidden sm:flex"
                  >
                    {displayCategory.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(displayCategory)}
                  >
                    <Trash2 className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>

              {/* Meta Information Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  <span>Level {displayCategory.level}</span>
                </div>
                {displayCategory.parentTitle && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Parent: {displayCategory.parentTitle}</span>
                  </div>
                )}
                {displayCategory.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created {formatDistanceToNow(new Date(displayCategory.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs">ID: {displayCategory.id}</span>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex items-center gap-2 sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(displayCategory)}
                  className="flex-1"
                >
                  {displayCategory.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Row 2: Description Section (Facebook Post Content Style) */}
            {displayCategory.description && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <div 
                  className="prose prose-sm max-w-none text-gray-900 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: displayCategory.description }}
                />
              </div>
            )}

            {/* Additional Details - Only show if no description or for technical details */}
            {!displayCategory.description && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Additional Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(displayCategory.status)}>
                        {displayCategory.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Level:</span>
                      <span>{displayCategory.level}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Has Children:</span>
                      <span>{displayCategory.hasChildren ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  
                  {(displayCategory.createdAt || displayCategory.updatedAt) && (
                    <div className="space-y-2">
                      {displayCategory.createdAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Created:</span>
                          <span>{new Date(displayCategory.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      {displayCategory.updatedAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Updated:</span>
                          <span>{new Date(displayCategory.updatedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Edit Mode */
          <div className="space-y-4">
            <CategoryForm
              category={displayCategory}
              onSubmit={handleSave}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
