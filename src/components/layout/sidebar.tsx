'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Settings, 
  Package, 
  Tags, 
  Layers, 
  Type, 
  Award, 
  Truck, 
  ShoppingCart, 
  Image,
  ChevronRight,
  LogOut,
  User,
  Menu,
  Briefcase,
  FolderOpen,
  Star,
  Video,
  Monitor,
  UserCheck,
  Share2,
  ShoppingBag,
  PlusCircle,
  UserPlus,
  UserCog,
  CreditCard,
  Phone,
  Megaphone,
  Mail
} from 'lucide-react'
import { NAVIGATION_CONFIG } from '@/lib/constants'
import { useAuth } from '@/hooks/use-auth'

const iconMap = {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  Package,
  Tags,
  Layers,
  Type,
  Award,
  Truck,
  ShoppingCart,
  Image,
  User,
  Briefcase,
  FolderOpen,
  Star,
  Video,
  Monitor,
  UserCheck,
  Share2,
  ShoppingBag,
  PlusCircle,
  UserPlus,
  UserCog,
  CreditCard,
  Phone,
  Megaphone,
  Mail,
}

interface SidebarProps {
  className?: string
  isMobile?: boolean
  onClose?: () => void
}

export function Sidebar({ className, isMobile = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(['main', 'management', 'orders', 'employees', 'payments', 'contacts', 'marketing'])
  const { logout, user } = useAuth()

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const renderNavItem = (item: { href: string; icon: string; name: string }) => {
    const Icon = iconMap[item.icon as keyof typeof iconMap]
    const isActive = pathname === item.href

    return (
      <Link key={item.href} href={item.href} onClick={isMobile ? onClose : undefined}>
        <Button
          variant={isActive ? "default" : "ghost"}
          size="sm"
          className={cn(
            "w-full justify-start text-xs font-medium transition-all duration-200 hover:bg-accent h-8",
            isActive && "bg-primary text-primary-foreground shadow-sm"
          )}
        >
          <Icon className="mr-2 h-3 w-3" />
          {item.name}
        </Button>
      </Link>
    )
  }

  const renderSection = (sectionKey: string, section: { href: string; icon: string; name: string } | { href: string; icon: string; name: string }[]) => {
    const isExpanded = expandedSections.includes(sectionKey)
    const hasSubItems = Array.isArray(section)

    return (
      <div key={sectionKey} className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {sectionKey === 'main' ? 'MAIN' : 
             sectionKey === 'management' ? 'MANAGEMENT' :
             sectionKey === 'orders' ? 'ORDERS' :
             sectionKey === 'employees' ? 'EMPLOYEES' :
             sectionKey === 'payments' ? 'PAYMENTS' :
             sectionKey === 'contacts' ? 'CONTACTS' :
             sectionKey === 'marketing' ? 'MARKETING' : sectionKey}
          </h3>
          {hasSubItems && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection(sectionKey)}
              className="h-5 w-5 p-0 transition-all duration-200 hover:bg-accent"
            >
              <ChevronRight 
                className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  isExpanded && "rotate-90"
                )} 
              />
            </Button>
          )}
        </div>
        
        {hasSubItems && (
          <div className={cn(
            "space-y-0.5 ml-1 transition-all duration-300 overflow-hidden",
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}>
            {section.map(renderNavItem)}
          </div>
        )}
        
        {!hasSubItems && renderNavItem(section)}
      </div>
    )
  }

  const sidebarContent = (
    <div className={cn("flex h-screen w-64 flex-col border-r bg-background", className)}>
      {/* Header Section - Fixed at top */}
      <div className="flex h-16 items-center border-b px-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center transition-all duration-200 hover:bg-primary/90">
            <span className="text-primary-foreground font-bold text-sm">W</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Wafipix</h1>
            <p className="text-xs text-muted-foreground">v3.0.0</p>
          </div>
        </div>
      </div>

      {/* Navigation Section - Scrollable center */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-4">
          {Object.entries(NAVIGATION_CONFIG).map(([key, section]) => 
            renderSection(key, section)
          )}
        </div>
      </div>

      {/* Profile Section - Fixed at bottom */}
      <div className="border-t p-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 transition-all duration-200 hover:ring-2 hover:ring-primary/20">
            <AvatarImage src="/avatars/admin.jpg" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'JD'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user ? `${user.firstName} ${user.lastName}` : 'John Doe'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@example.com'}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 transition-all duration-200 hover:bg-accent"
            onClick={logout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-screen w-64 flex-col border-r bg-background">
            {/* Header Section - Fixed at top */}
            <div className="flex h-16 items-center border-b px-4 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center transition-all duration-200 hover:bg-primary/90">
                  <span className="text-primary-foreground font-bold text-sm">W</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Wafipix</h1>
                  <p className="text-xs text-muted-foreground">v3.0.0</p>
                </div>
              </div>
            </div>

            {/* Navigation Section - Scrollable center */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <div className="space-y-4">
                {Object.entries(NAVIGATION_CONFIG).map(([key, section]) => 
                  renderSection(key, section)
                )}
              </div>
            </div>

            {/* Profile Section - Fixed at bottom */}
            <div className="border-t p-4 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 transition-all duration-200 hover:ring-2 hover:ring-primary/20">
                  <AvatarImage src="/avatars/admin.jpg" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'JD'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user ? `${user.firstName} ${user.lastName}` : 'John Doe'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@example.com'}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 transition-all duration-200 hover:bg-accent"
                  onClick={logout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return sidebarContent
}
