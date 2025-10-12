'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Sparkles, 
  BarChart3, 
  MessageCircle,
  Headphones,
  Settings,
  X,
  ChevronLeft,
  Eye,
  User,
  Package
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    shortcut: 'D'
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingBag
  },
  {
    name: 'Products',
    href: '/products',
    icon: Sparkles
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: User
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Package
  }
];

const helpNavigation = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  },
  {
    name: 'Support',
    href: '/support',
    icon: Headphones
  }
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                T
              </div>
              <span className="text-xl font-bold text-gray-900 truncate">Taqreem Ecommerce</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden flex-shrink-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>


          {/* Navigation */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                General
              </p>
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors min-w-0",
                        isActive
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <item.icon className={cn(
                          "h-4 w-4 flex-shrink-0",
                          isActive ? "text-green-600" : "text-gray-400"
                        )} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.shortcut && (
                        <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-gray-400 bg-gray-100 rounded flex-shrink-0 ml-2">
                          {item.shortcut}
                        </kbd>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <Separator className="mx-4" />

            <div className="p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Help & Settings
              </p>
              <nav className="space-y-1">
                {helpNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors min-w-0"
                  >
                    <item.icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Quick Stats</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 truncate">Orders Today</span>
                      <span className="font-medium text-gray-900 flex-shrink-0 ml-2">24</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 truncate">Revenue</span>
                      <span className="font-medium text-gray-900 flex-shrink-0 ml-2">$2,450</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 truncate">Products</span>
                      <span className="font-medium text-gray-900 flex-shrink-0 ml-2">156</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
