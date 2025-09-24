// Permission constants
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',
  
  // User Management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  
  // Role Management
  ROLES_VIEW: 'roles:view',
  ROLES_CREATE: 'roles:create',
  ROLES_EDIT: 'roles:edit',
  ROLES_DELETE: 'roles:delete',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
} as const

// Role constants
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const

// Navigation configuration
export const NAVIGATION_CONFIG = {
  main: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'LayoutDashboard',
      permission: PERMISSIONS.DASHBOARD_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]
    },
    {
      name: 'Users',
      href: '/users',
      icon: 'Users',
      permission: PERMISSIONS.USERS_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Roles',
      href: '/roles',
      icon: 'Shield',
      permission: PERMISSIONS.ROLES_VIEW,
      roles: [ROLES.ADMIN]
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: 'Settings',
      permission: PERMISSIONS.SETTINGS_VIEW,
      roles: [ROLES.ADMIN]
    }
  ],
  // Additional sections can be added dynamically
  inventory: [
    {
      name: 'Products',
      href: '/inventory/products',
      icon: 'Package',
      permission: 'inventory:products:view',
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Categories',
      href: '/inventory/categories',
      icon: 'Tags',
      permission: 'inventory:categories:view',
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Variants',
      href: '/inventory/variants',
      icon: 'Layers',
      permission: 'inventory:variants:view',
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Product Types',
      href: '/inventory/product-types',
      icon: 'Type',
      permission: 'inventory:product-types:view',
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Brands',
      href: '/inventory/brands',
      icon: 'Award',
      permission: 'inventory:brands:view',
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Supplier',
      href: '/inventory/suppliers',
      icon: 'Truck',
      permission: 'inventory:suppliers:view',
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Procurement',
      href: '/inventory/procurement',
      icon: 'ShoppingCart',
      permission: 'inventory:procurement:view',
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    }
  ],
  marketing: [
    {
      name: 'Banner',
      href: '/marketing/banners',
      icon: 'Image',
      permission: 'marketing:banners:view',
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    }
  ]
}

// Chart colors matching our design system
export const CHART_COLORS = {
  sales: 'hsl(var(--chart-1))',
  profit: 'hsl(var(--chart-2))',
  orders: 'hsl(var(--chart-3))',
  purchase: 'hsl(var(--chart-4))',
  stores: 'hsl(var(--chart-5))',
}

// Format helpers
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}

export const formatPercentage = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}
