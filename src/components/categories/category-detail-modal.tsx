/**
 * Category Detail Modal Component
 */

'use client';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  FolderOpen, 
  Edit, 
  Trash2,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { Category } from '@/lib/query/types';
import { formatDistanceToNow } from 'date-fns';

interface CategoryDetailModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
}

export function CategoryDetailModal({
  category,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus
}: CategoryDetailModalProps) {
  if (!category) return null;

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Category Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Category Image */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {category.image ? (
                <Image 
                  src={category.image} 
                  alt={category.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FolderOpen className="h-8 w-8 text-gray-500" />
                </div>
              )}
            </div>

            {/* Category Info */}
            <div>
              <h2 className="text-2xl font-bold">{category.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(category.status)}>
                  {category.status}
                </Badge>
                {category.hasChildren && (
                  <Badge variant="outline">
                    Has Children
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(category)}
            >
              {category.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(category)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(category)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <Separator />

        {/* Description */}
        {category.description && (
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        )}

        {/* Category Hierarchy */}
        <div>
          <h3 className="font-semibold mb-3">Category Hierarchy</h3>
          <div className="space-y-2">
            {/* Parent */}
            {category.parentTitle && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Parent:</span>
                <div className="flex items-center gap-1">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{category.parentTitle}</span>
                </div>
              </div>
            )}

            {/* Current Level */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Level:</span>
              <Badge variant="outline">{category.level}</Badge>
            </div>

            {/* Children Indicator */}
            {category.hasChildren && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Has subcategories</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Metadata */}
        <div>
          <h3 className="font-semibold mb-3">Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>{formatDistanceToNow(new Date(category.createdAt), { addSuffix: true })}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Updated:</span>
                <span>{formatDistanceToNow(new Date(category.updatedAt), { addSuffix: true })}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">ID:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {category.id}
                </code>
              </div>
              
              {category.parentId && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Parent ID:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {category.parentId}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
