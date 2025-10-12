import { SalesOverview } from '@/components/dashboard/widgets/sales-overview';
import { SalesFunnel } from '@/components/dashboard/widgets/sales-funnel';
import { TopSellingProducts } from '@/components/dashboard/widgets/top-selling-products';
import { TopCategories } from '@/components/dashboard/widgets/top-categories';
import { UpcomingEvents } from '@/components/dashboard/widgets/upcoming-events';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Sales Overview - Full width on mobile, half width on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <SalesOverview />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Sales Funnel and Top Products */}
        <div className="lg:col-span-2 space-y-6">
          <SalesFunnel />
          <TopSellingProducts />
        </div>

        {/* Right Column - Categories and Events */}
        <div className="space-y-6">
          <TopCategories />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}
