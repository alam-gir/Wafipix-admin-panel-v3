'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { FileResponse } from '@/types/api'

interface GalleryItemProps {
  item: {
    id: string
    file: FileResponse
  }
  onRemove: (itemId: string) => void
  isSubmitting?: boolean
}

export function GalleryItem({ item, onRemove, isSubmitting = false }: GalleryItemProps) {
  const isVideo = item.file.mimeType?.startsWith('video/')

  return (
    <div className="relative group flex-1 min-w-0">
      <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
        {isVideo ? (
          <video
            src={item.file.publicUrl}
            className="w-full h-auto object-cover"
            controls
          />
        ) : (
          <img
            src={item.file.publicUrl}
            alt={item.file.fileName}
            className="w-full h-auto object-cover"
          />
        )}
      </div>
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="destructive"
          className="h-5 w-5 p-0"
          onClick={() => onRemove(item.id)}
          disabled={isSubmitting}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
