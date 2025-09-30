'use client'

import { Mail, Phone, Calendar, User, MessageSquare, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ContactResponse } from '@/types/api'
import { ContactReply } from './contact-reply'

interface ContactDetailProps {
  contact: ContactResponse
  onBack: () => void
  onReply: (data: { message: string }) => Promise<void>
  onDelete: (id: string) => void
  isSubmitting?: boolean
}

export function ContactDetail({
  contact,
  onBack,
  onReply,
  onDelete,
  isSubmitting = false
}: ContactDetailProps) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="gap-2"
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Contacts
        </Button>
        <div className="flex items-center space-x-2">
          <Badge 
            variant="outline" 
            className={`${getStatusColor(contact.status)} text-white border-0`}
          >
            {getStatusText(contact.status)}
          </Badge>
          {(contact.replies || []).length > 0 && (
            <Badge variant="secondary">
              {(contact.replies || []).length} repl{(contact.replies || []).length !== 1 ? 'ies' : 'y'}
            </Badge>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm text-muted-foreground">{contact.fullName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{contact.email}</p>
              </div>
            </div>
            {contact.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Contact Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(contact.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Original Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Original Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{contact.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      {(contact.replies || []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Replies ({(contact.replies || []).length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(contact.replies || []).map((reply, index) => (
              <div key={reply.id}>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{reply.message}</p>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p>Replied by {reply.createdBy}</p>
                    <p>{new Date(reply.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
                {index < (contact.replies || []).length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Reply Form */}
      <ContactReply
        contactId={contact.id}
        onSubmit={onReply}
        isLoading={isSubmitting}
      />

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end">
            <Button
              onClick={() => onDelete(contact.id)}
              variant="destructive"
              disabled={isSubmitting}
            >
              Delete Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
