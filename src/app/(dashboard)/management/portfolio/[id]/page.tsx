'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AxiosProgressEvent } from 'axios'
import { toast } from 'sonner'
import { Plus, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { WorkResponse, GalleryResponse, Service, UpdateWorkRequest } from '@/types/api'
import { portfolioApi } from '@/lib/api/portfolio'
import { servicesApi } from '@/lib/api/services'
import { WorkForm } from '@/components/portfolio/work-form'
import { WorkDetail } from '@/components/portfolio/work-detail'
import { GallerySection } from '@/components/portfolio/gallery-section'

export default function PortfolioDetailPage() {
  const params = useParams()
  const workId = params.id as string

  const [work, setWork] = useState<WorkResponse | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [galleries, setGalleries] = useState<GalleryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showAddGallery, setShowAddGallery] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isMobileGrid, setIsMobileGrid] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (workId) {
      loadWork()
      loadServices()
    }
  }, [workId])

  useEffect(() => {
    if (work) {
      loadGalleries()
    }
  }, [work])

  const loadWork = async () => {
    try {
      setLoading(true)
      const response = await portfolioApi.getById(workId)
      if (response.success && response.data) {
        setWork(response.data)
      }
    } catch (error) {
      console.error('Failed to load work:', error)
      toast.error('Failed to load work')
    } finally {
      setLoading(false)
    }
  }

  const loadServices = async () => {
    try {
      const response = await servicesApi.getAll()
      if (response.success && response.data) {
        setServices(Array.isArray(response.data) ? response.data : [])
      }
    } catch (error) {
      console.error('Failed to load services:', error)
    }
  }

  const loadGalleries = async () => {
    if (!work) return

    try {
      const response = await portfolioApi.getGalleries(work.id)
      if (response.success && response.data) {
        setGalleries(Array.isArray(response.data) ? response.data : [])
      }
    } catch (error) {
      console.error('Failed to load galleries:', error)
      toast.error('Failed to load galleries')
    }
  }

  const handleEditWork = async (data: UpdateWorkRequest, config?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }) => {
    if (!work) return

    try {
      setIsSubmitting(true)
      const response = await portfolioApi.update(work.id, data, config)
      if (response.success && response.data) {
        setWork(response.data)
        toast.success('Work updated successfully')
        setShowEditForm(false)
      }
    } catch (error) {
      console.error('Failed to update work:', error)
      toast.error('Failed to update work')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const response = await portfolioApi.updateActivityStatus(id, active)
      if (response.success && response.data) {
        setWork(response.data)
        toast.success(`Work ${active ? 'activated' : 'deactivated'} successfully`)
      }
    } catch (error) {
      console.error('Failed to update work status:', error)
      toast.error('Failed to update work status')
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this work? This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      await portfolioApi.delete(id)
      toast.success('Work deleted successfully')
      window.history.back()
    } catch (error) {
      console.error('Failed to delete work:', error)
      toast.error('Failed to delete work')
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

  const handleRemoveFileFromGallery = async (galleryId: string, itemId: string) => {
    try {
      const response = await portfolioApi.removeFilesFromGallery(galleryId, {
        galleryItemIds: [itemId]
      })
      if (response.success && response.data) {
        setGalleries(prev => 
          prev.map(gallery => 
            gallery.id === galleryId ? response.data! : gallery
          )
        )
        toast.success('File removed from gallery successfully')
      }
    } catch (error) {
      console.error('Failed to remove file from gallery:', error)
      toast.error('Failed to remove file from gallery')
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
      setUploadProgress(0)

      const config = {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percentCompleted)
          }
        }
      }

      const response = await portfolioApi.createGallery(work.id, {
        isMobileGrid,
        files: selectedFiles
      }, config)

      if (response.success && response.data) {
        setGalleries(prev => [...prev, response.data!])
        setSelectedFiles([])
        setShowAddGallery(false)
        setIsMobileGrid(false)
        setUploadProgress(100)
        toast.success('Gallery created successfully')
      }
    } catch (error) {
      console.error('Failed to create gallery:', error)
      toast.error('Failed to create gallery')
    } finally {
      setUploadingGallery(false)
      setUploadProgress(0)
    }
  }

  const handleAddFilesToGallery = async (galleryId: string, files: File[]) => {
    try {
      setUploadingGallery(true)
      setUploadProgress(0)

      const config = {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percentCompleted)
          }
        }
      }

      const response = await portfolioApi.addFilesToGallery(galleryId, files, config)

      if (response.success && response.data) {
        setGalleries(prev => 
          prev.map(gallery => 
            gallery.id === galleryId ? response.data! : gallery
          )
        )
        setUploadProgress(100)
        toast.success('Files added to gallery successfully')
      }
    } catch (error) {
      console.error('Failed to add files to gallery:', error)
      toast.error('Failed to add files to gallery')
    } finally {
      setUploadingGallery(false)
      setUploadProgress(0)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-muted-foreground">Loading work details...</p>
        </div>
      </div>
    )
  }

  if (!work) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Work not found</h2>
            <p className="text-muted-foreground">The work you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Work Details */}
      <WorkDetail
        work={work}
        services={services}
        onEdit={() => setShowEditForm(true)}
        onToggleActive={handleToggleActive}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
      />

      {/* Galleries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Galleries</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {galleries.length} gallery{galleries.length !== 1 ? 'ies' : 'y'}
            </div>
            <Button
              onClick={() => setShowAddGallery(true)}
              className="gap-2"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4" />
              Add Gallery
            </Button>
          </div>
        </div>

        {/* Add Gallery Form */}
        {showAddGallery && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Create New Gallery</h3>
                  <Button
                    onClick={() => {
                      setShowAddGallery(false)
                      setSelectedFiles([])
                      setIsMobileGrid(false)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>

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
                  <span className="text-sm text-muted-foreground">
                    {selectedFiles.length} files selected
                  </span>
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

                {/* File Preview */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Preview ({selectedFiles.length} files)</Label>
                    <div className="flex gap-2 w-full">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group flex-1 min-w-0 border-2 border-dashed border-blue-300">
                          <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
                            {file.type.startsWith('video/') ? (
                              <video
                                src={URL.createObjectURL(file)}
                                className="w-full h-auto object-cover"
                                controls
                              />
                            ) : (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-auto object-cover"
                              />
                            )}
                          </div>
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-5 w-5 p-0"
                              onClick={() => {
                                setSelectedFiles(prev => prev.filter((_, i) => i !== index))
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                            New
                          </div>
                        </div>
                      ))}
                      
                      {/* Upload button */}
                      <div className="flex-1 min-w-0">
                        <div className="w-full bg-green-50 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center p-4">
                          {uploadingGallery ? (
                            <div className="space-y-2 text-center">
                              <div className="text-xs font-medium">Uploading...</div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-green-600 h-1.5 rounded-full transition-all duration-300" 
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-600">{uploadProgress}%</div>
                            </div>
                          ) : (
                            <div className="space-y-1 text-center">
                              <Button
                                onClick={handleCreateGallery}
                                className="gap-1 bg-green-600 hover:bg-green-700 text-xs"
                                size="sm"
                                disabled={selectedFiles.length === 0}
                              >
                                <Upload className="h-3 w-3" />
                                Create Gallery
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {galleries.length === 0 && !showAddGallery ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-muted-foreground">No galleries yet. Add your first gallery to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {galleries.map((gallery) => (
              <GallerySection
                key={gallery.id}
                gallery={gallery}
                onToggleMobileGrid={handleToggleGalleryMobileGrid}
                onDeleteGallery={handleDeleteGallery}
                onRemoveFile={handleRemoveFileFromGallery}
                onAddFiles={handleAddFilesToGallery}
                isSubmitting={isSubmitting}
                isUploading={uploadingGallery}
                uploadProgress={uploadProgress}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
      <WorkForm
        work={work}
        services={services}
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleEditWork}
        isLoading={isSubmitting}
      />
    </div>
  )
}