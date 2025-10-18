/**
 * Product Specifications Management Component - Main component for managing product specifications
 */

import React from 'react';
import { SpecificationTable } from '../specifications/specification-table';
import type { Product } from '@/lib/api/types/product';

interface ProductSpecificationsManagementProps {
  product: Product;
  onUpdate?: () => void;
}

export const ProductSpecificationsManagement: React.FC<ProductSpecificationsManagementProps> = ({
  product,
  onUpdate,
}) => {
  return (
    <SpecificationTable
      productId={product.id}
      onUpdate={onUpdate}
    />
  );
};