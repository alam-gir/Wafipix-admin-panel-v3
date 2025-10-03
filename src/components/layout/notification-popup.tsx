'use client'

import { useState } from 'react'
import { Bell, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'info' | 'error'
  time: string
  isRead: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Order Received',
    message: 'You have received a new order from John Doe for $299.99',
    type: 'success',
    time: '2 minutes ago',
    isRead: false
  },
  {
    id: '2',
    title: 'Payment Failed',
    message: 'Payment for order #12345 failed. Please contact customer.',
    type: 'error',
    time: '15 minutes ago',
    isRead: false
  },
  {
    id: '3',
    title: 'System Update',
    message: 'System will be updated tonight at 2:00 AM. Expected downtime: 30 minutes.',
    type: 'info',
    time: '1 hour ago',
    isRead: true
  },
  {
    id: '4',
    title: 'Low Stock Alert',
    message: 'Product "Premium Camera" is running low on stock (5 items left)',
    type: 'warning',
    time: '2 hours ago',
    isRead: true
  },
  {
    id: '5',
    title: 'New Employee Added',
    message: 'Sarah Johnson has been added to the team as Marketing Manager',
    type: 'success',
    time: '3 hours ago',
    isRead: true
  }
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-600" />
    case 'info':
      return <Info className="h-4 w-4 text-blue-600" />
    default:
      return <Info className="h-4 w-4 text-gray-600" />
  }
}

const getNotificationBgColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200'
    case 'error':
      return 'bg-red-50 border-red-200'
    case 'info':
      return 'bg-blue-50 border-blue-200'
    default:
      return 'bg-gray-50 border-gray-200'
  }
}

export function NotificationPopup() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0 transition-all duration-200 hover:bg-accent">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[420px] p-0 shadow-xl border max-h-[600px] flex flex-col" 
          align="end" 
          sideOffset={5}
          style={{ zIndex: 9999 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <Bell className="h-5 w-5 flex-shrink-0" />
              <h3 className="font-semibold text-base flex-shrink-0">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-sm px-2 py-1 flex-shrink-0">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-7 px-2 whitespace-nowrap"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs h-7 px-2 text-red-600 hover:text-red-700 whitespace-nowrap"
              >
                Clear all
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-base">No notifications</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="p-3 space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id}>
                      <div
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                          !notification.isRead ? 'bg-white shadow-sm' : 'bg-gray-50'
                        } ${getNotificationBgColor(notification.type)}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">{notification.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-sm h-10"
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
