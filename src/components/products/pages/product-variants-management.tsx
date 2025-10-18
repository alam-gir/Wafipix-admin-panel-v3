/**
 * Product Variants Management Component - Dedicated component for managing product variants
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProductAttributes, useProductVariants } from '@/lib/query/hooks/product-queries';
import { AttributesTab } from '@/components/products/variants/attributes-tab';
import { VariantsTab } from '@/components/products/variants/variants-tab';
import type { Product } from '@/lib/api/types/product';

interface ProductVariantsManagementProps {
  product: Product;
  onUpdate?: () => void;
}

export const ProductVariantsManagement: React.FC<ProductVariantsManagementProps> = ({ 
  product, 
  onUpdate 
}) => {
  const [activeTab, setActiveTab] = useState('attributes');

  // Data fetching
  const { data: attributes = [] } = useProductAttributes(product.id);
  const { data: variants = [] } = useProductVariants(product.id);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>

        <TabsContent value="attributes">
          <AttributesTab
            productId={product.id}
            attributes={attributes}
            onUpdate={onUpdate}
          />
        </TabsContent>

        <TabsContent value="variants">
          <VariantsTab
            productId={product.id}
            variants={variants}
            onNavigateToAttributes={() => setActiveTab('attributes')}
            onUpdate={onUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};


