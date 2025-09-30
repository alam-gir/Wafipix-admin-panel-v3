'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { Mail, Users, MessageSquare } from 'lucide-react'
import { ContactResponse, ContactReplyRequest, Page } from '@/types/api'
import { contactsApi } from '@/lib/api/contacts'
import { ContactList } from '@/components/contacts/contact-list'
import { MessageThread } from '@/components/contacts/message-thread'
import { MessageComposer } from '@/components/contacts/message-composer'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactResponse[]>([])
  const [selectedContact, setSelectedContact] = useState<ContactResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  })

  const loadContacts = useCallback(async (page: number = 0, append: boolean = false) => {
    try {
      if (append) {
        setIsLoadingMore(true)
      } else {
        setLoading(true)
      }
      
      const response = await contactsApi.getAll(page, pagination.size)
      if (response.success && response.data) {
        if (append) {
          // Append new contacts to existing list
          setContacts(prevContacts => [...prevContacts, ...response.data!.content])
        } else {
          // Replace contacts list
          setContacts(response.data.content)
        }
        
        setPagination({
          page: response.data.pageable.pageNumber,
          size: response.data.pageable.pageSize,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages
        })
      }
    } catch (error) {
      console.error('Failed to load contacts:', error)
      toast.error('Failed to load contacts')
    } finally {
      if (append) {
        setIsLoadingMore(false)
      } else {
        setLoading(false)
      }
    }
  }, [pagination.size])

  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await contactsApi.getUnreadCount()
      if (response.success && response.data !== undefined) {
        setUnreadCount(response.data)
      }
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }, [])

  useEffect(() => {
    loadContacts()
    loadUnreadCount()
  }, [loadContacts, loadUnreadCount])

  const handleSelectContact = async (contact: ContactResponse) => {
    try {
      setLoading(true)
      const response = await contactsApi.getById(contact.id)
      if (response.success && response.data) {
        setSelectedContact(response.data)
        // Refresh the list to update status
        loadContacts(pagination.page)
        loadUnreadCount()
      }
    } catch (error) {
      console.error('Failed to load contact details:', error)
      toast.error('Failed to load contact details')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (data: ContactReplyRequest) => {
    if (!selectedContact) return

    // Create optimistic reply object
    const optimisticReply = {
      id: `temp-${Date.now()}`, // Temporary ID
      message: data.message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'You', // Will be updated from API response
      updatedBy: 'You'
    }

    // Immediately update UI with optimistic reply
    const updatedContact = {
      ...selectedContact,
      replies: [...(selectedContact.replies || []), optimisticReply],
      status: 'replied'
    }
    
    setSelectedContact(updatedContact)
    
    // Update the contact in the list immediately
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === selectedContact.id 
          ? { ...contact, replies: updatedContact.replies, status: updatedContact.status }
          : contact
      )
    )

    try {
      setIsSubmitting(true)
      const response = await contactsApi.replyToContact(selectedContact.id, data)
      if (response.success && response.data) {
        // Update with real data from API
        setSelectedContact(response.data)
        
        // Update the contact in the list with real data
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.id === selectedContact.id 
              ? { ...contact, replies: response.data!.replies, status: response.data!.status }
              : contact
          )
        )
        
        toast.success('Reply sent successfully')
        loadUnreadCount()
      }
    } catch (error) {
      console.error('Failed to send reply:', error)
      toast.error('Failed to send reply')
      
      // Revert optimistic update on error
      setSelectedContact(selectedContact)
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === selectedContact.id 
            ? { ...contact, replies: selectedContact.replies, status: selectedContact.status }
            : contact
        )
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this contact? This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      setIsSubmitting(true)
      await contactsApi.delete(id)
      toast.success('Contact deleted successfully')
      
      // If we're viewing the deleted contact, go back to list
      if (selectedContact?.id === id) {
        setSelectedContact(null)
      }
      
      // Remove from contacts list immediately
      setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id))
      loadUnreadCount()
    } catch (error) {
      console.error('Failed to delete contact:', error)
      toast.error('Failed to delete contact')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLoadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages - 1) {
      loadContacts(pagination.page + 1, true)
    }
  }, [pagination.page, pagination.totalPages, loadContacts])

  const hasMore = pagination.page < pagination.totalPages - 1

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Contact List Sidebar */}
        <div className="w-80 border-r bg-background flex flex-col">
          <ContactList
            contacts={contacts}
            selectedContactId={selectedContact?.id}
            loading={loading}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onSelectContact={handleSelectContact}
            onDelete={handleDelete}
            onLoadMore={handleLoadMore}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Message Thread */}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedContact ? (
            <>
              <MessageThread
                contact={selectedContact}
                onDelete={handleDelete}
                isSubmitting={isSubmitting}
              />
              <MessageComposer
                contactId={selectedContact.id}
                onSubmit={handleReply}
                isLoading={isSubmitting}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Select a conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a contact from the sidebar to view messages and send replies
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
