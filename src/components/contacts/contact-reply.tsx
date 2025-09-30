'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactReplyRequest } from '@/types/api'

const replySchema = z.object({
  message: z.string()
    .min(1, 'Reply message is required')
    .max(5000, 'Reply message must not exceed 5000 characters')
})

type ReplyFormData = z.infer<typeof replySchema>

interface ContactReplyProps {
  contactId: string
  onSubmit: (data: ContactReplyRequest) => Promise<void>
  isLoading?: boolean
}

export function ContactReply({ contactId, onSubmit, isLoading = false }: ContactReplyProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      message: ''
    }
  })

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Reply
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Reply Message *</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Type your reply message here..."
              rows={6}
              className={errors.message ? 'border-red-500' : ''}
              disabled={isSubmitting || isLoading}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Maximum 5000 characters
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
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
