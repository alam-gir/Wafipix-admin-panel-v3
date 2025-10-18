/**
 * Stock Adjustment Component
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowUpDown, CheckCircle, AlertCircle } from 'lucide-react';
import { useStockAdjustment } from '@/lib/query/hooks/inventory-mutations';
import { useAuthStore } from '@/stores/auth-store';

interface StockAdjustmentFormProps {
  variantId?: string;
  variantSku?: string;
  productTitle?: string;
  currentStock?: number;
  onSuccess?: () => void;
}

export const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({
  variantId,
  variantSku,
  productTitle,
  currentStock,
  onSuccess,
}) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    variantId: variantId || '',
    adjustmentType: 'ADD' as 'ADD' | 'REMOVE' | 'SET',
    quantity: '',
    reason: '',
    createdBy: user?.id || '', // Use real user ID from auth store
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const stockAdjustmentMutation = useStockAdjustment();

  // Update createdBy when user changes
  useEffect(() => {
    if (user?.id) {
      setFormData(prev => ({
        ...prev,
        createdBy: user.id,
      }));
    }
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.variantId || !formData.quantity || !formData.reason.trim()) {
      return;
    }

    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await stockAdjustmentMutation.mutateAsync({
        ...formData,
        quantity: parseInt(formData.quantity),
        createdBy: user.id, // Ensure we use the current user ID
      });
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        quantity: '',
        reason: '',
      }));
      
      onSuccess?.();
    } catch (error) {
      console.error('Stock adjustment failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getNewStockPreview = () => {
    if (!formData.quantity || !currentStock) return null;
    
    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity)) return null;

    switch (formData.adjustmentType) {
      case 'ADD':
        return currentStock + quantity;
      case 'REMOVE':
        return Math.max(0, currentStock - quantity);
      case 'SET':
        return quantity;
      default:
        return null;
    }
  };

  const newStock = getNewStockPreview();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5 text-blue-600" />
          Stock Adjustment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Info */}
          {(productTitle || variantSku) && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">
                {productTitle && <div>Product: {productTitle}</div>}
                {variantSku && <div>SKU: {variantSku}</div>}
                {currentStock !== undefined && (
                  <div>Current Stock: <strong>{currentStock}</strong></div>
                )}
              </div>
            </div>
          )}

          {/* Variant ID */}
          {!variantId && (
            <div className="space-y-2">
              <Label htmlFor="variantId">Variant ID</Label>
              <Input
                id="variantId"
                value={formData.variantId}
                onChange={(e) => handleInputChange('variantId', e.target.value)}
                placeholder="Enter variant UUID"
                required
              />
            </div>
          )}

          {/* Adjustment Type */}
          <div className="space-y-2">
            <Label htmlFor="adjustmentType">Adjustment Type</Label>
            <Select
              value={formData.adjustmentType}
              onValueChange={(value) => handleInputChange('adjustmentType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select adjustment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADD">Add Stock</SelectItem>
                <SelectItem value="REMOVE">Remove Stock</SelectItem>
                <SelectItem value="SET">Set Exact Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Enter reason for adjustment..."
              rows={3}
              required
            />
          </div>

          {/* Preview */}
          {newStock !== null && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Preview:</strong> Stock will change from {currentStock} to {newStock}
                {formData.adjustmentType === 'REMOVE' && newStock === 0 && (
                  <span className="text-red-600 ml-2">(Will be out of stock)</span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {stockAdjustmentMutation.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {stockAdjustmentMutation.error.message || 'Failed to adjust stock'}
              </AlertDescription>
            </Alert>
          )}

          {/* User Authentication Check */}
          {!user?.id && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You must be logged in to perform stock adjustments.
              </AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {stockAdjustmentMutation.isSuccess && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Stock adjusted successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !formData.variantId || !formData.quantity || !formData.reason.trim() || !user?.id}
            className="w-full"
          >
            {isSubmitting ? 'Adjusting...' : 'Adjust Stock'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
