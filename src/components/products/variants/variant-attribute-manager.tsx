/**
 * VariantAttributeManager Component - Manages attributes for a variant
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Image as ImageIcon, Type, Hash } from 'lucide-react';
import { useProductAttributes, useProductAttributeValues } from '@/lib/query/hooks/product-queries';
import Image from 'next/image';

// Internal type for editing (without attributeType requirement)
interface EditingVariantAttributeValue {
  attributeId: string;
  attributeName: string;
  valueId: string;
  value: string;
  imageUrl?: string;
}

interface VariantAttributeManagerProps {
  productId: string;
  variantId: string;
  currentAttributeValues: EditingVariantAttributeValue[];
  onAttributeValuesChange: (values: EditingVariantAttributeValue[]) => void;
  isEditing: boolean;
}

export const VariantAttributeManager: React.FC<VariantAttributeManagerProps> = ({
  productId,
  variantId,
  currentAttributeValues,
  onAttributeValuesChange,
  isEditing,
}) => {
  const [selectedAttributeId, setSelectedAttributeId] = useState<string>('');
  const [selectedValueId, setSelectedValueId] = useState<string>('');

  // Fetch all product attributes
  const { data: attributes = [] } = useProductAttributes(productId);
  
  // Fetch attribute values for the selected attribute
  const { data: attributeValues = [] } = useProductAttributeValues(
    productId, 
    selectedAttributeId, 
    { size: 100 } // Get all values
  );

  // Get available attributes (not already assigned to this variant)
  const availableAttributes = attributes.filter(attr => 
    !currentAttributeValues.some(cav => cav.attributeId === attr.id)
  );

  // Get available values for the selected attribute (not already assigned)
  const availableValues = attributeValues.filter(val => 
    !currentAttributeValues.some(cav => cav.valueId === val.id)
  );

  const handleAddAttribute = () => {
    if (!selectedAttributeId || !selectedValueId) return;

    const selectedAttribute = attributes.find(attr => attr.id === selectedAttributeId);
    const selectedValue = attributeValues.find(val => val.id === selectedValueId);

    if (selectedAttribute && selectedValue) {
      const newAttributeValue: EditingVariantAttributeValue = {
        attributeId: selectedAttribute.id,
        attributeName: selectedAttribute.name,
        valueId: selectedValue.id,
        value: selectedValue.value,
        imageUrl: selectedValue.imageUrl,
      };

      onAttributeValuesChange([...currentAttributeValues, newAttributeValue]);
      
      // Reset selections
      setSelectedAttributeId('');
      setSelectedValueId('');
    }
  };

  const handleRemoveAttribute = (attributeId: string) => {
    onAttributeValuesChange(
      currentAttributeValues.filter(cav => cav.attributeId !== attributeId)
    );
  };

  const getAttributeTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return <ImageIcon className="h-3 w-3" />;
      case 'TEXT':
        return <Type className="h-3 w-3" />;
      case 'NUMBER':
        return <Hash className="h-3 w-3" />;
      default:
        return <Type className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Manage Attributes</h4>
        {/* Current Attributes */}
        {currentAttributeValues.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-700">Current Attributes</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentAttributeValues.map((attrValue) => (
                <div
                  key={attrValue.valueId}
                  className="flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {attrValue.imageUrl && (
                      <div className="relative w-5 h-5 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={attrValue.imageUrl}
                          alt={attrValue.value}
                          fill
                          className="object-cover"
                          sizes="20px"
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {attrValue.attributeName}: <span className="text-gray-900 font-semibold">{attrValue.value}</span>
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAttribute(attrValue.attributeId)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Attribute Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <h5 className="text-sm font-medium text-blue-900">Add New Attribute</h5>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <Select
              value={selectedAttributeId}
              onValueChange={setSelectedAttributeId}
              disabled={availableAttributes.length === 0}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Choose attribute..." />
              </SelectTrigger>
              <SelectContent>
                {availableAttributes.map((attr) => (
                  <SelectItem key={attr.id} value={attr.id}>
                    <div className="flex items-center gap-2">
                      {getAttributeTypeIcon(attr.attributeType)}
                      <span>{attr.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedValueId}
              onValueChange={setSelectedValueId}
              disabled={!selectedAttributeId || availableValues.length === 0}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Choose value..." />
              </SelectTrigger>
              <SelectContent>
                {availableValues.map((val) => (
                  <SelectItem key={val.id} value={val.id}>
                    <div className="flex items-center gap-2">
                      {val.imageUrl && (
                        <div className="relative w-4 h-4 rounded-full overflow-hidden">
                          <Image
                            src={val.imageUrl}
                            alt={val.value}
                            fill
                            className="object-cover"
                            sizes="16px"
                          />
                        </div>
                      )}
                      <span>{val.value}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleAddAttribute}
              disabled={!selectedAttributeId || !selectedValueId}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Attribute
            </Button>
          </div>
        </div>

        {/* No Attributes Available */}
        {isEditing && availableAttributes.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            <p>All available attributes are already assigned to this variant.</p>
            <p className="text-xs mt-1">Create new attributes in the Attributes tab to add more.</p>
          </div>
        )}
      </div>
    </div>
  );
};
