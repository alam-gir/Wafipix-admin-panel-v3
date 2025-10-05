import { User } from '@/types/api'
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
    phone: '+1234567890',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'manager@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1234567891',
    role: 'manager',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    email: 'user@example.com',
    firstName: 'Bob',
    lastName: 'Johnson',
    phone: '+1234567892',
    role: 'user',
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

// Mock dashboard data for Wafipix Design Agency
const mockDashboardMetrics: DashboardMetrics = {
  totalRevenue: {
    id: '1',
    title: 'Total Revenue',
    value: 245680,
    icon: 'DollarSign',
    color: 'primary',
    trend: { value: 18.5, isPositive: true },
    format: 'currency'
  },
  totalInvestment: {
    id: '2',
    title: 'Total Investment',
    value: 45680,
    icon: 'TrendingDown',
    color: 'destructive',
    trend: { value: 5.2, isPositive: false },
    format: 'currency'
  },
  netProfit: {
    id: '3',
    title: 'Net Profit',
    value: 200000,
    icon: 'TrendingUp',
    color: 'success',
    trend: { value: 22.3, isPositive: true },
    format: 'currency'
  },
  totalProjects: {
    id: '4',
    title: 'Total Projects',
    value: 156,
    icon: 'FileText',
    color: 'primary',
    trend: { value: 12.8, isPositive: true },
    format: 'number'
  },
  activeProjects: {
    id: '5',
    title: 'Active Projects',
    value: 23,
    icon: 'Activity',
    color: 'warning',
    trend: { value: 8.5, isPositive: true },
    format: 'number'
  },
  pendingProjects: {
    id: '6',
    title: 'Pending Projects',
    value: 7,
    icon: 'Clock',
    color: 'warning',
    trend: { value: -15.0, isPositive: true },
    format: 'number'
  },
  totalClients: {
    id: '7',
    title: 'Total Clients',
    value: 89,
    icon: 'Users',
    color: 'teal',
    trend: { value: 6.2, isPositive: true },
    format: 'number'
  },
  totalServices: {
    id: '8',
    title: 'Total Services',
    value: 12,
    icon: 'Briefcase',
    color: 'purple',
    trend: { value: 0, isPositive: true },
    format: 'number'
  }
}

const mockChartData: ChartData[] = [
  { date: '2024-08-15', revenue: 12500, profit: 8500, projects: 3, clients: 2 },
  { date: '2024-08-16', revenue: 8900, profit: 6200, projects: 2, clients: 1 },
  { date: '2024-08-17', revenue: 15200, profit: 10800, projects: 4, clients: 3 },
  { date: '2024-08-23', revenue: 18700, profit: 13200, projects: 5, clients: 2 },
  { date: '2024-08-24', revenue: 11200, profit: 7800, projects: 3, clients: 2 },
  { date: '2024-08-31', revenue: 22300, profit: 15800, projects: 6, clients: 4 },
  { date: '2024-09-03', revenue: 16800, profit: 11800, projects: 4, clients: 3 },
  { date: '2024-09-05', revenue: 19500, profit: 13800, projects: 5, clients: 2 },
  { date: '2024-09-06', revenue: 14200, profit: 9800, projects: 3, clients: 2 },
  { date: '2024-09-07', revenue: 20100, profit: 14200, projects: 5, clients: 3 },
  { date: '2024-09-08', revenue: 17600, profit: 12400, projects: 4, clients: 2 }
]

const mockTodayReport: TodayReport = {
  revenue: 8500,
  profit: 6200,
  projects: 2,
  clients: 1
}

export function getMockResponse<T>(url: string, data?: unknown): Promise<T> {
  // Simulate API delay
  const delay = Math.random() * 1000 + 500
  
  return new Promise((resolve) => {
    setTimeout(() => {
      let response: unknown

      switch (true) {
        case url.includes('/auth/login'):
          response = {
            token: 'mock-jwt-token',
            user: mockUsers[0],
            roles: [mockUsers[0].role]
          }
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

        case url.includes('/users/') && !url.includes('/users?') && !url.includes('/users/' + (data as { id?: string })?.id):
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
