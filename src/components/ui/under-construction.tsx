'use client'

import { Construction, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

interface UnderConstructionProps {
  title?: string
  message?: string
  showBackButton?: boolean
}

export function UnderConstruction({ 
  title = "Under Construction", 
  message = "This page is currently being developed. Please check back later!",
  showBackButton = true 
}: UnderConstructionProps) {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
            <Construction className="h-10 w-10 text-orange-600" />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 leading-relaxed">{message}</p>
          </div>

          {/* Back Button */}
          {showBackButton && (
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
