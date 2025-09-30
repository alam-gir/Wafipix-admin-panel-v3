'use client'

import { Mail, Phone, Calendar, User, MessageSquare, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ContactResponse } from '@/types/api'

interface MessageThreadProps {
  contact: ContactResponse
  onDelete: (id: string) => void
  isSubmitting?: boolean
}

export function MessageThread({ contact, onDelete, isSubmitting = false }: MessageThreadProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-500'
      case 'read':
        return 'bg-green-500'
      case 'replied':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'New'
      case 'read':
        return 'Read'
      case 'replied':
        return 'Replied'
      default:
        return status
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">{contact.fullName}</h2>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>{contact.email}</span>
                </div>
                {contact.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{contact.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={`${getStatusColor(contact.status)} text-white border-0`}
            >
              {getStatusText(contact.status)}
            </Badge>
            <Button
              onClick={() => onDelete(contact.id)}
              variant="destructive"
              size="sm"
              className="gap-2"
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {/* Original Message */}
        <div className="flex justify-start">
          <div className="max-w-[80%]">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium">{contact.fullName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(contact.createdAt)}
                </span>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-sm">{contact.message}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Replies */}
        {(contact.replies || []).map((reply, index) => (
          <div key={reply.id} className="flex justify-end">
            <div className="max-w-[80%]">
              <div className="bg-primary text-primary-foreground rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium">You</span>
                  <span className="text-xs opacity-80">
                    {formatTime(reply.createdAt)}
                  </span>
                </div>
                <div className="prose max-w-none prose-invert">
                  <p className="whitespace-pre-wrap text-sm">{reply.message}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {(contact.replies || []).length === 0 && (
          <div className="flex items-center justify-center h-32">
            <div className="text-center space-y-2">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">No replies yet</p>
              <p className="text-xs text-muted-foreground">Send a reply to start the conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
