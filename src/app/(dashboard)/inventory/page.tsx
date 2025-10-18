'use client';

/**
 * Inventory Dashboard Page
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventoryOverview } from '@/components/inventory/inventory-overview';
import { LowStockAlerts } from '@/components/inventory/low-stock-alerts';
import { OutOfStockItems } from '@/components/inventory/out-of-stock-items';
import { StockMovementHistory } from '@/components/inventory/stock-movement-history';
import { StockAdjustmentForm } from '@/components/inventory/stock-adjustment-form';
import { InventoryReports } from '@/components/inventory/inventory-reports';

export default function InventoryDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">
            Monitor stock levels, track movements, and manage inventory efficiently
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
            <TabsTrigger value="movements">Movements</TabsTrigger>
            <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <InventoryOverview />
          </TabsContent>

          <TabsContent value="low-stock">
            <LowStockAlerts />
          </TabsContent>

          <TabsContent value="out-of-stock">
            <OutOfStockItems />
          </TabsContent>

          <TabsContent value="movements">
            <StockMovementHistory />
          </TabsContent>

          <TabsContent value="adjustments">
            <StockAdjustmentForm />
          </TabsContent>

          <TabsContent value="reports">
            <InventoryReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
