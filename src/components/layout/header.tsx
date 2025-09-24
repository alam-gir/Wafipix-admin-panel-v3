'use client'

import { ArrowLeft, Bell, ShoppingCart, User, Settings, LogOut, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from './sidebar'
import { useAuth } from '@/lib/auth/context'

interface HeaderProps {
  title?: string
  showBackButton?: boolean
  onBackClick?: () => void
}

export function Header({ title, showBackButton = false, onBackClick }: HeaderProps) {
  const { logout, user } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  const handleProfileClick = () => {
    router.push('/profile')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Sidebar isMobile />
        </div>
        
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackClick}
            className="h-8 w-8 p-0 transition-all duration-200 hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        {title && (
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Purchase Button - Hidden on mobile */}
        <Button className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200">
          <ShoppingCart className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline">Purchase</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0 transition-all duration-200 hover:bg-accent">
          <Bell className="h-4 w-4" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full transition-all duration-200 hover:bg-accent">
              <Avatar className="h-8 w-8 transition-all duration-200 hover:ring-2 hover:ring-primary/20">
                <AvatarImage src="/avatars/admin.jpg" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'JD'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user ? `${user.firstName} ${user.lastName}` : 'John Doe'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="transition-colors duration-200 cursor-pointer"
              onClick={handleProfileClick}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="transition-colors duration-200">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 transition-colors duration-200"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
