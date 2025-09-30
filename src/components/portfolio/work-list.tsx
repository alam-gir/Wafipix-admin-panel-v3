'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, EyeOff, FolderOpen, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WorkListResponse, Service } from '@/types/api'

interface WorkListProps {
  works: WorkListResponse[]
  services: Service[]
  loading: boolean
  searchTerm: string
  onSearchChange: (term: string) => void
  onEdit: (work: WorkListResponse) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, active: boolean) => void
  isSubmitting?: boolean
}

export function WorkList({
  works,
  services,
  loading,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onToggleActive,
  isSubmitting = false
}: WorkListProps) {
  const getServiceName = (serviceId: string) => {
    const service = (services || []).find(s => s.id === serviceId)
    return service?.title || 'Unknown Service'
  }

  const filteredWorks = (works || []).filter(work =>
    work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getServiceName(work.service.id).toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (filteredWorks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium">
                {searchTerm ? 'No matching works found' : 'No works'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Add your first portfolio work to get started'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search works..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Works Grid */}
      <div className="grid gap-4">
        {filteredWorks.map((work) => (
          <Card key={work.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                {/* Work Icon */}
                <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FolderOpen className="h-8 w-8 text-white" />
                </div>
                
                {/* Work Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{work.title}</h3>
                      <p className="text-sm text-gray-600 truncate">
                        Service: <span className="font-medium">{getServiceName(work.service.id)}</span>
                      </p>
                    </div>
                    <Badge variant={work.active ? 'default' : 'secondary'} className="text-xs ml-2">
                      {work.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  {work.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {work.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(work.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => window.location.href = `/management/portfolio/${work.id}`}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        disabled={isSubmitting}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                      
                      <Button
                        onClick={() => onToggleActive(work.id, !work.active)}
                        variant={work.active ? "secondary" : "default"}
                        size="sm"
                        className="gap-2"
                        disabled={isSubmitting}
                      >
                        {work.active ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Activate
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => onEdit(work)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        disabled={isSubmitting}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      
                      <Button
                        onClick={() => onDelete(work.id)}
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
