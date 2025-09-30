'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { SocialMedia, CreateSocialMediaRequest, UpdateSocialMediaRequest } from '@/types/api'

const socialMediaSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must not exceed 100 characters'),
  url: z.string()
    .min(1, 'URL is required')
    .max(500, 'URL must not exceed 500 characters')
    .url('Please enter a valid URL')
})

type SocialMediaFormData = z.infer<typeof socialMediaSchema>

interface SocialMediaFormProps {
  socialMedia?: SocialMedia
  onSubmit: (data: CreateSocialMediaRequest | UpdateSocialMediaRequest) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function SocialMediaForm({ socialMedia, onSubmit, onCancel, isLoading = false }: SocialMediaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SocialMediaFormData>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      title: socialMedia?.title || '',
      url: socialMedia?.url || ''
    }
  })

  const handleFormSubmit = async (data: SocialMediaFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Failed to save social media link')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    reset()
    onCancel()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {socialMedia ? 'Edit Social Media Link' : 'Add New Social Media Link'}
        </CardTitle>
        <CardDescription>
          {socialMedia 
            ? 'Update the social media link information'
            : 'Add a new social media link to your website'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="e.g., Facebook, Instagram, Twitter"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              {...register('url')}
              placeholder="https://example.com"
              className={errors.url ? 'border-red-500' : ''}
            />
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
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
              {isSubmitting ? 'Saving...' : (socialMedia ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
