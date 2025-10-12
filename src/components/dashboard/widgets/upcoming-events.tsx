import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/dashboard/cards/dashboard-card';
import { Calendar, Users, Globe } from 'lucide-react';

const events = [
  {
    id: 1,
    name: 'Black Friday Sale',
    date: '24-26 November 2024',
    time: '00:00',
    icon: Users
  },
  {
    id: 2,
    name: 'Free shipping promotion',
    date: '1-7 December 2024',
    time: '00:00',
    icon: Globe
  }
];

export function UpcomingEvents() {
  return (
    <DashboardCard title="Upcoming Promotions">
      <div className="space-y-6">
        {/* Illustration */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <event.icon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {event.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">{event.date}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{event.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          View promotions
        </Button>
      </div>
    </DashboardCard>
  );
}
