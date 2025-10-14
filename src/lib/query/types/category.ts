/**
 * Category specific types based on actual API
 */

export interface Category {
  id: string;
  title: string;
  description?: string;
  image?: string;
  status: 'ACTIVE' | 'INACTIVE';
  parentId?: string;
  parentTitle?: string;
  level: number;
  hasChildren: boolean;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  title: string;
  description?: string;
  image?: File;
  parentId?: string;
}

export interface UpdateCategoryRequest {
  title?: string;
  description?: string;
  image?: File;
  status?: 'ACTIVE' | 'INACTIVE';
  parentId?: string;
}

export interface CategoryFilters {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface CategoryHierarchy extends Category {
  children: Category[];
}

export interface CategoryOption {
  id: string;
  title: string;
}
