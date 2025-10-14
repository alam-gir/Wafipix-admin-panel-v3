/**
 * Query key factory functions
 */

import { QueryKeys } from '../types';

export const queryKeys: QueryKeys = {
  categories: {
    all: ['categories'],
    lists: () => [...queryKeys.categories.all, 'list'],
    list: (filters) => [...queryKeys.categories.lists(), filters],
    details: () => [...queryKeys.categories.all, 'detail'],
    detail: (id) => [...queryKeys.categories.details(), id],
    options: () => [...queryKeys.categories.all, 'options'],
    parentOptions: (categoryId) => [...queryKeys.categories.all, 'parentOptions', categoryId],
    tree: () => [...queryKeys.categories.all, 'tree'],
    maxLevel: () => [...queryKeys.categories.all, 'maxLevel'],
  },
};
