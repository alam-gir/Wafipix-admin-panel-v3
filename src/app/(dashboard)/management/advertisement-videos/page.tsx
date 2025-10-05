'use client'

import { useState, useEffect } from 'react'
import { Upload, Play, Trash2, RefreshCw, Monitor, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { AxiosProgressEvent } from 'axios'
import { advertisementVideosApi } from '@/lib/api/advertisement-videos'
import { AdvertisementVideo } from '@/types/api'
import { createProgressHandler, formatFileSize, validateFile, getRetryConfig, UploadProgress } from '@/lib/utils/file-upload'

export default function HeroVideoPage() {
  const [heroVideo, setHeroVideo] = useState<AdvertisementVideo | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSpeed, setUploadSpeed] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  // Load hero video on component mount
  useEffect(() => {
    loadHeroVideo()
  }, [])

  const loadHeroVideo = async () => {
    try {
      setLoading(true)
      const response = await advertisementVideosApi.getAdvertisementVideo()
      if (response.success && response.data) {
        setHeroVideo(response.data)
      }
    } catch (error) {
      console.error('Failed to load hero video:', error)
      // Don't show error toast if no video exists (404)
      if (error instanceof Error && !error.message.includes('404')) {
        toast.error('Failed to load hero video')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file using enhanced validation
      const validation = validateFile(file, {
        maxSize: 500 * 1024 * 1024, // 500MB limit for videos
        allowedTypes: ['video/'],
        allowedExtensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm']
      })
      
      if (!validation.isValid) {
        toast.error(validation.error || 'Invalid file')
        return
      }

      setSelectedFile(file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      toast.success(`File selected: ${formatFileSize(file.size)}`)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a video file')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)
      setUploadSpeed('')
      setEstimatedTime('')

      // Create enhanced progress handler
      const progressHandler = createProgressHandler((progress: UploadProgress) => {
        setUploadProgress(progress.percentage)
        setUploadSpeed(progress.speed)
        setEstimatedTime(progress.estimatedTime)
      })

      const response = await advertisementVideosApi.createOrUpdateAdvertisementVideo(selectedFile, {
        onUploadProgress: progressHandler
      })

      if (response.success && response.data) {
        setHeroVideo(response.data)
        setSelectedFile(null)
        setPreviewUrl('')
        setUploadProgress(0)
        setUploadSpeed('')
        setEstimatedTime('')
        toast.success('Hero video uploaded successfully')
      }
    } catch (error) {
      console.error('Failed to upload video:', error)
      toast.error('Failed to upload video')
      setUploadProgress(0)
      setUploadSpeed('')
      setEstimatedTime('')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete the hero video? This action cannot be undone.'
    )
    
    if (!confirmed) return

    try {
      setDeleting(true)
      await advertisementVideosApi.deleteAdvertisementVideo()
      setHeroVideo(null)
      toast.success('Hero video deleted successfully')
    } catch (error) {
      console.error('Failed to delete video:', error)
      toast.error('Failed to delete video')
    } finally {
      setDeleting(false)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl('')
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Homepage Hero Video</h1>
          <p className="text-muted-foreground">
            Manage your homepage hero video that visitors see first
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="gap-1">
            <Monitor className="h-3 w-3" />
            {heroVideo ? 'Hero Video Set' : 'No Hero Video'}
          </Badge>
        </div>
      </div>

      {/* Single Hero Video Management Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Hero Video Management
          </CardTitle>
          <CardDescription>
            Upload, preview, and manage your homepage hero video
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Current Video Display */}
          {heroVideo && !selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Current Hero Video</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(heroVideo.url, '_blank')}
                    className="gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Open in New Tab
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="gap-2"
                  >
                    {deleting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <video
                src={heroVideo.url}
                controls
                className="w-full max-w-3xl rounded-lg border"
              >
                Your browser does not support the video tag.
              </video>
              
              <div className="text-sm text-muted-foreground">
                <p>Created: {new Date(heroVideo.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(heroVideo.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {/* Preview Video Display */}
          {previewUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Preview</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
              
              <video
                src={previewUrl}
                controls
                className="w-full max-w-3xl rounded-lg border"
              >
                Your browser does not support the video tag.
              </video>
              
              {selectedFile && (
                <div className="p-3 bg-muted rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {selectedFile.type}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {heroVideo ? 'Replace Hero Video' : 'Upload Hero Video'}
              </h3>
              {selectedFile && !uploading && (
                <Button
                  onClick={handleUpload}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {heroVideo ? 'Replace Video' : 'Upload Video'}
                </Button>
              )}
            </div>
            
            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Uploading video...</span>
                  <span className="text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{uploadSpeed}</span>
                  <span>{estimatedTime} remaining</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="video-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="video-upload"
                  className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50 ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  {selectedFile ? 'Change Video' : 'Select Hero Video'}
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  MP4, MOV, AVI up to 100MB
                </p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {!heroVideo && !selectedFile && (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Monitor className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Hero Video</h3>
              <p className="text-muted-foreground">
                Upload your homepage hero video to create an engaging first impression for visitors.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}