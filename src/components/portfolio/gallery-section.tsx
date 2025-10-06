'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Upload } from 'lucide-react'
import { GalleryResponse, FileObject } from '@/types/api'
import { GalleryItem } from './gallery-item'
import { FilePreview } from './file-preview'
import { FloatingUploadButton } from './floating-upload-button'

interface GallerySectionProps {
  gallery: GalleryResponse
  onToggleMobileGrid: (galleryId: string, isMobileGrid: boolean) => void
  onDeleteGallery: (galleryId: string) => void
  onRemoveFile: (galleryId: string, itemId: string) => void
  onAddFiles: (galleryId: string, files: FileObject[]) => void
  isSubmitting?: boolean
  isUploading?: boolean
  uploadProgress?: number
}

export function GallerySection({
  gallery,
  onToggleMobileGrid,
  onDeleteGallery,
  onRemoveFile,
  onAddFiles,
  isSubmitting = false,
  isUploading = false,
  uploadProgress = 0
}: GallerySectionProps) {
  const [showAddFiles, setShowAddFiles] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileObject[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onAddFiles(gallery.id, selectedFiles)
      setSelectedFiles([])
      setShowAddFiles(false)
    }
  }

  const handleCancel = () => {
    setSelectedFiles([])
    setShowAddFiles(false)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Gallery Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`mobile-grid-${gallery.id}`}
                  checked={gallery.isMobileGrid}
                  onCheckedChange={(checked) => onToggleMobileGrid(gallery.id, checked)}
                  disabled={isSubmitting}
                />
                <Label htmlFor={`mobile-grid-${gallery.id}`} className="text-sm">
                  Mobile Grid
                </Label>
              </div>
              <Badge variant="outline" className="text-xs">
                {gallery.items.length} items
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowAddFiles(true)}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4" />
                Add Files
              </Button>
              <Button
                onClick={() => onDeleteGallery(gallery.id)}
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

          {/* Gallery Grid */}
          <div className="relative">
            <div className="flex gap-2 w-full">
              {/* Existing gallery items */}
              {gallery.items.map((item) => {
                if (!item.file?.publicUrl) return null
                
                return (
                  <GalleryItem
                    key={item.id}
                    item={item}
                    onRemove={(itemId) => onRemoveFile(gallery.id, itemId)}
                    isSubmitting={isSubmitting}
                  />
                )
              })}
              
              {/* New file previews */}
              {showAddFiles && selectedFiles.map((file, index) => (
                <FilePreview
                  key={`preview-${index}`}
                  file={file}
                  index={index}
                  onRemove={handleRemoveFile}
                />
              ))}

              {/* Upload button */}
              {showAddFiles && selectedFiles.length > 0 && (
                <FloatingUploadButton
                  fileCount={selectedFiles.length}
                  onUpload={handleUpload}
                  onCancel={handleCancel}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />
              )}
            </div>
          </div>

          {/* File input (hidden) */}
          {showAddFiles && selectedFiles.length === 0 && (
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById(`gallery-files-${gallery.id}`)?.click()}
                className="gap-2"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
                Choose Files
              </Button>
              <Button
                onClick={() => setShowAddFiles(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}
          
          <input
            id={`gallery-files-${gallery.id}`}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </CardContent>
    </Card>
  )
}
