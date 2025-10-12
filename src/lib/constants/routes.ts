/**
 * Centralized route constants for the application
 */

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  '/send-otp',
  '/verify-otp',
] as const;

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/categories',
  '/products',
  '/inventory',
  '/customers',
  '/orders',
  '/payments',
  '/analytics',
  '/profile',
  '/settings',
  '/support',
  '/management',
] as const;

// Dashboard navigation menu items
export const DASHBOARD_NAVIGATION = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    shortcut: 'D'
  },
  {
    name: 'Categories',
    href: '/categories',
    icon: 'Tags'
  },
  {
    name: 'Products',
    href: '/products',
    icon: 'Sparkles'
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: 'Package'
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: 'Users'
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: 'ShoppingBag'
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: 'CreditCard'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: 'BarChart3'
  }
] as const;

// Help & Settings navigation items
export const HELP_NAVIGATION = [
  {
    name: 'Settings',
    href: '/settings',
    icon: 'Settings'
  },
  {
    name: 'Support',
    href: '/support',
    icon: 'Headphones'
  }
] as const;

// Type definitions for better TypeScript support
export type PublicRoute = typeof PUBLIC_ROUTES[number];
export type ProtectedRoute = typeof PROTECTED_ROUTES[number];
export type DashboardNavItem = typeof DASHBOARD_NAVIGATION[number];
export type HelpNavItem = typeof HELP_NAVIGATION[number];
