/**
 * Category List Item Component
 */

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import Image from 'next/image';
import { Category } from '@/lib/query/types';
import { formatDistanceToNow } from 'date-fns';

interface CategoryListItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onView: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
}

export function CategoryListItem({ 
  category, 
  onEdit, 
  onDelete, 
  onView, 
  onToggleStatus 
}: CategoryListItemProps) {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getLevelIndent = (level: number) => {
    return level * 20; // 20px per level
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${
      category.status === 'INACTIVE' 
        ? 'bg-gray-50 border-gray-200 opacity-75' 
        : 'bg-white'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              {/* Level Indentation */}
              {category.level > 0 && (
                <div 
                  className="flex items-center text-muted-foreground"
                  style={{ marginLeft: `${getLevelIndent(category.level)}px` }}
                >
                  <ChevronRight className="h-4 w-4" />
                </div>
              )}
              
              {/* Category Icon */}
              <div className="flex-shrink-0">
                {category.image ? (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                    <Image 
                      src={category.image} 
                      alt={category.title}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Category Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold text-lg truncate ${
                    category.status === 'INACTIVE' ? 'text-gray-500' : ''
                  }`}>
                    {category.title}
                  </h3>
                  <Badge className={getStatusColor(category.status)}>
                    {category.status}
                  </Badge>
                  {category.hasChildren && (
                    <Badge variant="outline" className="text-xs">
                      Has Children
                    </Badge>
                  )}
                </div>
                
                {category.description && (
                  <p className={`text-sm line-clamp-2 mb-2 ${
                    category.status === 'INACTIVE' ? 'text-gray-400' : 'text-muted-foreground'
                  }`}>
                    {category.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Level: {category.level}</span>
                  {category.parentTitle && (
                    <span>Parent: {category.parentTitle}</span>
                  )}
                  {category.createdAt && (
                    <span>Created: {formatDistanceToNow(new Date(category.createdAt), { addSuffix: true })}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(category)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(category)}
            >
              {category.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              
              {showActions && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onEdit(category);
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Category
                    </button>
                    <button
                      onClick={() => {
                        onDelete(category);
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Category
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
