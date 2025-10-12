import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/dashboard/cards/dashboard-card';
import { TrendingUp } from 'lucide-react';

export function SalesOverview() {
  return (
    <DashboardCard className="bg-gradient-to-br from-green-50 to-green-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Today's Sales Overview
            </h3>
            <span className="text-lg">📊</span>
          </div>
          
          <div className="mb-4">
            <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">
              $2,450.00
            </div>
            <p className="text-sm text-gray-600">
              Revenue Today
            </p>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            24 orders completed today with 15% increase from yesterday.
          </p>
          
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            View report →
          </Button>
        </div>
        
        <div className="mt-4 lg:mt-0 lg:ml-6">
          <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 lg:h-12 lg:w-12 text-green-600 mx-auto mb-2" />
              <div className="text-xs lg:text-sm font-medium text-green-700">
                Growth
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
