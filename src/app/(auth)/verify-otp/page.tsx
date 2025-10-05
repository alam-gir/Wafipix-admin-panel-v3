import { handleServerAuthRedirect } from '@/lib/server-auth'
import OtpForm from '@/components/auth/otp-form'

export default async function VerifyOtpPage() {
  // Server-side authentication check - redirect to dashboard if already logged in
  await handleServerAuthRedirect('/verify-otp')

  return <OtpForm />
}

