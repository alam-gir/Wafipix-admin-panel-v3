import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { UserDataLoader } from '@/components/auth/user-data-loader'
import { handleServerAuthRedirect } from '@/lib/server-auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side authentication check (currently disabled)
  await handleServerAuthRedirect('/dashboard')

  return (
    <div className="flex h-screen bg-background">
      {/* Load user data on client side */}
      <UserDataLoader />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title="Dashboard Overview" />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
