'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, RefreshCw, Shield, Clock } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/hooks/use-auth'

export default function OtpForm() {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(60)
  const [resendAttempts, setResendAttempts] = useState(0)
  const [maxResendAttempts] = useState(4)
  const [isVerifying, setIsVerifying] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyOtp, login } = useAuth()
  
  const email = searchParams.get('email')

  // Resend timer effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleVerifyOtp = useCallback(async () => {
    if (!email || otp.length !== 6) return

    try {
      setError(null)
      setIsVerifying(true)
      
      await verifyOtp(email, otp)
      
      // Redirect to dashboard on success
      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Invalid OTP. Please try again.')
      setOtp('') // Clear OTP on error
    } finally {
      setIsVerifying(false)
    }
  }, [email, otp, verifyOtp, router])

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOtp()
    }
  }, [otp, handleVerifyOtp])

  const handleResendOtp = async () => {
    if (!email || resendTimer > 0 || resendAttempts >= maxResendAttempts) return

    try {
      setError(null)
      
      await login(email)
      
      // Reset timer and increment attempts
      setResendTimer(60)
      setResendAttempts(prev => prev + 1)
      setOtp('') // Clear current OTP
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to resend OTP. Please try again.')
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleBackToLogin = () => {
    router.push('/login')
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                Email not found. Please start the login process again.
              </AlertDescription>
            </Alert>
            <Button onClick={handleBackToLogin} className="w-full mt-4">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-sm">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold">Verify Your Email</CardTitle>
            <CardDescription className="text-sm">
              Enter the 6-digit code sent to <span className="font-medium text-slate-800">{email}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
                disabled={isVerifying}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="text-sm">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isVerifying && (
              <div className="text-center py-2">
                <div className="inline-flex items-center space-x-2 text-sm text-slate-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  <span>Verifying...</span>
                </div>
              </div>
            )}

            {/* Resend Section */}
            <div className="text-center space-y-3">
              {/* Timer */}
              {resendTimer > 0 && (
                <div className="text-sm text-slate-600">
                  <div className="flex items-center justify-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Resend in {formatTime(resendTimer)}</span>
                  </div>
                </div>
              )}

              {/* Resend Button */}
              {resendTimer === 0 && resendAttempts < maxResendAttempts && (
                <>
                  <div className="text-sm text-slate-600 mb-2">
                    Didn&apos;t receive the code?
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResendOtp}
                    disabled={isVerifying}
                    className="w-full"
                  >
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4" />
                      <span>Resend Code</span>
                    </div>
                  </Button>
                </>
              )}

              {/* Maximum attempts reached */}
              {resendAttempts >= maxResendAttempts && (
                <div className="text-sm text-red-600">
                  Maximum resend attempts reached
                </div>
              )}

              {/* Resend Attempts Counter */}
              {resendAttempts > 0 && resendAttempts < maxResendAttempts && (
                <p className="text-xs text-slate-500">
                  {resendAttempts}/{maxResendAttempts} attempts used
                </p>
              )}
            </div>

            {/* Back Button */}
            <div className="text-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToLogin}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

