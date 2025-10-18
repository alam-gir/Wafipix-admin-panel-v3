/**
 * AttributeForm Component - For creating and editing attributes
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VariantAttributeFormField } from '@/components/products/variants/variant-attribute-form-field';

interface AttributeFormProps {
  newAttribute: {
    name: string;
    attributeType: 'TEXT' | 'IMAGE' | 'NUMBER';
  };
  setNewAttribute: (attr: { name: string; attributeType: 'TEXT' | 'IMAGE' | 'NUMBER' }) => void;
  onCreateAttribute: () => void;
  isCreating: boolean;
}

export const AttributeForm: React.FC<AttributeFormProps> = ({
  newAttribute,
  setNewAttribute,
  onCreateAttribute,
  isCreating,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Attribute</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <VariantAttributeFormField
          name={newAttribute.name}
          attributeType={newAttribute.attributeType}
          onNameChange={(name) => setNewAttribute({ ...newAttribute, name })}
          onTypeChange={(type) => setNewAttribute({ ...newAttribute, attributeType: type })}
          onDelete={() => setNewAttribute({ name: '', attributeType: 'TEXT' })}
        />
        <Button
          onClick={onCreateAttribute}
          disabled={isCreating || !newAttribute.name.trim()}
          className="w-full"
        >
          {isCreating ? 'Creating...' : 'Create Attribute'}
        </Button>
      </CardContent>
    </Card>
  );
};
