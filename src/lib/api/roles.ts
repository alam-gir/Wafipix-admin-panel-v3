import { apiService } from './index'

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateRoleRequest {
  name: string
  description: string
  permissions: string[]
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
  permissions?: string[]
  isActive?: boolean
}

export interface Permission {
  id: string
  name: string
  description: string
  category: string
}

export const rolesApi = {
  getRoles: async (): Promise<Role[]> => {
    return apiService.get<Role[]>('/roles')
  },

  getRole: async (id: string): Promise<Role> => {
    return apiService.get<Role>(`/roles/${id}`)
  },

  createRole: async (role: CreateRoleRequest): Promise<Role> => {
    return apiService.post<Role>('/roles', role)
  },

  updateRole: async (id: string, role: UpdateRoleRequest): Promise<Role> => {
    return apiService.put<Role>(`/roles/${id}`, role)
  },

  deleteRole: async (id: string): Promise<void> => {
    return apiService.delete<void>(`/roles/${id}`)
  },

  getPermissions: async (): Promise<Permission[]> => {
    return apiService.get<Permission[]>('/permissions')
  },

  toggleRoleStatus: async (id: string): Promise<Role> => {
    return apiService.put<Role>(`/roles/${id}/toggle-status`)
  }
}
