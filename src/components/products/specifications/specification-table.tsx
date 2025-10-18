/**
 * Specification Table Component - Table-based specification management with live preview
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProductSpecifications } from '@/lib/query/hooks/product-queries';
import { useCreateProductSpecification, useUpdateProductSpecification, useDeleteProductSpecification } from '@/lib/query/hooks/product-mutations';
import type { ProductSpecification } from '@/lib/api/types/product';

interface SpecificationTableProps {
  productId: string;
  onUpdate?: () => void;
}

interface EditingSpec {
  id: string;
  name: string;
  value: string;
}

export const SpecificationTable: React.FC<SpecificationTableProps> = ({
  productId,
  onUpdate,
}) => {
  const [editingSpec, setEditingSpec] = useState<EditingSpec | null>(null);
  const [newSpec, setNewSpec] = useState({ name: '', value: '' });
  const [isAdding, setIsAdding] = useState(false);

  // Data fetching
  const { data: specifications = [], isLoading } = useProductSpecifications(productId);

  // Mutations
  const createSpecificationMutation = useCreateProductSpecification();
  const updateSpecificationMutation = useUpdateProductSpecification();
  const deleteSpecificationMutation = useDeleteProductSpecification();

  const handleEdit = (spec: ProductSpecification) => {
    setEditingSpec({
      id: spec.id,
      name: spec.name,
      value: spec.value,
    });
  };

  const handleSave = async (spec: ProductSpecification) => {
    if (!editingSpec) return;

    try {
      await updateSpecificationMutation.mutateAsync({
        productId,
        specificationId: spec.id,
        data: {
          name: editingSpec.name,
          value: editingSpec.value,
        },
      });
      setEditingSpec(null);
      onUpdate?.();
    } catch (error) {
      console.error('Failed to update specification:', error);
    }
  };

  const handleCancel = () => {
    setEditingSpec(null);
  };

  const handleDelete = async (spec: ProductSpecification) => {
    if (window.confirm(`Are you sure you want to delete "${spec.name}"?`)) {
      try {
        await deleteSpecificationMutation.mutateAsync({
          productId,
          specificationId: spec.id,
        });
        onUpdate?.();
      } catch (error) {
        console.error('Failed to delete specification:', error);
      }
    }
  };

  const handleAddNew = async () => {
    if (!newSpec.name.trim() || !newSpec.value.trim()) return;

    try {
      await createSpecificationMutation.mutateAsync({
        productId,
        data: {
          name: newSpec.name.trim(),
          value: newSpec.value.trim(),
        },
      });
      setNewSpec({ name: '', value: '' });
      setIsAdding(false);
      onUpdate?.();
    } catch (error) {
      console.error('Failed to create specification:', error);
    }
  };

  const handleCancelAdd = () => {
    setNewSpec({ name: '', value: '' });
    setIsAdding(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading specifications...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Specifications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Product Specifications</span>
            <Badge variant="outline">{specifications.length} specifications</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specifications.map((spec) => (
                <TableRow key={spec.id}>
                  <TableCell>
                    {editingSpec?.id === spec.id ? (
                      <Input
                        value={editingSpec.name}
                        onChange={(e) => setEditingSpec(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="h-8"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium">{spec.name}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingSpec?.id === spec.id ? (
                      <Input
                        value={editingSpec.value}
                        onChange={(e) => setEditingSpec(prev => prev ? { ...prev, value: e.target.value } : null)}
                        className="h-8"
                      />
                    ) : (
                      <span>{spec.value}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingSpec?.id === spec.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSave(spec)}
                          disabled={updateSpecificationMutation.isPending}
                          className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancel}
                          className="h-7 w-7 p-0 text-gray-600 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(spec)}
                          className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(spec)}
                          disabled={deleteSpecificationMutation.isPending}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {/* Add New Specification Row */}
              {isAdding ? (
                <TableRow className="bg-blue-50">
                  <TableCell>
                    <Input
                      value={newSpec.name}
                      onChange={(e) => setNewSpec(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Specification name"
                      className="h-8"
                      autoFocus
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={newSpec.value}
                      onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Specification value"
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleAddNew}
                        disabled={createSpecificationMutation.isPending || !newSpec.name.trim() || !newSpec.value.trim()}
                        className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelAdd}
                        className="h-7 w-7 p-0 text-gray-600 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow className="hover:bg-gray-50">
                  <TableCell colSpan={3}>
                    <Button
                      variant="ghost"
                      onClick={() => setIsAdding(true)}
                      className="w-full h-8 text-gray-600 hover:text-gray-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add new specification
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
