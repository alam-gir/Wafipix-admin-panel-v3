'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Upload, X, Image, Video, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { WorkResponse, CreateWorkRequest, UpdateWorkRequest, Service, FileResponse } from '@/types/api'
import { AxiosProgressEvent } from 'axios'

const workFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters'),
  serviceId: z.string().min(1, 'Service is required'),
  description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
}).refine(() => {
  // This will be validated in the component with access to file states
  return true
}, {
  message: "Cover and profile media validation will be handled in component"
})

type WorkFormData = z.infer<typeof workFormSchema>

interface UploadConfig {
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
}

interface WorkFormProps {
  work?: WorkResponse
  services: Service[]
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateWorkRequest | UpdateWorkRequest, config?: UploadConfig) => Promise<void>
  isLoading?: boolean
}

export function WorkForm({ work, services, isOpen, onClose, onSubmit, isLoading = false }: WorkFormProps) {
  const [coverVideo, setCoverVideo] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [profileVideo, setProfileVideo] = useState<File | null>(null)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<WorkFormData>({
    resolver: zodResolver(workFormSchema),
    defaultValues: {
      title: work?.title || '',
      serviceId: work?.service.id || '',
      description: work?.description || ''
    }
  })

  // Reset form when work changes
  useEffect(() => {
    if (work) {
      reset({
        title: work.title,
        serviceId: work.service.id,
        description: work.description || ''
      })
    } else {
      reset({
        title: '',
        serviceId: '',
        description: ''
      })
    }
    // Clear file states
    setCoverVideo(null)
    setCoverImage(null)
    setProfileVideo(null)
    setProfileImage(null)
  }, [work, reset])

  const handleFileChange = (type: 'coverVideo' | 'coverImage' | 'profileVideo' | 'profileImage', file: File | null) => {
    if (file) {
      // Validate file type
      const isVideo = file.type.startsWith('video/')
      const isImage = file.type.startsWith('image/')
      
      if (!isVideo && !isImage) {
        toast.error('Please select a valid image or video file')
        return
      }
      
      // Validate file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB')
        return
      }

      // Validate file type matches expected type
      if (type.includes('Video') && !isVideo) {
        toast.error('Please select a video file')
        return
      }
      if (type.includes('Image') && !isImage) {
        toast.error('Please select an image file')
        return
      }
    }

    switch (type) {
      case 'coverVideo':
        setCoverVideo(file)
        break
      case 'coverImage':
        setCoverImage(file)
        break
      case 'profileVideo':
        setProfileVideo(file)
        break
      case 'profileImage':
        setProfileImage(file)
        break
    }
  }

  const clearFile = (type: 'coverVideo' | 'coverImage' | 'profileVideo' | 'profileImage') => {
    switch (type) {
      case 'coverVideo':
        setCoverVideo(null)
        break
      case 'coverImage':
        setCoverImage(null)
        break
      case 'profileVideo':
        setProfileVideo(null)
        break
      case 'profileImage':
        setProfileImage(null)
        break
    }
  }

  const handleFormSubmit = async (data: WorkFormData) => {
    try {
      // Validate cover media (at least one required)
      const hasCoverMedia = coverVideo || coverImage || (work && (work.coverVideo || work.coverImage))
      if (!hasCoverMedia) {
        toast.error('Cover media is required. Please upload at least one cover image or video.')
        return
      }

      // Validate profile media (at least one required)
      const hasProfileMedia = profileVideo || profileImage || (work && (work.profileVideo || work.profileImage))
      if (!hasProfileMedia) {
        toast.error('Profile media is required. Please upload at least one profile image or video.')
        return
      }

      setIsUploading(true)
      setUploadProgress(0)

      const formData: CreateWorkRequest | UpdateWorkRequest = {
        title: data.title,
        serviceId: data.serviceId, // Always include serviceId
        description: data.description,
        ...(coverVideo && { coverVideo }),
        ...(coverImage && { coverImage }),
        ...(profileVideo && { profileVideo }),
        ...(profileImage && { profileImage })
      }

      console.log('Form data being submitted:', formData) // Debug log

      // Real upload progress tracking
      const config = {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percentCompleted)
          }
        }
      }

      await onSubmit(formData, config) // Pass config for progress tracking
      
      // Reset form and close modal
      reset()
      setCoverVideo(null)
      setCoverImage(null)
      setProfileVideo(null)
      setProfileImage(null)
      onClose()
      
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Failed to save work')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleCancel = () => {
    reset()
    setCoverVideo(null)
    setCoverImage(null)
    setProfileVideo(null)
    setProfileImage(null)
    onClose()
  }

  const renderFileInput = (
    type: 'coverVideo' | 'coverImage' | 'profileVideo' | 'profileImage',
    label: string,
    currentFile: File | null,
    existingFile?: FileResponse
  ) => {
    const isVideo = type.includes('Video')
    const Icon = isVideo ? Video : Image

    return (
      <div className="space-y-2">
        <Label htmlFor={type}>
          {label} <span className="text-red-500">*</span>
        </Label>
        
        {/* Show existing file if available */}
        {existingFile && existingFile.publicUrl && !currentFile && (
          <div className="space-y-2">
            <div className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
              {isVideo ? (
                <video
                  src={existingFile.publicUrl}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={existingFile.publicUrl}
                  alt={existingFile.fileName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{existingFile.fileName}</p>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(type)?.click()}
            className="gap-2"
            disabled={isUploading}
          >
            <Upload className="h-4 w-4" />
            {currentFile ? 'Change' : (existingFile ? 'Replace' : 'Upload')}
          </Button>
          {(currentFile || existingFile) && (
            <Button
              type="button"
              variant="outline"
              onClick={() => clearFile(type)}
              className="gap-2"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
        <input
          id={type}
          type="file"
          accept={isVideo ? 'video/*' : 'image/*'}
          onChange={(e) => handleFileChange(type, e.target.files?.[0] || null)}
          className="hidden"
          disabled={isUploading}
        />
        {currentFile && (
          <div className="space-y-2">
            <div className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
              {isVideo ? (
                <video
                  src={URL.createObjectURL(currentFile)}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={URL.createObjectURL(currentFile)}
                  alt={currentFile.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon className="h-4 w-4" />
              <span>{currentFile.name}</span>
              <span>({(currentFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {work ? 'Edit Work' : 'Create New Work'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter work title"
                className={errors.title ? 'border-red-500' : ''}
                disabled={isUploading}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceId">Service *</Label>
              <Select
                value={watch('serviceId')}
                onValueChange={(value) => setValue('serviceId', value)}
                disabled={isUploading}
              >
                <SelectTrigger className={errors.serviceId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceId && (
                <p className="text-sm text-red-500">{errors.serviceId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter work description"
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
                disabled={isUploading}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Media Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Media Files</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFileInput('coverVideo', 'Cover Video', coverVideo, work?.coverVideo)}
              {renderFileInput('coverImage', 'Cover Image', coverImage, work?.coverImage)}
              {renderFileInput('profileVideo', 'Profile Video', profileVideo, work?.profileVideo)}
              {renderFileInput('profileImage', 'Profile Image', profileImage, work?.profileImage)}
            </div>
            <p className="text-sm text-muted-foreground">
              Note: Cover media (image or video) and Profile media (image or video) are required. Maximum file size: 100MB.
            </p>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isUploading || isLoading}
            >
              {isUploading ? 'Uploading...' : (work ? 'Update Work' : 'Create Work')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
