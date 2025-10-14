/**
 * Unified Category Modal Component
 * Handles both viewing and editing categories in a single modal
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Category Image */}
                <div className="flex-shrink-0">
                  {displayCategory.image ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <Image 
                        src={displayCategory.image} 
                        alt={displayCategory.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FolderOpen className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold truncate">{displayCategory.title}</h2>
                    <Badge className={getStatusColor(displayCategory.status)}>
                      {displayCategory.status}
                    </Badge>
                    {displayCategory.hasChildren && (
                      <Badge variant="outline" className="text-xs">
                        Has Children
                      </Badge>
                    )}
                  </div>
                  
                  {displayCategory.description && (
                    <p className="text-muted-foreground mb-3">
                      {displayCategory.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(displayCategory)}
                >
                  {displayCategory.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(displayCategory)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <Separator />

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Category Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono text-sm">{displayCategory.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(displayCategory.status)}>
                      {displayCategory.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level:</span>
                    <span>{displayCategory.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Has Children:</span>
                    <span>{displayCategory.hasChildren ? 'Yes' : 'No'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Timestamps - Only show if we have timestamp data */}
              {(displayCategory.createdAt || displayCategory.updatedAt) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Timestamps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {displayCategory.createdAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="text-sm">
                          {new Date(displayCategory.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {displayCategory.updatedAt && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Updated:</span>
                          <span className="text-sm">
                            {new Date(displayCategory.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Updated:</span>
                          <span className="text-sm">
                            {formatDistanceToNow(new Date(displayCategory.updatedAt), { addSuffix: true })}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
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
