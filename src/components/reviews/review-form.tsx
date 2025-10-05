'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Star, Upload, X } from 'lucide-react'
import { Review, CreateReviewRequest, UpdateReviewRequest } from '@/types/api'
import { validateFile, formatFileSize, createProgressHandler, UploadProgress } from '@/lib/utils/file-upload'
import { AxiosProgressEvent } from 'axios'

const reviewSchema = z.object({
  platform: z.string()
    .min(1, 'Platform is required')
    .max(100, 'Platform must not exceed 100 characters'),
  clientName: z.string()
    .max(100, 'Client name must not exceed 100 characters')
    .optional(),
  rating: z.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  reviewText: z.string()
    .max(5000, 'Review text must not exceed 5000 characters')
    .optional(),
  reviewImage: z.instanceof(File).optional()
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormModalProps {
  review?: Review
  onSubmit: (data: CreateReviewRequest | UpdateReviewRequest, config?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  availablePlatforms?: string[]
  isOpen: boolean
}

export function ReviewFormModal({ 
  review, 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  availablePlatforms = [],
  isOpen 
}: ReviewFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isCustomPlatform, setIsCustomPlatform] = useState(false)
  const [customPlatformName, setCustomPlatformName] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      platform: review?.platform || '',
      clientName: review?.clientName || '',
      rating: review?.rating || 5,
      reviewText: review?.reviewText || ''
    }
  })

  const watchedRating = watch('rating')

  // Reset form when review prop changes
  useEffect(() => {
    reset({
      platform: review?.platform || '',
      clientName: review?.clientName || '',
      rating: review?.rating || 5,
      reviewText: review?.reviewText || ''
    })
    
    // Reset image states
    setSelectedImage(null)
    setPreviewUrl('')
    setIsCustomPlatform(false)
    setCustomPlatformName('')
  }, [review, reset])

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Enhanced file validation
      const validation = validateFile(file, {
        maxSize: 5 * 1024 * 1024, // 5MB limit for review images
        allowedTypes: ['image/'],
        allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp']
      })
      
      if (!validation.isValid) {
        toast.error(validation.error || 'Invalid file')
        return
      }

      setSelectedImage(file)
      setValue('reviewImage', file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      toast.success(`Image selected: ${formatFileSize(file.size)}`)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setValue('reviewImage', undefined)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl('')
    }
  }

  const handleFormSubmit = async (data: ReviewFormData) => {
    try {
      setIsSubmitting(true)
      setIsUploading(true)
      setUploadProgress(0)

      // Create enhanced progress handler
      const progressHandler = createProgressHandler((progress: UploadProgress) => {
        setUploadProgress(progress.percentage)
      })

      await onSubmit(data, {
        onUploadProgress: progressHandler
      })
      
      reset()
      clearImage()
      setIsCustomPlatform(false)
      setCustomPlatformName('')
      setUploadProgress(100)
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Failed to save review')
    } finally {
      setIsSubmitting(false)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleCancel = () => {
    reset()
    clearImage()
    setIsCustomPlatform(false)
    setCustomPlatformName('')
    onCancel()
  }


  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {review ? 'Edit Review' : 'Add New Review'}
          </DialogTitle>
          <DialogDescription>
            {review 
              ? 'Update the review information'
              : 'Add a new customer review'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform *</Label>
            <div className="space-y-2">
              <Select
                value={isCustomPlatform ? 'custom' : watch('platform')}
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setIsCustomPlatform(true)
                    setCustomPlatformName('')
                  } else {
                    setIsCustomPlatform(false)
                    setValue('platform', value)
                  }
                }}
              >
                <SelectTrigger className={errors.platform ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlatforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Platform</SelectItem>
                </SelectContent>
              </Select>
              {isCustomPlatform && (
                <Input
                  value={customPlatformName}
                  onChange={(e) => {
                    setCustomPlatformName(e.target.value)
                    setValue('platform', e.target.value)
                  }}
                  placeholder="Enter custom platform name"
                  className={errors.platform ? 'border-red-500' : ''}
                />
              )}
            </div>
            {errors.platform && (
              <p className="text-sm text-red-500">{errors.platform.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              {...register('clientName')}
              placeholder="e.g., John Doe"
              className={errors.clientName ? 'border-red-500' : ''}
            />
            {errors.clientName && (
              <p className="text-sm text-red-500">{errors.clientName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating *</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {watchedRating} out of 5
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setValue('rating', i + 1)}
                    className="focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        i < watchedRating 
                          ? 'fill-yellow-400 text-yellow-400 hover:text-yellow-500' 
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            {errors.rating && (
              <p className="text-sm text-red-500">{errors.rating.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewText">Review Text</Label>
            <Textarea
              id="reviewText"
              {...register('reviewText')}
              placeholder="Enter the review text..."
              rows={4}
              className={errors.reviewText ? 'border-red-500' : ''}
            />
            {errors.reviewText && (
              <p className="text-sm text-red-500">{errors.reviewText.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewImage">Review Image</Label>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="reviewImage"
                  />
                  <label
                    htmlFor="reviewImage"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4" />
                    {selectedImage ? 'Change Image' : 'Select Image'}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, GIF up to 5MB
                  </p>
                </div>
                {selectedImage && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Image Preview */}
              {(previewUrl || review?.reviewImage) && (
                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    <Image
                      src={previewUrl || review?.reviewImage || ''}
                      alt="Review preview"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading image...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'Saving...' : (review ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
