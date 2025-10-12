'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useVerifyOtp } from '@/hooks/use-verify-otp';
import { Shield, Loader2, ArrowLeft } from 'lucide-react';

export function VerifyOtpForm() {
  const [otp, setOtp] = useState('');
  const { email, expiresAt, isLoading, error, fieldErrors, timeLeft, canResend, formatTime, handleSubmit, handleResendOtp, handleBackToEmail } = useVerifyOtp();

  // Auto-submit when 6 digits are entered
  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      handleSubmit(value);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Shield className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Check your email</CardTitle>
        <CardDescription>
          We've sent a verification code to <strong>{email}</strong>
        </CardDescription>
        {expiresAt && (
          <p className="text-xs text-muted-foreground mt-2">
            Code expires at: {new Date(expiresAt).toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={handleOtpChange} disabled={isLoading}>
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

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code to continue automatically
            </p>
          </div>

          {fieldErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {fieldErrors.map((fieldError, index) => (
                    <li key={index}>
                      <strong>{fieldError.field}:</strong> {fieldError.message}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Verifying...</span>
            </div>
          )}
        </div>

        <div className="space-y-3 text-center">
          <div className="text-sm text-muted-foreground">
            {canResend ? (
              <p>Didn't receive the code?</p>
            ) : (
              <p>Resend code in {formatTime(timeLeft)}</p>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleResendOtp} 
            disabled={isLoading || !canResend} 
            className="w-full"
          >
            Send another code
          </Button>
          
          <Button variant="ghost" onClick={handleBackToEmail} disabled={isLoading} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Use different email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
