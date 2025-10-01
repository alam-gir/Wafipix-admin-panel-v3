'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Edit, 
  MoreHorizontal, 
  Trash2, 
  Plus, 
  Search,
  Calendar,
  User,
  Eye,
  EyeOff,
  Settings,
  Star,
  HelpCircle,
  Package
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Service, ServiceSearchRequest } from '@/types/api'
import { format } from 'date-fns'

interface ServiceListProps {
  services: Service[]
  categories: Array<{ id: string; title: string }>
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
  onCreate: () => void
  onToggleActive: (service: Service) => void
  onManageFeatures: (service: Service) => void
  onManageFAQs: (service: Service) => void
  onManagePackages: (service: Service) => void
  isLoading?: boolean
  onSearch?: (searchRequest: ServiceSearchRequest) => void
}

export function ServiceList({ 
  services, 
  categories,
  onEdit, 
  onDelete, 
  onCreate, 
  onToggleActive,
  onManageFeatures,
  onManageFAQs,
  onManagePackages,
  isLoading = false,
  onSearch
}: ServiceListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<string>('desc')

  // Filter services based on search criteria
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.categoryTitle.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || service.categoryId === selectedCategory
    const matchesActive = activeFilter === 'all' || 
                         (activeFilter === 'active' && service.active) ||
                         (activeFilter === 'inactive' && !service.active)
    
    return matchesSearch && matchesCategory && matchesActive
  })

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return 'Invalid Date'
    }
  }

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        title: searchTerm || undefined,
        categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
        active: activeFilter === 'all' ? undefined : activeFilter === 'active',
        sortBy,
        sortDirection
      })
    }
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setActiveFilter('all')
    setSortBy('createdAt')
    setSortDirection('desc')
    if (onSearch) {
      onSearch({})
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <span>Services</span>
              <Badge variant="secondary">{filteredServices.length}</Badge>
            </CardTitle>
            
            <Button onClick={onCreate} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Service</span>
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="categoryTitle">Category</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
              <Button onClick={handleSearch} size="sm" className="flex-1">
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
              <Button onClick={handleClearSearch} variant="outline" size="sm">
                Clear
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredServices.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== 'all' || activeFilter !== 'all' 
                ? 'No services found matching your criteria.' 
                : 'No services available.'}
            </div>
            {!searchTerm && selectedCategory === 'all' && activeFilter === 'all' && (
              <Button onClick={onCreate} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create First Service
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {service.icon && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                            <img
                              src={service.icon}
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{service.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {service.subtitle}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.categoryTitle}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={service.active}
                          onCheckedChange={() => onToggleActive(service)}
                        />
                        <span className="text-sm">
                          {service.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{service.createdBy}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(service.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => onEdit(service)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Service
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onManageFeatures(service)}>
                            <Star className="mr-2 h-4 w-4" />
                            Manage Features
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onManageFAQs(service)}>
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Manage FAQs
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onManagePackages(service)}>
                            <Package className="mr-2 h-4 w-4" />
                            Manage Packages
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDelete(service)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
