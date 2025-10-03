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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, X } from 'lucide-react'
import { Service, CreateServiceRequest, UpdateServiceRequest, Category } from '@/types/api'
import { categoriesApi } from '@/lib/api/categories'

// Zod schema for service validation
const serviceSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters'),
  subtitle: z
    .string()
    .min(1, 'Subtitle is required')
    .max(255, 'Subtitle must be at most 255 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Description must be at most 5000 characters'),
  categoryId: z
    .string()
    .min(1, 'Category is required'),
  icon: z
    .instanceof(File)
    .optional()
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  service?: Service
  onSubmit: (data: CreateServiceRequest | UpdateServiceRequest) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ServiceForm({ service, onSubmit, onCancel, isLoading = false }: ServiceFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: service?.title || '',
      subtitle: service?.subtitle || '',
      description: service?.description || '',
      categoryId: service?.categoryId || '',
      icon: undefined
    }
  })

  const watchedCategoryId = watch('categoryId')

  // Load categories on component mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Set preview for existing service icon
  useEffect(() => {
    if (service?.icon && !selectedFile) {
      setPreviewUrl(service.icon)
    }
  }, [service?.icon, selectedFile])

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll()
      if (response.success && response.data) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setValue('icon', file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleFormSubmit = async (data: ServiceFormData) => {
    try {
      setError(null)
      
      const submitData = {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        categoryId: data.categoryId,
        icon: data.icon || selectedFile
      }

      await onSubmit(submitData as CreateServiceRequest | UpdateServiceRequest)
      reset()
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleCancel = () => {
    reset()
    setSelectedFile(null)
    setPreviewUrl(service?.icon || null)
    onCancel()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{service ? 'Edit Service' : 'Create New Service'}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter service title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum 100 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle *</Label>
              <Input
                id="subtitle"
                {...register('subtitle')}
                placeholder="Enter service subtitle"
                className={errors.subtitle ? 'border-red-500' : ''}
              />
              {errors.subtitle && (
                <p className="text-sm text-red-600">{errors.subtitle.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum 255 characters
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter service description"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Maximum 5000 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <Select
                value={watchedCategoryId}
                onValueChange={(value) => setValue('categoryId', value)}
              >
                <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-600">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon {service ? '(Optional)' : '*'}</Label>
              <div className="space-y-3">
                <Input
                  id="icon"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {previewUrl && (
                  <div className="relative w-20 h-20 border rounded-lg overflow-hidden">
                    <Image
                      src={previewUrl}
                      alt="Icon preview"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!service && errors.icon && (
                  <p className="text-sm text-red-600">{errors.icon.message}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload an icon for this service
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="min-w-[100px]"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {service ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {service ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
