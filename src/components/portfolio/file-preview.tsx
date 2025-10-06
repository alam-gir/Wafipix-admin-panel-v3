'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Image from 'next/image'
import { FileObject } from '@/types/api'

interface FilePreviewProps {
  file: FileObject
  index: number
  onRemove: (index: number) => void
}

export function FilePreview({ file, index, onRemove }: FilePreviewProps) {
  const isVideo = file.type.startsWith('video/')
  // Type assertion for browser APIs - safe because this component only runs in browser
  const browserFile = file as File

  return (
    <div className="relative group flex-1 min-w-0 border-2 border-dashed border-blue-300">
      <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
        {isVideo ? (
          <video
            src={URL.createObjectURL(browserFile)}
            className="w-full h-auto object-cover"
            controls
          />
        ) : (
          <Image
            src={URL.createObjectURL(browserFile)}
            alt={file.name}
            width={200}
            height={200}
            className="w-full h-auto object-cover"
          />
        )}
      </div>
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="destructive"
          className="h-5 w-5 p-0"
          onClick={() => onRemove(index)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
        New
      </div>
    </div>
  )
}
