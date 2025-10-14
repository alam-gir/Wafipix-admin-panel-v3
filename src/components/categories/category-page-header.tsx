/**
 * Category Page Header Component
 * Handles page title, view mode toggle, and create button
 */

'use client';

import { Button } from '@/components/ui/button';
import { Plus, List, TreePine } from 'lucide-react';

type ViewMode = 'list' | 'tree';

interface CategoryPageHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateCategory: () => void;
}

export function CategoryPageHeader({
  viewMode,
  onViewModeChange,
  onCreateCategory
}: CategoryPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Category Management</h1>
        <p className="text-muted-foreground">
          Manage your product categories and hierarchy
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* View Mode Toggle */}
        <div className="flex items-center border rounded-lg">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === 'tree' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('tree')}
          >
            <TreePine className="h-4 w-4 mr-2" />
            Tree
          </Button>
        </div>

        {/* Create Button */}
        <Button onClick={onCreateCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Create Category
        </Button>
      </div>
    </div>
  );
}
