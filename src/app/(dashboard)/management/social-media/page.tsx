'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, ExternalLink, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { socialMediaApi } from '@/lib/api/social-media'
import { SocialMedia, CreateSocialMediaRequest, UpdateSocialMediaRequest } from '@/types/api'
import { SocialMediaForm } from '@/components/social-media/social-media-form'

export default function SocialMediaPage() {
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingSocialMedia, setEditingSocialMedia] = useState<SocialMedia | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load social media links on component mount
  useEffect(() => {
    loadSocialMediaLinks()
  }, [])

  const loadSocialMediaLinks = async () => {
    try {
      setLoading(true)
      const response = await socialMediaApi.getAll()
      if (response.success && response.data) {
        setSocialMediaLinks(response.data)
      }
    } catch (error) {
      console.error('Failed to load social media links:', error)
      toast.error('Failed to load social media links')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: CreateSocialMediaRequest) => {
    try {
      setIsSubmitting(true)
      const response = await socialMediaApi.create(data)
      if (response.success && response.data) {
        setSocialMediaLinks(prev => [response.data!, ...prev])
        setShowForm(false)
        toast.success('Social media link created successfully')
      }
    } catch (error) {
      console.error('Failed to create social media link:', error)
      toast.error('Failed to create social media link')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (data: UpdateSocialMediaRequest) => {
    if (!editingSocialMedia) return

    try {
      setIsSubmitting(true)
      const response = await socialMediaApi.update(editingSocialMedia.id, data)
      if (response.success && response.data) {
        setSocialMediaLinks(prev => 
          prev.map(link => 
            link.id === editingSocialMedia.id ? response.data! : link
          )
        )
        setEditingSocialMedia(null)
        toast.success('Social media link updated successfully')
      }
    } catch (error) {
      console.error('Failed to update social media link:', error)
      toast.error('Failed to update social media link')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this social media link? This action cannot be undone.'
    )
    
    if (!confirmed) return

    try {
      await socialMediaApi.delete(id)
      setSocialMediaLinks(prev => prev.filter(link => link.id !== id))
      toast.success('Social media link deleted successfully')
    } catch (error) {
      console.error('Failed to delete social media link:', error)
      toast.error('Failed to delete social media link')
    }
  }

  const handleEdit = (socialMedia: SocialMedia) => {
    setEditingSocialMedia(socialMedia)
    setShowForm(false)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingSocialMedia(null)
  }

  const filteredLinks = socialMediaLinks.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.url.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold tracking-tight">Social Media Links</h1>
          <p className="text-muted-foreground">
            Manage your social media links and profiles
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="gap-1">
            <Share2 className="h-3 w-3" />
            {socialMediaLinks.length} Links
          </Badge>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search social media links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      {(showForm || editingSocialMedia) && (
        <SocialMediaForm
          socialMedia={editingSocialMedia || undefined}
          onSubmit={editingSocialMedia ? handleUpdate : handleCreate}
          onCancel={handleCancelForm}
          isLoading={isSubmitting}
        />
      )}

      {/* Social Media Links List */}
      <div className="grid gap-4">
        {filteredLinks.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {searchTerm ? 'No matching links found' : 'No social media links'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'Add your first social media link to get started'
                    }
                  </p>
                </div>
                {!searchTerm && (
                  <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add First Link
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredLinks.map((link) => (
            <Card key={link.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium">{link.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {new URL(link.url).hostname}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 break-all">
                      {link.url}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>Created: {new Date(link.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(link.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(link.url, '_blank')}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(link)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(link.id)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
