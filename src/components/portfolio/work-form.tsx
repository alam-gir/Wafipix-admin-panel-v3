'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Upload, X, ImageIcon, Video, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { WorkResponse, CreateWorkRequest, UpdateWorkRequest, Service, FileResponse } from '@/types/api'
import { AxiosProgressEvent } from 'axios'
import { validateFile, formatFileSize } from '@/lib/utils/file-upload'
import RichTextEditor from '../ui/rich-text-editor'

// Helper function to count text content without HTML tags
const getTextContentLength = (htmlString: string): number => {
  if (!htmlString) return 0
  // Create a temporary div to parse HTML and extract text content
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlString
  return tempDiv.textContent?.length || 0
}

const workFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters'),
  serviceId: z.string().min(1, 'Service is required'),
  description: z.string()
    .refine((val) => {
      if (!val) return true // Optional field
      const textLength = getTextContentLength(val)
      return textLength <= 1000
    }, 'Description must not exceed 1000 characters.')
    .optional(),
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
      // Enhanced file validation
      const isVideo = type.includes('Video')
      const isImage = type.includes('Image')
      
      const validation = validateFile(file, {
        maxSize: 100 * 1024 * 1024, // 100MB limit
        allowedTypes: isVideo ? ['video/'] : ['image/'],
        allowedExtensions: isVideo 
          ? ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'] 
          : ['jpg', 'jpeg', 'png', 'gif', 'webp']
      })
      
      if (!validation.isValid) {
        toast.error(validation.error || 'Invalid file')
        return
      }

      toast.success(`File selected: ${formatFileSize(file.size)}`)
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
    let progressInterval: NodeJS.Timeout | undefined
    
    try {
      // Validate cover media (at least one required)
      const hasCoverMedia = coverVideo || coverImage || (work && (work.coverVideo || work.coverImage))
      if (!hasCoverMedia) {
        toast.error('Cover media is required. Please upload at least one cover image or video.')
        return
      }

      // Profile media is now optional - no validation needed

      setIsUploading(true)
      setUploadProgress(0)
      
      // Start progress simulation for better UX
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev // Don't go above 90% until real progress
          return prev + Math.random() * 10
        })
      }, 200)

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

      // Real upload progress tracking with smooth updates
      const config = {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            console.log(`Upload progress: ${percentCompleted}% (${progressEvent.loaded}/${progressEvent.total})`)
            setUploadProgress(percentCompleted)
          } else {
            // If total is not available, simulate progress
            const simulatedProgress = Math.min(95, uploadProgress + 10)
            setUploadProgress(simulatedProgress)
          }
        }
      }

      await onSubmit(formData, config) // Pass config for progress tracking
      
      // Clear the progress simulation
      clearInterval(progressInterval)
      
      // Complete the progress bar
      setUploadProgress(100)
      
      // Small delay to show 100% completion
      setTimeout(() => {
        // Reset form and close modal
        reset()
        setCoverVideo(null)
        setCoverImage(null)
        setProfileVideo(null)
        setProfileImage(null)
        onClose()
      }, 500)
      
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Failed to save work')
    } finally {
      // Clear the progress simulation if it exists
      if (progressInterval) {
        clearInterval(progressInterval)
      }
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
    const Icon = isVideo ? Video : ImageIcon
    const isRequired = type.includes('cover') // Only cover fields are required

    return (
      <div className="space-y-2">
        <Label htmlFor={type}>
          {label} {isRequired && <span className="text-red-500">*</span>}
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
                <Image
                  src={existingFile.publicUrl}
                  alt={existingFile.fileName}
                  width={200}
                  height={200}
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
                <Image
                  src={URL.createObjectURL(currentFile)}
                  alt={currentFile.name}
                  width={200}
                  height={200}
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
              <RichTextEditor
                value={watch('description') || ''}
                onChange={(content) => setValue('description', content)}
                placeholder="Enter work description with rich formatting..."
                className={errors.description ? 'border-red-500' : ''}
              />
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Rich text formatting is supported</span>
                <span className={getTextContentLength(watch('description') || '') > 1000 ? 'text-red-500' : ''}>
                  {getTextContentLength(watch('description') || '')}/1000 characters
                </span>
              </div>
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
              {renderFileInput('profileVideo', 'Profile Video (Optional)', profileVideo, work?.profileVideo)}
              {renderFileInput('profileImage', 'Profile Image (Optional)', profileImage, work?.profileImage)}
            </div>
            <p className="text-sm text-muted-foreground">
              Note: Cover media (image or video) is required. Profile media is optional. Maximum file size: 100MB.
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
