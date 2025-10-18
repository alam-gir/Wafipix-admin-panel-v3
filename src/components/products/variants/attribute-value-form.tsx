/**
 * AttributeValueForm Component - Form for creating new attribute values
 */

import React from 'react';
import { VariantAttributeValueFormField } from './variant-attribute-value-form-field';

interface AttributeValue {
  value: string;
  imageUrl?: string;
  imageFile?: File;
  previewUrl?: string;
  isSaving?: boolean;
  isEditing?: boolean;
  originalValue?: string;
}

interface AttributeValueFormProps {
  attributeId: string;
  attributeType: 'TEXT' | 'IMAGE' | 'NUMBER';
  attributeValues: AttributeValue[];
  onValueChange: (index: number, field: 'value' | 'imageUrl' | 'imageFile', value: string | File) => void;
  onRemoveValue: (index: number) => void;
  onSaveValue: (index: number) => void;
}

export const AttributeValueForm: React.FC<AttributeValueFormProps> = ({
  attributeId,
  attributeType,
  attributeValues,
  onValueChange,
  onRemoveValue,
  onSaveValue,
}) => {
  const values = attributeValues[attributeId] || [];

  if (values.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {values.map((value, index) => (
        <VariantAttributeValueFormField
          key={index}
          value={value.value}
          imageUrl={value.imageUrl}
          previewUrl={value.previewUrl}
          attributeType={attributeType}
          onValueChange={(val) => onValueChange(index, 'value', val)}
          onImageChange={(file) => {
            if (file) {
              onValueChange(index, 'imageFile', file);
            }
          }}
          onDelete={() => onRemoveValue(index)}
          onSave={() => onSaveValue(index)}
          isSaving={value.isSaving}
        />
      ))}
    </div>
  );
};
