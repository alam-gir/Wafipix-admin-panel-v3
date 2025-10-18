/**
 * AttributeCard Component - Individual attribute card with all management functionality
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { VariantAttributeFormField } from './variant-attribute-form-field';
import { AttributeValueList } from './attribute-value-list';
import { AttributeValueForm } from './attribute-value-form';

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

interface EditingValue {
  value: string;
  imageUrl?: string;
}

interface AttributeValue {
  value: string;
  imageUrl?: string;
  imageFile?: File;
  previewUrl?: string;
  isSaving?: boolean;
  isEditing?: boolean;
  originalValue?: string;
}

interface AttributeCardProps {
  attribute: Attribute;
  editingAttribute: string | null;
  editingAttributeData: {
    name: string;
    attributeType: 'TEXT' | 'IMAGE' | 'NUMBER';
  };
  editingValues: Record<string, Record<string, EditingValue>>;
  attributeValues: Record<string, Array<AttributeValue>>;
  onEditAttribute: (attributeId: string, attribute: { name: string; attributeType: 'TEXT' | 'IMAGE' | 'NUMBER' }) => void;
  onUpdateAttribute: () => void;
  onCancelEditAttribute: () => void;
  onDeleteAttribute: (attributeId: string, attributeName: string) => void;
  onAddValue: (attributeId: string) => void;
  onEditValue: (attributeId: string, valueId: string, value: string, imageUrl?: string) => void;
  onDeleteValue: (attributeId: string, valueId: string, value: string) => void;
  onUpdateValue: (attributeId: string, valueId: string) => void;
  onCancelEditValue: (attributeId: string, valueId: string) => void;
  onValueChange: (attributeId: string, index: number, field: 'value' | 'imageUrl' | 'imageFile', value: string | File) => void;
  onRemoveValue: (attributeId: string, index: number) => void;
  onSaveValue: (attributeId: string, index: number) => void;
  onEditingValueChange: (attributeId: string, valueId: string, value: string) => void;
  onEditingImageChange: (attributeId: string, valueId: string, file: File) => void;
  setEditingAttributeData: (data: { name: string; attributeType: 'TEXT' | 'IMAGE' | 'NUMBER' }) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isUpdatingValue: boolean;
  isDeletingValue: boolean;
}

export const AttributeCard: React.FC<AttributeCardProps> = ({
  attribute,
  editingAttribute,
  editingAttributeData,
  editingValues,
  attributeValues,
  onEditAttribute,
  onUpdateAttribute,
  onCancelEditAttribute,
  onDeleteAttribute,
  onAddValue,
  onEditValue,
  onDeleteValue,
  onUpdateValue,
  onCancelEditValue,
  onValueChange,
  onRemoveValue,
  onSaveValue,
  onEditingValueChange,
  onEditingImageChange,
  setEditingAttributeData,
  isUpdating,
  isDeleting,
  isUpdatingValue,
  isDeletingValue,
}) => {
  const isEditing = editingAttribute === attribute.id;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex-1 space-y-2">
              <VariantAttributeFormField
                name={editingAttributeData.name}
                attributeType={editingAttributeData.attributeType}
                onNameChange={(name) => setEditingAttributeData({ ...editingAttributeData, name })}
                onTypeChange={(type) => setEditingAttributeData({ ...editingAttributeData, attributeType: type })}
                onDelete={onCancelEditAttribute}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={onUpdateAttribute}
                  disabled={isUpdating || !editingAttributeData.name.trim()}
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCancelEditAttribute}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {attribute.name}
                  <Badge variant="outline">{attribute.attributeType}</Badge>
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {attribute.values.length} value{attribute.values.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditAttribute(attribute.id, { name: attribute.name, attributeType: attribute.attributeType })}
                  className="h-8 w-8 p-0"
                  title="Edit Attribute"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAddValue(attribute.id)}
                  className="h-8 w-8 p-0"
                  title="Add Value"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeleteAttribute(attribute.id, attribute.name)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  disabled={isDeleting}
                  title="Delete Attribute"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Values */}
        <AttributeValueList
          values={attribute.values}
          attributeType={attribute.attributeType}
          editingValues={editingValues[attribute.id] || {}}
          onEditValue={(valueId, value, imageUrl) => onEditValue(attribute.id, valueId, value, imageUrl)}
          onDeleteValue={(valueId, value) => onDeleteValue(attribute.id, valueId, value)}
          onUpdateValue={(valueId) => onUpdateValue(attribute.id, valueId)}
          onCancelEditValue={(valueId) => onCancelEditValue(attribute.id, valueId)}
          onValueChange={(valueId, value) => onEditingValueChange(attribute.id, valueId, value)}
          onImageChange={(valueId, file) => onEditingImageChange(attribute.id, valueId, file)}
          isUpdating={isUpdatingValue}
          isDeleting={isDeletingValue}
        />

        {/* New Values */}
        <AttributeValueForm
          attributeId={attribute.id}
          attributeType={attribute.attributeType}
          attributeValues={attributeValues}
          onValueChange={(index, field, value) => onValueChange(attribute.id, index, field, value)}
          onRemoveValue={(index) => onRemoveValue(attribute.id, index)}
          onSaveValue={(index) => onSaveValue(attribute.id, index)}
        />
      </CardContent>
    </Card>
  );
};
