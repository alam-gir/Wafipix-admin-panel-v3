'use client'

import { useEffect, useRef } from 'react'
import { Trash2, Mail, User, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ContactResponse } from '@/types/api'

interface ContactListProps {
  contacts: ContactResponse[]
  selectedContactId?: string
  loading: boolean
  hasMore: boolean
  isLoadingMore: boolean
  onSelectContact: (contact: ContactResponse) => void
  onDelete: (id: string) => void
  onLoadMore: () => void
  isSubmitting?: boolean
}

export function ContactList({
  contacts,
  selectedContactId,
  loading,
  hasMore,
  isLoadingMore,
  onSelectContact,
  onDelete,
  onLoadMore,
  isSubmitting = false
}: ContactListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Infinite scroll handler
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100 // 100px threshold

      if (isNearBottom && hasMore && !isLoadingMore && !loading) {
        onLoadMore()
      }
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [hasMore, isLoadingMore, loading, onLoadMore])
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      case 'read':
        return <CheckCircle className="w-3 h-3 text-green-500" />
      case 'replied':
        return <CheckCircle className="w-3 h-3 text-purple-500" />
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  const filteredContacts = contacts || []

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-3 p-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-2 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredContacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No contacts yet</h3>
        <p className="text-sm text-muted-foreground">
          Client messages will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Conversation List */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => {
          const isSelected = selectedContactId === contact.id
          const hasReplies = (contact.replies || []).length > 0
          
          return (
            <div
              key={contact.id}
              className={cn(
                "flex items-center space-x-3 p-3 cursor-pointer border-b hover:bg-muted/50 transition-colors",
                isSelected && "bg-muted border-r-2 border-r-primary"
              )}
              onClick={() => onSelectContact(contact)}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                {/* Status indicator */}
                <div className="absolute -bottom-1 -right-1">
                  {getStatusIcon(contact.status)}
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-sm truncate">{contact.fullName}</h3>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatTime(contact.createdAt)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate">
                    {contact.message.length > 50 
                      ? `${contact.message.substring(0, 50)}...` 
                      : contact.message
                    }
                  </p>
                  {hasReplies && (
                    <Badge variant="secondary" className="text-xs h-5 px-1">
                      {(contact.replies || []).length}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(contact.id)
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )
        })}

        {/* Loading indicators */}
        {isLoadingMore && (
          <div className="flex items-center justify-center p-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading more contacts...</span>
            </div>
          </div>
        )}

        {!hasMore && filteredContacts.length > 0 && (
          <div className="flex items-center justify-center p-4">
            <div className="text-sm text-muted-foreground">
              No more contacts to load
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


