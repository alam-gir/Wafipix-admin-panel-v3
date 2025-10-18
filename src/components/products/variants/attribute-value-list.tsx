/**
 * AttributeValueList Component - List of existing attribute values
 */

import React from 'react';
import { AttributeValueCard } from './attribute-value-card';

interface AttributeValue {
  id: string;
  value: string;
  imageUrl?: string;
}

interface EditingValue {
  value: string;
  imageUrl?: string;
}

interface AttributeValueListProps {
  values: AttributeValue[];
  attributeType: 'TEXT' | 'IMAGE' | 'NUMBER';
  editingValues: Record<string, EditingValue>;
  onEditValue: (valueId: string, value: string, imageUrl?: string) => void;
  onDeleteValue: (valueId: string, value: string) => void;
  onUpdateValue: (valueId: string) => void;
  onCancelEditValue: (valueId: string) => void;
  onValueChange: (valueId: string, value: string) => void;
  onImageChange: (valueId: string, file: File) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const AttributeValueList: React.FC<AttributeValueListProps> = ({
  values,
  attributeType,
  editingValues,
  onEditValue,
  onDeleteValue,
  onUpdateValue,
  onCancelEditValue,
  onValueChange,
  onImageChange,
  isUpdating,
  isDeleting,
}) => {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700">Existing Values ({values.length})</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {values.map((value, index) => {
          const isEditing = editingValues[value.id];
          
          return (
            <AttributeValueCard
              key={value.id}
              value={value}
              attributeType={attributeType}
              isEditing={!!isEditing}
              editingData={isEditing}
              onEdit={() => onEditValue(value.id, value.value, value.imageUrl)}
              onDelete={() => onDeleteValue(value.id, value.value)}
              onUpdate={() => onUpdateValue(value.id)}
              onCancel={() => onCancelEditValue(value.id)}
              onValueChange={(val) => onValueChange(value.id, val)}
              onImageChange={(file) => onImageChange(value.id, file)}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
};
