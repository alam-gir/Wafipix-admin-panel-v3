'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Star, Eye, EyeOff, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { reviewsApi } from '@/lib/api/reviews'
import { Review, CreateReviewRequest, UpdateReviewRequest } from '@/types/api'
import { ReviewFormModal } from '@/components/reviews/review-form'
import { UnifiedReviewModal } from '@/components/reviews/unified-review-modal'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUnifiedModalOpen, setIsUnifiedModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([])

  // Load reviews and platforms on component mount
  useEffect(() => {
    loadReviews()
    loadPlatforms()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const response = await reviewsApi.getAll()
      if (response.success && response.data) {
        setReviews(response.data)
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const loadPlatforms = async () => {
    try {
      const response = await reviewsApi.getActivePlatforms()
      if (response.success && response.data) {
        setAvailablePlatforms(response.data)
      }
    } catch (error) {
      console.error('Failed to load platforms:', error)
      // Don't show error toast for platforms, it's not critical
    }
  }

  const handleCreate = async (data: CreateReviewRequest) => {
    try {
      setIsSubmitting(true)
      const response = await reviewsApi.create(data)
      if (response.success && response.data) {
        setReviews(prev => [response.data!, ...prev])
        setIsModalOpen(false)
        setShowForm(false)
        toast.success('Review created successfully')
      }
    } catch (error) {
      console.error('Failed to create review:', error)
      toast.error('Failed to create review')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (data: UpdateReviewRequest) => {
    if (!editingReview) return

    try {
      setIsSubmitting(true)
      const response = await reviewsApi.update(editingReview.id, data)
      if (response.success && response.data) {
        setReviews(prev => 
          prev.map(review => 
            review.id === editingReview.id ? response.data! : review
          )
        )
        // Refresh platforms after update to include any new platform
        await loadPlatforms()
        setEditingReview(null)
        setIsModalOpen(false)
        toast.success('Review updated successfully')
      }
    } catch (error) {
      console.error('Failed to update review:', error)
      toast.error('Failed to update review')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const response = await reviewsApi.updateActivityStatus(id, active)
      if (response.success && response.data) {
        setReviews(prev => 
          prev.map(review => 
            review.id === id ? response.data! : review
          )
        )
        // Update selected review if modal is open
        if (isUnifiedModalOpen && selectedReview && selectedReview.id === id) {
          setSelectedReview(response.data)
        }
        toast.success(`Review ${active ? 'activated' : 'deactivated'} successfully`)
        // Refresh platforms in case this affects platform list
        await loadPlatforms()
      }
    } catch (error) {
      console.error('Failed to update review status:', error)
      toast.error('Failed to update review status')
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this review? This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      await reviewsApi.delete(id)
      setReviews(prev => prev.filter(review => review.id !== id))
      toast.success('Review deleted successfully')
      
      // Close modal if it's open for the deleted review
      if (isUnifiedModalOpen && selectedReview && selectedReview.id === id) {
        setSelectedReview(null)
        setIsUnifiedModalOpen(false)
      }
      
      // Refresh platforms in case this affects platform list
      await loadPlatforms()
    } catch (error) {
      console.error('Failed to delete review:', error)
      toast.error('Failed to delete review')
    }
  }

  const handleEdit = (review: Review) => {
    setEditingReview(review)
    setIsModalOpen(true)
    setShowForm(false)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingReview(null)
    setIsModalOpen(false)
  }

  const handleViewDetails = (review: Review) => {
    setSelectedReview(review)
    setIsUnifiedModalOpen(true)
  }

  const handleCloseUnifiedModal = () => {
    setSelectedReview(null)
    setIsUnifiedModalOpen(false)
  }

  const handleUpdateReview = (updatedReview: Review) => {
    // Update the reviews list
    setReviews(prev => 
      prev.map(review => 
        review.id === updatedReview.id ? updatedReview : review
      )
    )
    // Update the selected review in modal
    setSelectedReview(updatedReview)
    // Refresh platforms to include any new platform
    loadPlatforms()
  }

  const handleAddNew = () => {
    setShowForm(true)
    setEditingReview(null)
    setIsModalOpen(true)
  }

  const filteredReviews = reviews.filter(review =>
    review.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.reviewText.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Reviews</h1>
          <p className="text-muted-foreground">
            Manage customer reviews and testimonials
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="gap-1">
            <Star className="h-3 w-3" />
            {reviews.length} Reviews
          </Badge>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Review
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal Form */}
      <ReviewFormModal
        review={editingReview || undefined}
        onSubmit={editingReview ? handleUpdate : handleCreate}
        onCancel={handleCancelForm}
        isLoading={isSubmitting}
        availablePlatforms={availablePlatforms}
        isOpen={isModalOpen}
      />

      {/* Unified Modal */}
      <UnifiedReviewModal
        review={selectedReview}
        isOpen={isUnifiedModalOpen}
        onClose={handleCloseUnifiedModal}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        onUpdateReview={handleUpdateReview}
        availablePlatforms={availablePlatforms}
        isSubmitting={isSubmitting}
      />

      {/* Reviews List */}
      <div className="grid gap-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {searchTerm ? 'No matching reviews found' : 'No reviews'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'Add your first customer review to get started'
                    }
                  </p>
                </div>
                {!searchTerm && (
                  <Button onClick={handleAddNew} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add First Review
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex">
                    {/* Review Image */}
                    {review.reviewImage && (
                      <div className="w-32 h-32 flex-shrink-0 border-r border-gray-200 bg-gray-50 mr-4">
                        <img
                          src={review.reviewImage}
                          alt="Review"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{review.platform}</h3>
                            <Badge variant={review.active ? 'default' : 'secondary'} className="text-xs">
                              {review.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          {review.clientName && (
                            <p className="text-sm text-gray-600 mb-2">
                              By <span className="font-medium">{review.clientName}</span>
                            </p>
                          )}

                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {review.rating} out of 5
                            </span>
                          </div>
                        </div>
                        
                        {/* View Details Button */}
                        <Button
                          onClick={() => handleViewDetails(review)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </div>

                      {/* Review Text */}
                      {review.reviewText && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            "{review.reviewText}"
                          </p>
                        </div>
                      )}

                      {/* Timestamps */}
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>Created: {new Date(review.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(review.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
