/**
 * Product Specifications Management Component - Dedicated component for managing product specifications
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useProductSpecifications } from '@/lib/query/hooks/product-queries';
import { useCreateProductSpecification, useUpdateProductSpecification, useDeleteProductSpecification } from '@/lib/query/hooks/product-mutations';
import type { Product } from '@/lib/api/types/product';

interface ProductSpecificationsManagementProps {
  product: Product;
  onUpdate?: () => void;
}

export const ProductSpecificationsManagement: React.FC<ProductSpecificationsManagementProps> = ({ 
  product, 
  onUpdate 
}) => {
  const [error, setError] = useState<string | null>(null);
  const [editingSpec, setEditingSpec] = useState<string | null>(null);
  const [newSpec, setNewSpec] = useState({ name: '', value: '' });

  const { data: specifications = [] } = useProductSpecifications(product.id);
  const createSpecificationMutation = useCreateProductSpecification();
  const updateSpecificationMutation = useUpdateProductSpecification();
  const deleteSpecificationMutation = useDeleteProductSpecification();

  const handleCreateSpecification = async () => {
    if (!newSpec.name.trim() || !newSpec.value.trim()) {
      setError('Both name and value are required');
      return;
    }

    try {
      setError(null);
      await createSpecificationMutation.mutateAsync({
        productId: product.id,
        data: {
          name: newSpec.name,
          value: newSpec.value,
        },
      });
      setNewSpec({ name: '', value: '' });
      onUpdate?.();
    } catch (error: unknown) {
      console.error('Failed to create specification:', error);
      setError('Failed to create specification. Please try again.');
    }
  };

  const handleUpdateSpecification = async (specificationId: string, name: string, value: string) => {
    try {
      setError(null);
      await updateSpecificationMutation.mutateAsync({
        productId: product.id,
        specificationId,
        data: { name, value },
      });
      setEditingSpec(null);
      onUpdate?.();
    } catch (error: unknown) {
      console.error('Failed to update specification:', error);
      setError('Failed to update specification. Please try again.');
    }
  };

  const handleDeleteSpecification = async (specificationId: string) => {
    if (window.confirm('Are you sure you want to delete this specification?')) {
      try {
        setError(null);
        await deleteSpecificationMutation.mutateAsync({
          productId: product.id,
          specificationId,
        });
        onUpdate?.();
      } catch (error: unknown) {
        console.error('Failed to delete specification:', error);
        setError('Failed to delete specification. Please try again.');
      }
    }
  };

  const SpecificationItem: React.FC<{ spec: any }> = ({ spec }) => {
    const [editName, setEditName] = useState(spec.name);
    const [editValue, setEditValue] = useState(spec.value);

    if (editingSpec === spec.id) {
      return (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Specification name"
              className="mb-2"
            />
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Specification value"
            />
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={() => handleUpdateSpecification(spec.id, editName, editValue)}
              disabled={updateSpecificationMutation.isPending}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditingSpec(null);
                setEditName(spec.name);
                setEditValue(spec.value);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex-1">
          <div className="font-medium text-sm">{spec.name}</div>
          <div className="text-gray-600 text-sm">{spec.value}</div>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditingSpec(spec.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteSpecification(spec.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Add New Specification */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Specification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="spec-name">Name</Label>
              <Input
                id="spec-name"
                value={newSpec.name}
                onChange={(e) => setNewSpec(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Material, Weight, Dimensions"
              />
            </div>
            <div>
              <Label htmlFor="spec-value">Value</Label>
              <Input
                id="spec-value"
                value={newSpec.value}
                onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                placeholder="e.g., Cotton, 500g, 30x20x2cm"
              />
            </div>
          </div>
          <Button
            onClick={handleCreateSpecification}
            disabled={createSpecificationMutation.isPending}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {createSpecificationMutation.isPending ? 'Adding...' : 'Add Specification'}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Product Specifications ({specifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {specifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No specifications added yet.</p>
              <p className="text-sm text-gray-400">Add specifications to provide detailed product information.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {specifications.map((spec) => (
                <SpecificationItem key={spec.id} spec={spec} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


