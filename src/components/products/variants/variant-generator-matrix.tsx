/**
 * Variant Generator Matrix - Small, focused component for generating variants
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface VariantGeneratorMatrixProps {
  attributes: Attribute[];
  onGenerateVariants: () => void;
  variantCount: number;
  className?: string;
}

export const VariantGeneratorMatrix: React.FC<VariantGeneratorMatrixProps> = ({
  attributes,
  onGenerateVariants,
  variantCount,
  className,
}) => {
  // Calculate total possible combinations
  const totalCombinations = attributes.reduce((total, attr) => total * attr.values.length, 1);

  if (attributes.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Variant Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500">Add attributes and values to generate variants</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Variant Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Attributes Overview */}
        <div className="space-y-3">
          {attributes.map((attr) => (
            <div key={attr.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">{attr.name}</span>
                <Badge variant="outline" className="text-xs">
                  {attr.attributeType}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {attr.values.length} values
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {attr.values.map((value) => (
                  <Badge key={value.id} variant="outline" className="text-xs">
                    {value.value}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Generation Info */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">
                Total Possible Combinations: {totalCombinations}
              </p>
              <p className="text-xs text-blue-700">
                Current Variants: {variantCount}
              </p>
            </div>
            <Button
              onClick={onGenerateVariants}
              disabled={totalCombinations === 0}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Generate Variants
            </Button>
          </div>
        </div>

        {totalCombinations > 50 && (
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Warning: This will generate {totalCombinations} variants. Consider reducing attribute values.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


