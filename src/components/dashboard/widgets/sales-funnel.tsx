import { DashboardCard } from '@/components/dashboard/cards/dashboard-card';
import { TrendingUp } from 'lucide-react';

const funnelData = [
  {
    stage: 'Website Visitors',
    value: '1,245',
    percentage: '+12.5%',
    description: 'Total visitors today'
  },
  {
    stage: 'Product Views',
    value: '892',
    percentage: '+8.2%',
    description: 'Products viewed today'
  },
  {
    stage: 'Add to Cart',
    value: '156',
    percentage: '+5.1%',
    description: 'Items added to cart'
  },
  {
    stage: 'Orders',
    value: '24',
    percentage: '+15.3%',
    description: 'Orders completed today'
  }
];

export function SalesFunnel() {
  return (
    <DashboardCard title="Sales funnel">
      <div className="space-y-4">
        {funnelData.map((item, index) => (
          <div key={item.stage} className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {item.stage}
                </span>
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">{item.percentage}</span>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">
                {item.value}
              </div>
              <p className="text-xs text-gray-500">
                {item.description}
              </p>
            </div>
            <div className="ml-4">
              <div className="w-16 h-8 bg-gray-200 rounded flex items-end">
                <div 
                  className="bg-green-600 rounded h-full transition-all duration-300"
                  style={{ 
                    width: `${Math.max(20, 100 - (index * 15))}%` 
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
