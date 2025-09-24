'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    avatar: '/avatars/admin.jpg',
    lastLogin: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'manager@example.com',
    role: 'manager',
    status: 'active',
    avatar: '/avatars/manager.jpg',
    lastLogin: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    avatar: '/avatars/user.jpg',
    lastLogin: '2024-01-14T16:45:00Z'
  }
]

export default function UsersPage() {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button className="w-full sm:w-auto transition-all duration-200 hover:scale-105">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
            </div>
            <Button variant="outline" className="w-full sm:w-auto transition-all duration-200 hover:bg-accent">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:bg-muted/20">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <Avatar className="transition-all duration-200 hover:ring-2 hover:ring-primary/20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="transition-all duration-200">
                    {user.status}
                  </Badge>
                  <Badge variant="outline" className="transition-all duration-200">{user.role}</Badge>
                  <Button variant="ghost" size="sm" className="transition-all duration-200 hover:bg-accent">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
