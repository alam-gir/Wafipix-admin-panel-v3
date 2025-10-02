// Permission constants
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',
  
  // Profile
  PROFILE_VIEW: 'profile:view',
  PROFILE_EDIT: 'profile:edit',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // Management
  CATEGORIES_VIEW: 'categories:view',
  CATEGORIES_CREATE: 'categories:create',
  CATEGORIES_EDIT: 'categories:edit',
  CATEGORIES_DELETE: 'categories:delete',
  
  SERVICES_VIEW: 'services:view',
  SERVICES_CREATE: 'services:create',
  SERVICES_EDIT: 'services:edit',
  SERVICES_DELETE: 'services:delete',
  
  WORKS_VIEW: 'works:view',
  WORKS_CREATE: 'works:create',
  WORKS_EDIT: 'works:edit',
  WORKS_DELETE: 'works:delete',
  
  CONTACTS_VIEW: 'contacts:view',
  CONTACTS_REPLY: 'contacts:reply',
  CONTACTS_DELETE: 'contacts:delete',
  
  CLIENTS_VIEW: 'clients:view',
  CLIENTS_CREATE: 'clients:create',
  CLIENTS_EDIT: 'clients:edit',
  CLIENTS_DELETE: 'clients:delete',
  
  REVIEWS_VIEW: 'reviews:view',
  REVIEWS_CREATE: 'reviews:create',
  REVIEWS_EDIT: 'reviews:edit',
  REVIEWS_DELETE: 'reviews:delete',
  
  ADVERTISEMENTS_VIEW: 'advertisements:view',
  ADVERTISEMENTS_CREATE: 'advertisements:create',
  ADVERTISEMENTS_EDIT: 'advertisements:edit',
  ADVERTISEMENTS_DELETE: 'advertisements:delete',
  
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  
  SOCIAL_MEDIA_VIEW: 'social_media:view',
  SOCIAL_MEDIA_CREATE: 'social_media:create',
  SOCIAL_MEDIA_EDIT: 'social_media:edit',
  SOCIAL_MEDIA_DELETE: 'social_media:delete',
  
  // Orders
  ORDERS_VIEW: 'orders:view',
  ORDERS_CREATE: 'orders:create',
  ORDERS_EDIT: 'orders:edit',
  ORDERS_DELETE: 'orders:delete',
  
  // Employees
  EMPLOYEES_VIEW: 'employees:view',
  EMPLOYEES_CREATE: 'employees:create',
  EMPLOYEES_EDIT: 'employees:edit',
  EMPLOYEES_DELETE: 'employees:delete',
  
  // Payments
  PAYMENTS_VIEW: 'payments:view',
  PAYMENTS_CREATE: 'payments:create',
  PAYMENTS_EDIT: 'payments:edit',
  PAYMENTS_DELETE: 'payments:delete',
  
  // Contacts
  CONTACTS_VIEW: 'contacts:view',
  CONTACTS_CREATE: 'contacts:create',
  CONTACTS_EDIT: 'contacts:edit',
  CONTACTS_DELETE: 'contacts:delete',
  
  // Marketing
  MARKETING_VIEW: 'marketing:view',
  MARKETING_CREATE: 'marketing:create',
  MARKETING_EDIT: 'marketing:edit',
  MARKETING_DELETE: 'marketing:delete',
  
  EMAIL_MARKETING_VIEW: 'email_marketing:view',
  EMAIL_MARKETING_CREATE: 'email_marketing:create',
  EMAIL_MARKETING_EDIT: 'email_marketing:edit',
  EMAIL_MARKETING_DELETE: 'email_marketing:delete',
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
      name: 'Profile',
      href: '/profile',
      icon: 'User',
      permission: PERMISSIONS.PROFILE_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: 'Settings',
      permission: PERMISSIONS.SETTINGS_VIEW,
      roles: [ROLES.ADMIN]
    }
  ],
  
  management: [
    {
      name: 'Categories',
      href: '/management/categories',
      icon: 'Tags',
      permission: PERMISSIONS.CATEGORIES_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Services',
      href: '/management/services',
      icon: 'Briefcase',
      permission: PERMISSIONS.SERVICES_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Portfolio',
      href: '/management/portfolio',
      icon: 'Briefcase',
      permission: PERMISSIONS.PROFILE_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Trusted Clients',
      href: '/management/clients',
      icon: 'Users',
      permission: PERMISSIONS.CLIENTS_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Reviews',
      href: '/management/reviews',
      icon: 'Star',
      permission: PERMISSIONS.REVIEWS_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Hero Video',
      href: '/management/advertisement-videos',
      icon: 'Monitor',
      permission: PERMISSIONS.ADVERTISEMENTS_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Social Media',
      href: '/management/social-media',
      icon: 'Share2',
      permission: PERMISSIONS.SOCIAL_MEDIA_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    }
  ],
  
  orders: [
    {
      name: 'All Orders',
      href: '/orders',
      icon: 'ShoppingBag',
      permission: PERMISSIONS.ORDERS_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Create New Order',
      href: '/orders/create',
      icon: 'PlusCircle',
      permission: PERMISSIONS.ORDERS_CREATE,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    }
  ],
  
  employees: [
    {
      name: 'All Employees',
      href: '/employees',
      icon: 'Users',
      permission: PERMISSIONS.EMPLOYEES_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Appoint Employee',
      href: '/employees/appoint',
      icon: 'UserPlus',
      permission: PERMISSIONS.EMPLOYEES_CREATE,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Employee Settings',
      href: '/employees/settings',
      icon: 'UserCog',
      permission: PERMISSIONS.EMPLOYEES_EDIT,
      roles: [ROLES.ADMIN]
    }
  ],
  
  payments: [
    {
      name: 'All Payments',
      href: '/payments',
      icon: 'CreditCard',
      permission: PERMISSIONS.PAYMENTS_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Create Payment',
      href: '/payments/create',
      icon: 'PlusCircle',
      permission: PERMISSIONS.PAYMENTS_CREATE,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Payment Settings',
      href: '/payments/settings',
      icon: 'Settings',
      permission: PERMISSIONS.PAYMENTS_EDIT,
      roles: [ROLES.ADMIN]
    }
  ],
  
  contacts: [
    {
      name: 'All Contacts',
      href: '/contacts',
      icon: 'Phone',
      permission: PERMISSIONS.CONTACTS_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    }
  ],
  
  marketing: [
    {
      name: 'All Marketing',
      href: '/marketing',
      icon: 'Megaphone',
      permission: PERMISSIONS.MARKETING_VIEW,
      roles: [ROLES.ADMIN, ROLES.MANAGER]
    },
    {
      name: 'Email Marketing',
      href: '/marketing/email',
      icon: 'Mail',
      permission: PERMISSIONS.EMAIL_MARKETING_VIEW,
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
