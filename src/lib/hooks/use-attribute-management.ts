/**
 * Custom hook for managing product attributes and their values
 */

import { useState, useEffect } from 'react';
import { 
  useCreateProductAttribute, 
  useUpdateProductAttribute, 
  useDeleteProductAttribute,
  useCreateProductAttributeValue,
  useUpdateProductAttributeValue,
  useDeleteProductAttributeValue
} from '@/lib/query/hooks/product-mutations';

interface AttributeValue {
  value: string;
  imageUrl?: string;
  imageFile?: File;
  previewUrl?: string;
  isSaving?: boolean;
  isEditing?: boolean;
  originalValue?: string;
}

interface EditingValue {
  value: string;
  imageUrl?: string;
}

export const useAttributeManagement = (productId: string, onUpdate?: () => void) => {
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [newAttribute, setNewAttribute] = useState({
    name: '',
    attributeType: 'TEXT' as 'TEXT' | 'IMAGE' | 'NUMBER',
  });

  const [editingAttribute, setEditingAttribute] = useState<string | null>(null);
  const [editingAttributeData, setEditingAttributeData] = useState({
    name: '',
    attributeType: 'TEXT' as 'TEXT' | 'IMAGE' | 'NUMBER',
  });

  const [attributeValues, setAttributeValues] = useState<Record<string, Array<AttributeValue>>>({});
  const [editingValues, setEditingValues] = useState<Record<string, Record<string, EditingValue>>>({});

  // Mutations
  const createAttributeMutation = useCreateProductAttribute();
  const updateAttributeMutation = useUpdateProductAttribute();
  const deleteAttributeMutation = useDeleteProductAttribute();
  const createAttributeValueMutation = useCreateProductAttributeValue();
  const updateAttributeValueMutation = useUpdateProductAttributeValue();
  const deleteAttributeValueMutation = useDeleteProductAttributeValue();

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(attributeValues).forEach(values => {
        values.forEach(value => {
          if (value.previewUrl) {
            URL.revokeObjectURL(value.previewUrl);
          }
        });
      });
    };
  }, [attributeValues]);

  // Attribute management functions
  const handleCreateAttribute = async () => {
    if (!newAttribute.name.trim()) {
      setError('Attribute name is required');
      return;
    }

    try {
      setError(null);
      await createAttributeMutation.mutateAsync({
        productId,
        data: {
          name: newAttribute.name,
          attributeType: newAttribute.attributeType,
        },
      });
      setNewAttribute({ name: '', attributeType: 'TEXT' });
      onUpdate?.();
    } catch (error: unknown) {
      console.error('Failed to create attribute:', error);
      setError('Failed to create attribute. Please try again.');
    }
  };

  const handleEditAttribute = (attributeId: string, attribute: { name: string; attributeType: 'TEXT' | 'IMAGE' | 'NUMBER' }) => {
    setEditingAttribute(attributeId);
    setEditingAttributeData({
      name: attribute.name,
      attributeType: attribute.attributeType,
    });
  };

  const handleUpdateAttribute = async () => {
    if (!editingAttribute || !editingAttributeData.name.trim()) {
      setError('Attribute name is required');
      return;
    }

    try {
      setError(null);
      await updateAttributeMutation.mutateAsync({
        productId,
        attributeId: editingAttribute,
        data: {
          name: editingAttributeData.name,
          attributeType: editingAttributeData.attributeType,
        },
      });
      setEditingAttribute(null);
      setEditingAttributeData({ name: '', attributeType: 'TEXT' });
      onUpdate?.();
    } catch (error: unknown) {
      console.error('Failed to update attribute:', error);
      setError('Failed to update attribute. Please try again.');
    }
  };

  const handleCancelEditAttribute = () => {
    setEditingAttribute(null);
    setEditingAttributeData({ name: '', attributeType: 'TEXT' });
  };

  const handleDeleteAttribute = async (attributeId: string, attributeName: string) => {
    if (!window.confirm(`Are you sure you want to delete the attribute "${attributeName}"? This will also delete all its values.`)) {
      return;
    }

    try {
      setError(null);
      await deleteAttributeMutation.mutateAsync({
        productId,
        attributeId,
      });
      onUpdate?.();
    } catch (error: unknown) {
      console.error('Failed to delete attribute:', error);
      setError('Failed to delete attribute. Please try again.');
    }
  };

  // Attribute value management functions
  const handleAddAttributeValue = (attributeId: string) => {
    const newValue = {
      value: '',
      imageUrl: '',
      imageFile: undefined,
      previewUrl: undefined,
      isSaving: false,
    };

    setAttributeValues(prev => ({
      ...prev,
      [attributeId]: [...(prev[attributeId] || []), newValue],
    }));
  };

  const handleUpdateAttributeValue = (attributeId: string, index: number, field: 'value' | 'imageUrl' | 'imageFile', value: string | File) => {
    setAttributeValues(prev => ({
      ...prev,
      [attributeId]: prev[attributeId]?.map((val, i) => {
        if (i === index) {
          if (field === 'imageFile' && value instanceof File) {
            const previewUrl = URL.createObjectURL(value);
            return { 
              ...val, 
              imageFile: value, 
              imageUrl: value.name,
              previewUrl: previewUrl
            };
          } else if (field === 'value' || field === 'imageUrl') {
            return { ...val, [field]: value };
          }
        }
        return val;
      }) || [],
    }));
  };

  const handleRemoveAttributeValue = (attributeId: string, index: number) => {
    const valueToRemove = attributeValues[attributeId]?.[index];
    if (valueToRemove?.previewUrl) {
      URL.revokeObjectURL(valueToRemove.previewUrl);
    }

    setAttributeValues(prev => ({
      ...prev,
      [attributeId]: prev[attributeId]?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSaveAttributeValue = async (attributeId: string, index: number) => {
    const valueData = attributeValues[attributeId]?.[index];
    if (!valueData || !valueData.value.trim()) {
      setError('Value is required');
      return;
    }

    try {
      setError(null);
      
      setAttributeValues(prev => ({
        ...prev,
        [attributeId]: prev[attributeId]?.map((val, i) => 
          i === index ? { ...val, isSaving: true } : val
        ) || [],
      }));

      await createAttributeValueMutation.mutateAsync({
        productId,
        attributeId,
        data: {
          value: valueData.value,
          image: valueData.imageFile,
        },
      });

      if (valueData.previewUrl) {
        URL.revokeObjectURL(valueData.previewUrl);
      }
      
      setAttributeValues(prev => ({
        ...prev,
        [attributeId]: prev[attributeId]?.filter((_, i) => i !== index) || [],
      }));

      onUpdate?.();
    } catch (error: unknown) {
      console.error('Failed to create attribute value:', error);
      setError('Failed to create attribute value. Please try again.');
      
      setAttributeValues(prev => ({
        ...prev,
        [attributeId]: prev[attributeId]?.map((val, i) => 
          i === index ? { ...val, isSaving: false } : val
        ) || [],
      }));
    }
  };

  const handleEditAttributeValue = (attributeId: string, valueId: string, value: string, imageUrl?: string) => {
    setEditingValues(prev => ({
      ...prev,
      [attributeId]: {
        ...prev[attributeId],
        [valueId]: { value, imageUrl },
      },
    }));
  };

  const handleUpdateAttributeValueInEdit = async (attributeId: string, valueId: string) => {
    const valueData = editingValues[attributeId]?.[valueId];
    if (!valueData || !valueData.value.trim()) {
      setError('Value is required');
      return;
    }

    try {
      setError(null);
      await updateAttributeValueMutation.mutateAsync({
        productId,
        attributeId,
        valueId,
        data: {
          value: valueData.value,
          image: valueData.imageUrl ? new File([], valueData.imageUrl) : undefined,
        },
      });
      
      setEditingValues(prev => {
        const newState = { ...prev };
        if (newState[attributeId]) {
          const { [valueId]: _, ...rest } = newState[attributeId];
          newState[attributeId] = rest;
        }
        return newState;
      });
      
      onUpdate?.();
    } catch (error: unknown) {
      console.error('Failed to update attribute value:', error);
      setError('Failed to update attribute value. Please try again.');
    }
  };

  const handleCancelEditAttributeValue = (attributeId: string, valueId: string) => {
    setEditingValues(prev => {
      const newState = { ...prev };
      if (newState[attributeId]) {
        const { [valueId]: _, ...rest } = newState[attributeId];
        newState[attributeId] = rest;
      }
      return newState;
    });
  };

  const handleDeleteAttributeValue = async (attributeId: string, valueId: string, value: string) => {
    if (!window.confirm(`Are you sure you want to delete the value "${value}"?`)) {
      return;
    }

    try {
      setError(null);
      await deleteAttributeValueMutation.mutateAsync({
        productId,
        attributeId,
        valueId,
      });
      onUpdate?.();
    } catch (error: unknown) {
      console.error('Failed to delete attribute value:', error);
      setError('Failed to delete attribute value. Please try again.');
    }
  };

  return {
    // State
    error,
    newAttribute,
    setNewAttribute,
    editingAttribute,
    editingAttributeData,
    setEditingAttributeData,
    attributeValues,
    editingValues,
    setEditingValues,
    
    // Mutations
    createAttributeMutation,
    updateAttributeMutation,
    deleteAttributeMutation,
    createAttributeValueMutation,
    updateAttributeValueMutation,
    deleteAttributeValueMutation,
    
    // Handlers
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
  };
};
