'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { clientsApi } from '@/lib/api/clients'
import { Client, CreateClientRequest, UpdateClientRequest } from '@/types/api'
import { validateFile, formatFileSize, createProgressHandler, UploadProgress } from '@/lib/utils/file-upload'

const clientSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters'),
  description: z.string().max(5000, 'Description must not exceed 5000 characters').optional(),
  companyUrl: z.string().max(500, 'Company URL must not exceed 500 characters').optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  client?: Client | null
  isEditMode?: boolean
}

export function ClientForm({ isOpen, onClose, onSuccess, client, isEditMode = false }: ClientFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      title: '',
      description: '',
      companyUrl: '',
    }
  })

  // Reset form when client changes
  useEffect(() => {
    if (client && isEditMode) {
      setValue('title', client.title)
      setValue('description', client.description || '')
      setValue('companyUrl', client.companyUrl || '')
      setLogoPreview(client.logo || '')
    } else {
      reset()
      setLogoFile(null)
      setLogoPreview('')
    }
  }, [client, isEditMode, setValue, reset])

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Enhanced file validation
      const validation = validateFile(file, {
        maxSize: 5 * 1024 * 1024, // 5MB limit for client logos
        allowedTypes: ['image/'],
        allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
      })
      
      if (!validation.isValid) {
        toast.error(validation.error || 'Invalid file')
        return
      }

      setLogoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      toast.success(`Logo selected: ${formatFileSize(file.size)}`)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview('')
  }

  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsSubmitting(true)
      setIsUploading(true)
      setUploadProgress(0)

      // Create enhanced progress handler
      const progressHandler = createProgressHandler((progress: UploadProgress) => {
        setUploadProgress(progress.percentage)
      })

      const requestData: CreateClientRequest | UpdateClientRequest = {
        title: data.title,
        description: data.description || undefined,
        companyUrl: data.companyUrl || undefined,
        logo: logoFile || undefined,
      }

      if (isEditMode && client) {
        await clientsApi.updateClient(client.id, requestData as UpdateClientRequest, {
          onUploadProgress: progressHandler
        })
        toast.success('Client updated successfully')
      } else {
        await clientsApi.createClient(requestData as CreateClientRequest, {
          onUploadProgress: progressHandler
        })
        toast.success('Client created successfully')
      }

      onSuccess()
    } catch (error) {
      console.error('Failed to save client:', error)
      toast.error('Failed to save client')
    } finally {
      setIsSubmitting(false)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleClose = () => {
    reset()
    setLogoFile(null)
    setLogoPreview('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Client' : 'Add New Client'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update the client information below.' 
              : 'Add a new trusted client company to your portfolio.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={logoPreview} alt="Logo preview" />
                  <AvatarFallback>
                    <Building2 className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                {logoPreview && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <Label
                  htmlFor="logo-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  {logoFile ? 'Change Logo' : 'Upload Logo'}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Company Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Company Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter company name"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter company description"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {watch('description')?.length || 0}/5000 characters
            </p>
          </div>

          {/* Company URL */}
          <div className="space-y-2">
            <Label htmlFor="companyUrl">Company Website</Label>
            <Input
              id="companyUrl"
              {...register('companyUrl')}
              placeholder="https://example.com"
              type="url"
              className={errors.companyUrl ? 'border-red-500' : ''}
            />
            {errors.companyUrl && (
              <p className="text-sm text-red-500">{errors.companyUrl.message}</p>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading logo...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Client' : 'Create Client')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
