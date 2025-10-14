/**
 * Category Tree Content Component
 * Displays categories in a collapsible tree structure
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Folder,
  FolderOpen
} from 'lucide-react';
import Image from 'next/image';
import { Category } from '@/lib/query/types';
import { useCategoryTree } from '@/lib/query';

interface CategoryTreeContentProps {
  onCategorySelect: (category: Category) => void;
  onCategoryEdit: (category: Category) => void;
  onCategoryDelete: (category: Category) => void;
  onCreateSubcategory: (parentCategory: Category) => void;
}

interface TreeNodeProps {
  category: Category;
  level: number;
  isExpanded: boolean;
  onToggle: (categoryId: string) => void;
  onCategorySelect: (category: Category) => void;
  onCategoryEdit: (category: Category) => void;
  onCategoryDelete: (category: Category) => void;
  onCreateSubcategory: (parentCategory: Category) => void;
}

function TreeNode({
  category,
  level,
  isExpanded,
  onToggle,
  onCategorySelect,
  onCategoryEdit,
  onCategoryDelete,
  onCreateSubcategory
}: TreeNodeProps) {
  const hasChildren = category.children && category.children.length > 0;
  const indentLevel = level * 24; // 24px per level

  return (
    <div className="w-full">
      {/* Category Node */}
      <div 
        className={`
          flex items-center gap-3 p-3 rounded-lg transition-colors
          ${category.status === 'INACTIVE' 
            ? 'bg-gray-50 border border-gray-200' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'
          }
        `}
        style={{ marginLeft: `${indentLevel}px` }}
      >
        {/* Expand/Collapse Button */}
        <div className="flex-shrink-0">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onToggle(category.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="h-6 w-6" /> // Spacer for alignment
          )}
        </div>

        {/* Category Icon */}
        <div className="flex-shrink-0">
          {category.image ? (
            <div className="relative h-8 w-8 rounded-md overflow-hidden">
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center">
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-gray-600" />
              ) : (
                <Folder className="h-4 w-4 text-gray-600" />
              )}
            </div>
          )}
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium truncate ${
              category.status === 'INACTIVE' ? 'text-gray-500' : 'text-gray-900'
            }`}>
              {category.title}
            </h3>
            <Badge 
              variant={category.status === 'ACTIVE' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {category.status}
            </Badge>
          </div>
          {category.description && (
            <p className={`text-sm truncate ${
              category.status === 'INACTIVE' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {category.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Add Subcategory Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onCreateSubcategory(category)}
            title="Add subcategory"
          >
            <Plus className="h-4 w-4" />
          </Button>

          {/* View Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onCategorySelect(category)}
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Edit Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onCategoryEdit(category)}
            title="Edit category"
          >
            <Edit className="h-4 w-4" />
          </Button>


          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onCategoryDelete(category)}
            title="Delete category"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {category.children!.map((child) => (
            <TreeNode
              key={child.id}
              category={child}
              level={level + 1}
              isExpanded={false} // Children start collapsed
              onToggle={onToggle}
              onCategorySelect={onCategorySelect}
              onCategoryEdit={onCategoryEdit}
              onCategoryDelete={onCategoryDelete}
              onCreateSubcategory={onCreateSubcategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryTreeContent({
  onCategorySelect,
  onCategoryEdit,
  onCategoryDelete,
  onCreateSubcategory
}: CategoryTreeContentProps) {
  const { data: categories, isLoading, error } = useCategoryTree();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const handleToggle = (categoryId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Tree</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-8 w-8 rounded" />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Tree</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load category tree. Please try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Tree</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Start by creating your first category.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Category Tree
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <TreeNode
            key={category.id}
            category={category}
            level={0}
            isExpanded={expandedNodes.has(category.id)}
            onToggle={handleToggle}
            onCategorySelect={onCategorySelect}
            onCategoryEdit={onCategoryEdit}
            onCategoryDelete={onCategoryDelete}
            onCreateSubcategory={onCreateSubcategory}
          />
        ))}
      </CardContent>
    </Card>
  );
}
