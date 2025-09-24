import { LoginResponse, User } from '../api/auth'
import { DashboardMetrics, ChartData, TodayReport } from '../api/dashboard'
import { UsersResponse } from '../api/users'
import { Role, Permission } from '../api/roles'

// Mock users
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    permissions: ['*'],
    avatar: '/avatars/admin.jpg',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'manager@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'manager',
    permissions: ['dashboard:view', 'users:view', 'users:edit'],
    avatar: '/avatars/manager.jpg',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    email: 'user@example.com',
    firstName: 'Bob',
    lastName: 'Johnson',
    role: 'user',
    permissions: ['dashboard:view'],
    avatar: '/avatars/user.jpg',
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
]

// Mock roles
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'admin',
    description: 'Full system access',
    permissions: ['*'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'manager',
    description: 'Management access',
    permissions: ['dashboard:view', 'users:view', 'users:edit'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'user',
    description: 'Basic user access',
    permissions: ['dashboard:view'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Mock permissions
const mockPermissions: Permission[] = [
  { id: '1', name: 'dashboard:view', description: 'View dashboard', category: 'Dashboard' },
  { id: '2', name: 'users:view', description: 'View users', category: 'Users' },
  { id: '3', name: 'users:create', description: 'Create users', category: 'Users' },
  { id: '4', name: 'users:edit', description: 'Edit users', category: 'Users' },
  { id: '5', name: 'users:delete', description: 'Delete users', category: 'Users' },
  { id: '6', name: 'roles:view', description: 'View roles', category: 'Roles' },
  { id: '7', name: 'roles:create', description: 'Create roles', category: 'Roles' },
  { id: '8', name: 'roles:edit', description: 'Edit roles', category: 'Roles' },
  { id: '9', name: 'roles:delete', description: 'Delete roles', category: 'Roles' },
  { id: '10', name: 'settings:view', description: 'View settings', category: 'Settings' },
  { id: '11', name: 'settings:edit', description: 'Edit settings', category: 'Settings' }
]

// Mock dashboard data
const mockDashboardMetrics: DashboardMetrics = {
  totalSales: {
    id: '1',
    title: 'Total Sales',
    value: 412633,
    icon: 'DollarSign',
    color: 'primary',
    trend: { value: 12.5, isPositive: true },
    format: 'currency'
  },
  totalProfit: {
    id: '2',
    title: 'Total Profit',
    value: 27639,
    icon: 'TrendingUp',
    color: 'success',
    trend: { value: 8.2, isPositive: true },
    format: 'currency'
  },
  totalPurchase: {
    id: '3',
    title: 'Total Purchase',
    value: 2397630,
    icon: 'ShoppingCart',
    color: 'purple',
    trend: { value: -2.1, isPositive: false },
    format: 'currency'
  },
  totalOrders: {
    id: '4',
    title: 'Total Orders',
    value: 118,
    icon: 'FileText',
    color: 'warning',
    trend: { value: 15.3, isPositive: true },
    format: 'number'
  },
  totalStores: {
    id: '5',
    title: 'Total Stores',
    value: 39,
    icon: 'Building',
    color: 'teal',
    trend: { value: 5.0, isPositive: true },
    format: 'number'
  },
  pendingOrders: {
    id: '6',
    title: 'Pending Orders',
    value: 2,
    icon: 'Clock',
    color: 'warning',
    trend: { value: -50.0, isPositive: true },
    format: 'number'
  },
  totalInventory: {
    id: '7',
    title: 'Total Inventory Items',
    value: 7355,
    icon: 'Package',
    color: 'primary',
    trend: { value: 3.2, isPositive: true },
    format: 'number'
  },
  inventoryValue: {
    id: '8',
    title: 'Total Inventory Value',
    value: 2014927,
    icon: 'Calculator',
    color: 'destructive',
    trend: { value: -1.8, isPositive: false },
    format: 'currency'
  }
}

const mockChartData: ChartData[] = [
  { date: '2024-08-15', sales: 322224.35, profit: 22840.86, purchase: 92227, orders: 15 },
  { date: '2024-08-16', sales: 105000, profit: 15000, purchase: 45000, orders: 8 },
  { date: '2024-08-17', sales: 85000, profit: 12000, purchase: 38000, orders: 6 },
  { date: '2024-08-23', sales: 95000, profit: 13500, purchase: 42000, orders: 7 },
  { date: '2024-08-24', sales: 78000, profit: 11000, purchase: 35000, orders: 5 },
  { date: '2024-08-31', sales: 120000, profit: 18000, purchase: 55000, orders: 12 },
  { date: '2024-09-03', sales: 88000, profit: 12500, purchase: 40000, orders: 9 },
  { date: '2024-09-05', sales: 92000, profit: 13000, purchase: 41000, orders: 8 },
  { date: '2024-09-06', sales: 76000, profit: 10800, purchase: 34000, orders: 6 },
  { date: '2024-09-07', sales: 98000, profit: 14000, purchase: 44000, orders: 10 },
  { date: '2024-09-08', sales: 85000, profit: 12000, purchase: 38000, orders: 7 }
]

const mockTodayReport: TodayReport = {
  sales: 0,
  profit: 0,
  purchase: 0,
  orders: 0
}

export function getMockResponse<T>(url: string, data?: any): T {
  // Simulate API delay
  const delay = Math.random() * 1000 + 500
  
  return new Promise((resolve) => {
    setTimeout(() => {
      let response: any

      switch (true) {
        case url.includes('/auth/login'):
          response = {
            token: 'mock-jwt-token',
            user: mockUsers[0],
            permissions: mockUsers[0].permissions,
            roles: [mockUsers[0].role]
          } as LoginResponse
          break

        case url.includes('/auth/me'):
          response = mockUsers[0]
          break

        case url.includes('/dashboard/metrics'):
          response = mockDashboardMetrics
          break

        case url.includes('/dashboard/charts'):
          response = mockChartData
          break

        case url.includes('/dashboard/today'):
          response = mockTodayReport
          break

        case url.includes('/users') && !url.includes('/users/'):
          response = {
            users: mockUsers,
            total: mockUsers.length,
            page: 1,
            limit: 10,
            totalPages: 1
          } as UsersResponse
          break

        case url.includes('/users/') && !url.includes('/users?') && !url.includes('/users/' + data?.id):
          const userId = url.split('/users/')[1]
          response = mockUsers.find(u => u.id === userId) || mockUsers[0]
          break

        case url.includes('/roles') && !url.includes('/roles/'):
          response = mockRoles
          break

        case url.includes('/permissions'):
          response = mockPermissions
          break

        default:
          response = { message: 'Mock data not found for this endpoint' }
      }

      resolve(response as T)
    }, delay)
  })
}
