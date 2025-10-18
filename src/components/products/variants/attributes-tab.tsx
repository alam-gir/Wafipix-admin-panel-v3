/**
 * AttributesTab Component - Main tab for managing attributes
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { AttributeForm } from './attribute-form';
import { AttributeCard } from './attribute-card';
import { useAttributeManagement } from '@/lib/hooks/use-attribute-management';

interface Attribute {
  id: string;
  name: string;
  attributeType: 'TEXT' | 'IMAGE' | 'NUMBER';
  values: Array<{
    id: string;
    value: string;
    imageUrl?: string;
  }>;
}

interface AttributesTabProps {
  productId: string;
  attributes: Attribute[];
  onUpdate?: () => void;
}

export const AttributesTab: React.FC<AttributesTabProps> = ({
  productId,
  attributes,
  onUpdate,
}) => {
  const {
    error,
    newAttribute,
    setNewAttribute,
    editingAttribute,
    editingAttributeData,
    setEditingAttributeData,
    attributeValues,
    editingValues,
    setEditingValues,
    createAttributeMutation,
    updateAttributeMutation,
    deleteAttributeMutation,
    updateAttributeValueMutation,
    deleteAttributeValueMutation,
    handleCreateAttribute,
    handleEditAttribute,
    handleUpdateAttribute,
    handleCancelEditAttribute,
    handleDeleteAttribute,
    handleAddAttributeValue,
    handleUpdateAttributeValue,
    handleRemoveAttributeValue,
    handleSaveAttributeValue,
    handleEditAttributeValue,
    handleUpdateAttributeValueInEdit,
    handleCancelEditAttributeValue,
    handleDeleteAttributeValue,
  } = useAttributeManagement(productId, onUpdate);

  const handleEditingValueChange = (attributeId: string, valueId: string, value: string) => {
    setEditingValues(prev => ({
      ...prev,
      [attributeId]: {
        ...prev[attributeId],
        [valueId]: { ...prev[attributeId]?.[valueId], value },
      },
    }));
  };

  const handleEditingImageChange = (attributeId: string, valueId: string, file: File) => {
    setEditingValues(prev => ({
      ...prev,
      [attributeId]: {
        ...prev[attributeId],
        [valueId]: { ...prev[attributeId]?.[valueId], imageUrl: file.name },
      },
    }));
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Create New Attribute */}
      <AttributeForm
        newAttribute={newAttribute}
        setNewAttribute={setNewAttribute}
        onCreateAttribute={handleCreateAttribute}
        isCreating={createAttributeMutation.isPending}
      />

      {/* Existing Attributes */}
      <div className="space-y-4">
        {attributes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Attributes Yet</h3>
              <p className="text-gray-500">Create your first attribute to get started with variants.</p>
            </CardContent>
          </Card>
        ) : (
          attributes.map((attr) => (
            <AttributeCard
              key={attr.id}
              attribute={attr}
              editingAttribute={editingAttribute}
              editingAttributeData={editingAttributeData}
              editingValues={editingValues}
              attributeValues={attributeValues}
              onEditAttribute={handleEditAttribute}
              onUpdateAttribute={handleUpdateAttribute}
              onCancelEditAttribute={handleCancelEditAttribute}
              onDeleteAttribute={handleDeleteAttribute}
              onAddValue={handleAddAttributeValue}
              onEditValue={handleEditAttributeValue}
              onDeleteValue={handleDeleteAttributeValue}
              onUpdateValue={handleUpdateAttributeValueInEdit}
              onCancelEditValue={handleCancelEditAttributeValue}
              onValueChange={handleUpdateAttributeValue}
              onRemoveValue={handleRemoveAttributeValue}
              onSaveValue={handleSaveAttributeValue}
              onEditingValueChange={handleEditingValueChange}
              onEditingImageChange={handleEditingImageChange}
              setEditingAttributeData={setEditingAttributeData}
              isUpdating={updateAttributeMutation.isPending}
              isDeleting={deleteAttributeMutation.isPending}
              isUpdatingValue={updateAttributeValueMutation.isPending}
              isDeletingValue={deleteAttributeValueMutation.isPending}
            />
          ))
        )}
      </div>
    </div>
  );
};
