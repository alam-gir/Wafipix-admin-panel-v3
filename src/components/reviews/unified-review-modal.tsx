'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, Edit, Trash2, Eye, EyeOff, Save, X, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Review, UpdateReviewRequest } from '@/types/api'
import { reviewsApi } from '@/lib/api/reviews'

interface UnifiedReviewModalProps {
  review: Review | null
  isOpen: boolean
  onClose: () => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, active: boolean) => void
  onUpdateReview: (updatedReview: Review) => void
  availablePlatforms: string[]
  isSubmitting?: boolean
}

export function UnifiedReviewModal({
  review,
  isOpen,
  onClose,
  onDelete,
  onToggleActive,
  onUpdateReview,
  availablePlatforms,
  isSubmitting = false
}: UnifiedReviewModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isCustomPlatform, setIsCustomPlatform] = useState(false)
  const [customPlatformName, setCustomPlatformName] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [formData, setFormData] = useState({
    platform: '',
    clientName: '',
    rating: 5,
    reviewText: ''
  })

  // Reset form when review changes
  useEffect(() => {
    if (review) {
      setFormData({
        platform: review.platform,
        clientName: review.clientName || '',
        rating: review.rating,
        reviewText: review.reviewText || ''
      })
      setIsCustomPlatform(!availablePlatforms.includes(review.platform))
      setCustomPlatformName(!availablePlatforms.includes(review.platform) ? review.platform : '')
      setPreviewUrl('')
      setSelectedImage(null)
    }
  }, [review, availablePlatforms])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const renderClickableStars = (rating: number, onRatingChange: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onRatingChange(i + 1)}
        className="focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded"
      >
        <Star
          className={`h-6 w-6 transition-colors ${
            i < rating
              ? 'fill-yellow-400 text-yellow-400 hover:text-yellow-500'
              : 'text-gray-300 hover:text-yellow-300'
          }`}
        />
      </button>
    ))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl('')
    }
  }

  const handleSave = async () => {
    if (!review) return

    try {
      const updateData: UpdateReviewRequest = {
        platform: formData.platform,
        clientName: formData.clientName || undefined,
        rating: formData.rating,
        reviewText: formData.reviewText || undefined,
        reviewImage: selectedImage || undefined
      }

      const response = await reviewsApi.update(review.id, updateData)
      if (response.success && response.data) {
        // Update the review prop with new data
        Object.assign(review, response.data)
        // Notify parent component about the update
        onUpdateReview(response.data)
        toast.success('Review updated successfully')
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Failed to update review:', error)
      toast.error('Failed to update review')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data
    if (review) {
      setFormData({
        platform: review.platform,
        clientName: review.clientName || '',
        rating: review.rating,
        reviewText: review.reviewText || ''
      })
      setIsCustomPlatform(!availablePlatforms.includes(review.platform))
      setCustomPlatformName(!availablePlatforms.includes(review.platform) ? review.platform : '')
    }
    clearImage()
  }

  const handleDelete = () => {
    if (review) {
      onDelete(review.id)
    }
  }

  if (!review) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? 'Edit Review' : 'Review Details'}</span>
            <Badge variant={review.active ? 'default' : 'secondary'}>
              {review.active ? 'Active' : 'Inactive'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Review Image */}
          {(review.reviewImage || previewUrl) && (
            <div className="w-full">
              <Image
                src={previewUrl || review.reviewImage}
                alt="Review"
                width={400}
                height={256}
                className="w-full h-64 object-cover rounded-lg"
              />
              {isEditing && (
                <div className="mt-2 flex gap-2">
                  <Button
                    onClick={() => document.getElementById('image-upload')?.click()}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Change Image
                  </Button>
                  <Button
                    onClick={clearImage}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}

          {/* Platform and Rating */}
          <div className="space-y-4">
            {/* Platform */}
            <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              {isEditing ? (
                <div className="space-y-2">
                  <Select
                    value={isCustomPlatform ? 'custom' : formData.platform}
                    onValueChange={(value) => {
                      if (value === 'custom') {
                        setIsCustomPlatform(true)
                        setCustomPlatformName('')
                        setFormData(prev => ({ ...prev, platform: '' }))
                      } else {
                        setIsCustomPlatform(false)
                        setFormData(prev => ({ ...prev, platform: value }))
                      }
                    }}
                  >
                    <SelectTrigger>
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
                        setFormData(prev => ({ ...prev, platform: e.target.value }))
                      }}
                      placeholder="Enter custom platform name"
                    />
                  )}
                </div>
              ) : (
                <p className="text-lg font-semibold text-gray-900">{review.platform}</p>
              )}
            </div>

            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              {isEditing ? (
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Enter client name"
                />
              ) : (
                <p className="text-sm text-gray-600">
                  {review.clientName ? `By ${review.clientName}` : 'No client name provided'}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label>Rating</Label>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {formData.rating} out of 5
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderClickableStars(formData.rating, (rating) => 
                      setFormData(prev => ({ ...prev, rating }))
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {review.rating} out of 5
                  </span>
                </div>
              )}
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <Label htmlFor="reviewText">Review Text</Label>
              {isEditing ? (
                <Textarea
                  id="reviewText"
                  value={formData.reviewText}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
                  placeholder="Enter review text"
                  rows={4}
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <blockquote className="text-gray-700 italic">
                    &ldquo;{review.reviewText || 'No review text provided'}&rdquo;
                  </blockquote>
                </div>
              )}
            </div>

            {/* Metadata */}
            {!isEditing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span> {new Date(review.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {new Date(review.updatedAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Created by:</span> {review.createdBy}
                </div>
                <div>
                  <span className="font-medium">Updated by:</span> {review.updatedBy}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          {isEditing ? (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 gap-2"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 gap-2"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="flex-1 gap-2"
                disabled={isSubmitting}
              >
                <Edit className="h-4 w-4" />
                Edit Review
              </Button>
              
              <Button
                onClick={() => onToggleActive(review.id, !review.active)}
                variant={review.active ? "secondary" : "default"}
                className="flex-1 gap-2"
                disabled={isSubmitting}
              >
                {review.active ? (
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
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
