'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
  Menu
} from 'lucide-react'
import { NAVIGATION_CONFIG } from '@/lib/constants'

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
}

interface SidebarProps {
  className?: string
  isMobile?: boolean
  onClose?: () => void
}

export function Sidebar({ className, isMobile = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(['main'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const renderNavItem = (item: any) => {
    const Icon = iconMap[item.icon as keyof typeof iconMap]
    const isActive = pathname === item.href

    return (
      <Link key={item.href} href={item.href} onClick={isMobile ? onClose : undefined}>
        <Button
          variant={isActive ? "default" : "ghost"}
          className={cn(
            "w-full justify-start text-sm font-medium transition-all duration-200 hover:bg-accent",
            isActive && "bg-primary text-primary-foreground shadow-sm"
          )}
        >
          <Icon className="mr-2 h-4 w-4" />
          {item.name}
        </Button>
      </Link>
    )
  }

  const renderSection = (sectionKey: string, section: any) => {
    const isExpanded = expandedSections.includes(sectionKey)
    const hasSubItems = Array.isArray(section)

    return (
      <div key={sectionKey} className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {sectionKey === 'main' ? 'MAIN' : 
             sectionKey === 'inventory' ? 'INVENTORY MANAGEMENT' :
             sectionKey === 'marketing' ? 'MARKETING' : sectionKey}
          </h3>
          {hasSubItems && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection(sectionKey)}
              className="h-6 w-6 p-0 transition-all duration-200 hover:bg-accent"
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
            "space-y-1 ml-2 transition-all duration-300 overflow-hidden",
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
    <div className={cn("flex h-full w-64 flex-col border-r bg-background", className)}>
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center transition-all duration-200 hover:bg-primary/90">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Admin Portal</h1>
            <p className="text-xs text-muted-foreground">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-6">
          {Object.entries(NAVIGATION_CONFIG).map(([key, section]) => 
            renderSection(key, section)
          )}
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 transition-all duration-200 hover:ring-2 hover:ring-primary/20">
            <AvatarImage src="/avatars/admin.jpg" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 transition-all duration-200 hover:bg-accent">
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
          {sidebarContent}
        </SheetContent>
      </Sheet>
    )
  }

  return sidebarContent
}
