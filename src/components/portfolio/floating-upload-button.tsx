'use client'

import { Button } from '@/components/ui/button'
import { Plus, Upload } from 'lucide-react'

interface FloatingUploadButtonProps {
  fileCount: number
  onUpload: () => void
  onCancel: () => void
  isUploading: boolean
  uploadProgress: number
}

export function FloatingUploadButton({ 
  fileCount, 
  onUpload, 
  onCancel, 
  isUploading, 
  uploadProgress 
}: FloatingUploadButtonProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="w-full bg-green-50 border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center p-4">
        {isUploading ? (
          <div className="space-y-2 text-center">
            <div className="text-xs font-medium">Uploading...</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-600 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600">{uploadProgress}%</div>
          </div>
        ) : (
          <div className="space-y-1 text-center">
            <Button
              onClick={onUpload}
              className="gap-1 bg-green-600 hover:bg-green-700 text-xs"
              size="sm"
            >
              <Upload className="h-3 w-3" />
              Upload {fileCount}
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
