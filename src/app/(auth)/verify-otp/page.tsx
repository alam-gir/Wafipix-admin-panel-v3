import { Suspense } from 'react'
import { handleServerAuthRedirect } from '@/lib/server-auth'
import OtpForm from '@/components/auth/otp-form'

export default async function VerifyOtpPage() {
  // Server-side authentication check - redirect to dashboard if already logged in
  await handleServerAuthRedirect('/verify-otp')

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <OtpForm />
    </Suspense>
  )
}

