/**
 * Query and Mutation types
 */

import { QueryKey, MutationKey } from '@tanstack/react-query';

export interface QueryKeys {
  categories: {
    all: ['categories'];
    lists: () => [...QueryKey, 'list'];
    list: (filters: Record<string, unknown>) => [...QueryKey, 'list', typeof filters];
    details: () => [...QueryKey, 'detail'];
    detail: (id: string) => [...QueryKey, 'detail', string];
    options: () => [...QueryKey, 'options'];
    parentOptions: (categoryId: string) => [...QueryKey, 'parentOptions', string];
    tree: () => [...QueryKey, 'tree'];
    maxLevel: () => [...QueryKey, 'maxLevel'];
  };
}

export interface MutationKeys {
  categories: {
    create: ['categories', 'create'];
    update: (id: string) => ['categories', 'update', string];
    delete: (id: string) => ['categories', 'delete', string];
  };
}
