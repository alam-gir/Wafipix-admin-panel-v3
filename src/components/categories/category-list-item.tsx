/**
 * Category List Item Component
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  FolderOpen
} from 'lucide-react';
import Image from 'next/image';
import { Category } from '@/lib/query/types';

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

  return (
    <div className={`group border rounded-lg transition-all duration-200 hover:shadow-sm ${
      category.status === 'INACTIVE' 
        ? 'bg-gray-50/50 border-gray-200' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="p-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Category Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Category Icon */}
            <div className="flex-shrink-0 relative">
              {category.image ? (
                <div className="relative w-8 h-8 rounded-md overflow-hidden bg-gray-100">
                  <Image 
                    src={category.image} 
                    alt={category.title}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                  <FolderOpen className="h-4 w-4 text-gray-500" />
                </div>
              )}
              {/* Status Indicator - positioned relative to icon */}
              <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                category.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>

            {/* Category Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-medium text-sm truncate ${
                  category.status === 'INACTIVE' ? 'text-gray-500' : 'text-gray-900'
                }`}>
                  {category.title}
                </h3>
                {/* Children Badge - only show if has children */}
                {category.hasChildren && category.children && category.children.length > 0 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {category.children.length} children
                  </Badge>
                )}
              </div>
              
              {/* Metadata */}
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <span>Level {category.level}</span>
                {category.parentTitle && (
                  <>
                    <span>•</span>
                    <span className="truncate">Parent: {category.parentTitle}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1 ml-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              onClick={() => onView(category)}
              title="View details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              onClick={() => onToggleStatus(category)}
              title={category.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
            >
              {category.status === 'ACTIVE' ? (
                <div className="h-2 w-2 rounded-full bg-green-500" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-gray-400" />
              )}
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                onClick={() => setShowActions(!showActions)}
                title="More actions"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
              
              {showActions && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg border z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onEdit(category);
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete(category);
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
