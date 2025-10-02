'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HtmlViewer } from '@/components/ui/html-viewer'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Plus, 
  Image, 
  Video, 
  Grid3X3, 
  List,
  X,
  Upload
} from 'lucide-react'
import { toast } from 'sonner'
import { WorkResponse, GalleryResponse, Service } from '@/types/api'
import { portfolioApi } from '@/lib/api/portfolio'

interface WorkDetailModalProps {
  work: WorkResponse | null
  services: Service[]
  isOpen: boolean
  onClose: () => void
  onEdit: (work: WorkResponse) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, active: boolean) => void
  onUpdateWork: (updatedWork: WorkResponse) => void
  isSubmitting?: boolean
}

export function WorkDetailModal({
  work,
  services,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleActive,
  onUpdateWork,
  isSubmitting = false
}: WorkDetailModalProps) {
  const [galleries, setGalleries] = useState<GalleryResponse[]>([])
  const [loadingGalleries, setLoadingGalleries] = useState(false)
  const [showAddGallery, setShowAddGallery] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isMobileGrid, setIsMobileGrid] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  // Load galleries when work changes
  useEffect(() => {
    if (work && isOpen) {
      loadGalleries()
    }
  }, [work, isOpen])

  const loadGalleries = async () => {
    if (!work) return

    try {
      setLoadingGalleries(true)
      const response = await portfolioApi.getGalleries(work.id)
      if (response.success && response.data) {
        setGalleries(response.data)
      }
    } catch (error) {
      console.error('Failed to load galleries:', error)
      toast.error('Failed to load galleries')
    } finally {
      setLoadingGalleries(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
  }

  const handleCreateGallery = async () => {
    if (!work || selectedFiles.length === 0) return

    try {
      setUploadingGallery(true)
      const response = await portfolioApi.createGallery(work.id, {
        isMobileGrid,
        files: selectedFiles
      })

      if (response.success && response.data) {
        setGalleries(prev => [...prev, response.data!])
        setSelectedFiles([])
        setShowAddGallery(false)
        setIsMobileGrid(false)
        toast.success('Gallery created successfully')
      }
    } catch (error) {
      console.error('Failed to create gallery:', error)
      toast.error('Failed to create gallery')
    } finally {
      setUploadingGallery(false)
    }
  }

  const handleToggleGalleryMobileGrid = async (galleryId: string, isMobileGrid: boolean) => {
    try {
      const response = await portfolioApi.updateGallery(galleryId, { isMobileGrid })
      if (response.success && response.data) {
        setGalleries(prev => 
          prev.map(gallery => 
            gallery.id === galleryId ? response.data! : gallery
          )
        )
        toast.success('Gallery updated successfully')
      }
    } catch (error) {
      console.error('Failed to update gallery:', error)
      toast.error('Failed to update gallery')
    }
  }

  const handleDeleteGallery = async (galleryId: string) => {
    if (!window.confirm('Are you sure you want to delete this gallery?')) return

    try {
      await portfolioApi.deleteGallery(galleryId)
      setGalleries(prev => prev.filter(gallery => gallery.id !== galleryId))
      toast.success('Gallery deleted successfully')
    } catch (error) {
      console.error('Failed to delete gallery:', error)
      toast.error('Failed to delete gallery')
    }
  }

  const handleDelete = () => {
    if (work && window.confirm('Are you sure you want to delete this work?')) {
      onDelete(work.id)
    }
  }

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    return service?.title || 'Unknown Service'
  }

  const renderMediaPreview = (file: any, type: 'cover' | 'profile') => {
    if (!file) return null

    const isVideo = file.mimeType?.startsWith('video/')
    const Icon = isVideo ? Video : Image

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4" />
          <span className="text-sm font-medium">{type === 'cover' ? 'Cover' : 'Profile'} {isVideo ? 'Video' : 'Image'}</span>
        </div>
        <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
          {isVideo ? (
            <video
              src={file.url}
              className="w-full h-full object-cover"
              controls
            />
          ) : (
            <img
              src={file.url}
              alt={file.fileName}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{file.fileName}</p>
      </div>
    )
  }

  const renderGallery = (gallery: GalleryResponse) => (
    <Card key={gallery.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Gallery</span>
            <Badge variant={gallery.isMobileGrid ? 'default' : 'secondary'} className="text-xs">
              {gallery.isMobileGrid ? 'Mobile Grid' : 'Single Row'}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={gallery.isMobileGrid}
              onCheckedChange={(checked) => handleToggleGalleryMobileGrid(gallery.id, checked)}
              disabled={isSubmitting}
            />
            <Button
              onClick={() => handleDeleteGallery(gallery.id)}
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

        {/* Gallery Preview */}
        <div className={`grid gap-2 ${
          gallery.isMobileGrid 
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {gallery.items.map((item) => {
            const isVideo = item.file.mimeType?.startsWith('video/')
            return (
              <div key={item.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {isVideo ? (
                    <video
                      src={item.file.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={item.file.url}
                      alt={item.file.fileName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      // TODO: Implement remove file from gallery
                      toast.info('Remove file functionality coming soon')
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )

  if (!work) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{work.title}</span>
            <Badge variant={work.active ? 'default' : 'secondary'}>
              {work.active ? 'Active' : 'Inactive'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Work Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Work Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Service:</span> {getServiceName(work.service.id)}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(work.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {new Date(work.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {work.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <HtmlViewer content={work.description} className="text-sm" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Media Files</h3>
              <div className="grid grid-cols-1 gap-4">
                {renderMediaPreview(work.coverVideo, 'cover')}
                {renderMediaPreview(work.coverImage, 'cover')}
                {renderMediaPreview(work.profileVideo, 'profile')}
                {renderMediaPreview(work.profileImage, 'profile')}
              </div>
            </div>
          </div>

          {/* Galleries Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Galleries</h3>
              <Button
                onClick={() => setShowAddGallery(true)}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4" />
                Add Gallery
              </Button>
            </div>

            {/* Add Gallery Form */}
            {showAddGallery && (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={isMobileGrid}
                        onCheckedChange={setIsMobileGrid}
                        disabled={uploadingGallery}
                      />
                      <Label>Mobile Grid Layout</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Select Files</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('gallery-files')?.click()}
                          className="gap-2"
                          disabled={uploadingGallery}
                        >
                          <Upload className="h-4 w-4" />
                          Choose Files
                        </Button>
                        {selectedFiles.length > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {selectedFiles.length} file(s) selected
                          </span>
                        )}
                      </div>
                      <input
                        id="gallery-files"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploadingGallery}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={handleCreateGallery}
                        disabled={selectedFiles.length === 0 || uploadingGallery}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create Gallery
                      </Button>
                      <Button
                        onClick={() => {
                          setShowAddGallery(false)
                          setSelectedFiles([])
                          setIsMobileGrid(false)
                        }}
                        variant="outline"
                        disabled={uploadingGallery}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Galleries List */}
            {loadingGalleries ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading galleries...</p>
              </div>
            ) : galleries.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="space-y-2">
                    <Grid3X3 className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">No galleries yet</p>
                    <p className="text-xs text-muted-foreground">Add your first gallery to showcase this work</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {galleries.map(renderGallery)}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            onClick={() => onEdit(work)}
            variant="outline"
            className="flex-1 gap-2"
            disabled={isSubmitting}
          >
            <Edit className="h-4 w-4" />
            Edit Work
          </Button>
          
          <Button
            onClick={() => onToggleActive(work.id, !work.active)}
            variant={work.active ? "secondary" : "default"}
            className="flex-1 gap-2"
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
            onClick={handleDelete}
            variant="destructive"
            className="flex-1 gap-2"
            disabled={isSubmitting}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
