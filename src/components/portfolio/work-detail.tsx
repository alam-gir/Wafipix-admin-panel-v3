'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { WorkResponse, Service } from '@/types/api'

interface WorkDetailProps {
  work: WorkResponse
  services: Service[]
  onEdit: () => void
  onToggleActive: (id: string, active: boolean) => void
  onDelete: (id: string) => void
  isSubmitting?: boolean
}

export function WorkDetail({ 
  work, 
  services, 
  onEdit, 
  onToggleActive, 
  onDelete, 
  isSubmitting = false 
}: WorkDetailProps) {
  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    return service?.title || 'Unknown Service'
  }

  const renderMediaPreview = (file: any, type: 'cover' | 'profile') => {
    if (!file || !file.publicUrl) return null

    const isVideo = file.mimeType?.startsWith('video/')
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium capitalize">{type} Media</h4>
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {isVideo ? (
            <video
              src={file.publicUrl}
              className="w-full h-full object-cover"
              controls
            />
          ) : (
            <img
              src={file.publicUrl}
              alt={file.fileName}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{file.fileName}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{work.title}</h1>
            <p className="text-muted-foreground">
              Service: {getServiceName(work.service.id)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={work.active ? 'default' : 'secondary'}>
            {work.active ? 'Active' : 'Inactive'}
          </Badge>
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
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={isSubmitting}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Work Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <p className="text-sm">{work.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Service</label>
                <p className="text-sm">{getServiceName(work.service.id)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Slug</label>
                <p className="text-sm font-mono">{work.slug}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge variant={work.active ? 'default' : 'secondary'}>
                  {work.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {work.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{work.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Media Files */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Media Files</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {renderMediaPreview(work.coverVideo, 'cover')}
              {renderMediaPreview(work.coverImage, 'cover')}
              {renderMediaPreview(work.profileVideo, 'profile')}
              {renderMediaPreview(work.profileImage, 'profile')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timestamps */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Timestamps</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="text-sm">{new Date(work.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated At</label>
              <p className="text-sm">{new Date(work.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
