import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function DashboardCard({ 
  title, 
  children, 
  className,
  headerClassName,
  contentClassName 
}: DashboardCardProps) {
  return (
    <Card className={cn("bg-white shadow-sm", className)}>
      {title && (
        <CardHeader className={cn("pb-3", headerClassName)}>
          <CardTitle className="text-sm font-semibold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("pt-0", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
