import { handleServerAuthRedirect } from '@/lib/server-auth'
import LoginForm from '@/components/auth/login-form'

export default async function LoginPage() {
  // Server-side authentication check - redirect to dashboard if already logged in
  await handleServerAuthRedirect('/login')

  return <LoginForm />
}

