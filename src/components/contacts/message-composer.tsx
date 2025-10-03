'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { ContactReplyRequest } from '@/types/api'

const replySchema = z.object({
  message: z.string()
    .min(1, 'Reply message is required')
    .max(5000, 'Reply message must not exceed 5000 characters')
})

type ReplyFormData = z.infer<typeof replySchema>

interface MessageComposerProps {
  contactId: string
  onSubmit: (data: ContactReplyRequest) => Promise<void>
  isLoading?: boolean
}

export function MessageComposer({ onSubmit, isLoading = false }: MessageComposerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      message: ''
    }
  })

  const message = watch('message')
  const hasMessage = message && message.trim().length > 0

  const handleFormSubmit = async (data: ReplyFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit({ message: data.message })
      reset()
    } catch (error) {
      console.error('Failed to send reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-t rounded-none flex-shrink-0">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
          <div className="space-y-2">
            <Textarea
              {...register('message')}
              placeholder="Type your reply message here..."
              rows={3}
              className={errors.message ? 'border-red-500' : ''}
              disabled={isSubmitting || isLoading}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Maximum 5000 characters</span>
              <span>{message?.length || 0}/5000</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!hasMessage || isSubmitting || isLoading}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
