import { DashboardCard } from '@/components/dashboard/cards/dashboard-card';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    image: '/placeholder-product.jpg',
    stocks: '45',
    price: '$89.99',
    sales: '12',
    earnings: '$1,079.88',
    change: '+15.2%'
  },
  {
    id: 2,
    name: 'Smart Watch',
    image: '/placeholder-product.jpg',
    stocks: '23',
    price: '$199.99',
    sales: '8',
    earnings: '$1,599.92',
    change: '+8.5%'
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    image: '/placeholder-product.jpg',
    stocks: '67',
    price: '$49.99',
    sales: '15',
    earnings: '$749.85',
    change: '+12.1%'
  },
  {
    id: 4,
    name: 'Phone Case',
    image: '/placeholder-product.jpg',
    stocks: '156',
    price: '$19.99',
    sales: '28',
    earnings: '$559.72',
    change: '+6.8%'
  },
  {
    id: 5,
    name: 'USB Cable',
    image: '/placeholder-product.jpg',
    stocks: '89',
    price: '$12.99',
    sales: '22',
    earnings: '$285.78',
    change: '+4.2%'
  }
];

export function TopSellingProducts() {
  return (
    <DashboardCard title="Top selling products">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-1">
                <Checkbox />
              </th>
              <th className="text-left py-2 px-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="text-left py-2 px-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stocks
              </th>
              <th className="text-left py-2 px-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="text-left py-2 px-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales
              </th>
              <th className="text-left py-2 px-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Earnings
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100">
                <td className="py-3 px-1">
                  <Checkbox />
                </td>
                <td className="py-3 px-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0"></div>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-1 text-sm text-gray-600">
                  {product.stocks}
                </td>
                <td className="py-3 px-1 text-sm text-gray-600">
                  {product.price}
                </td>
                <td className="py-3 px-1 text-sm text-gray-600">
                  {product.sales}
                </td>
                <td className="py-3 px-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-900">
                      {product.earnings}
                    </span>
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs font-medium">{product.change}</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
