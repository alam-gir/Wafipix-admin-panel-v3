import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/dashboard/cards/dashboard-card';

const categories = [
  { name: 'Electronics', percentage: 45.2, color: 'bg-green-500' },
  { name: 'Accessories', percentage: 28.7, color: 'bg-green-600' },
  { name: 'Home & Garden', percentage: 26.1, color: 'bg-orange-500' }
];

export function TopCategories() {
  return (
    <DashboardCard title="Top categories">
      <div className="space-y-6">
        {/* Chart */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Segments */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray={`${45.2 * 2.51} 251`}
                strokeDashoffset="0"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#059669"
                strokeWidth="8"
                strokeDasharray={`${28.7 * 2.51} 251`}
                strokeDashoffset={`-${45.2 * 2.51}`}
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f97316"
                strokeWidth="8"
                strokeDasharray={`${26.1 * 2.51} 251`}
                strokeDashoffset={`-${(45.2 + 28.7) * 2.51}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs font-medium text-gray-500">TOTAL SALES</div>
                <div className="text-lg font-bold text-gray-900">$4,275</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <span className="text-sm text-gray-600">{category.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {category.percentage}%
              </span>
            </div>
          ))}
        </div>

        <Button size="sm" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
          View details
        </Button>
      </div>
    </DashboardCard>
  );
}
