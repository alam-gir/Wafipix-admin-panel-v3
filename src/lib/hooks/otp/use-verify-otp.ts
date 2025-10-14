'use client';

/**
 * Custom hook for Verify OTP form logic
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyOtpSchema, type VerifyOtpFormData } from '@/lib/schemas/auth';
import { handleApiError, hasFieldErrors, hasGeneralErrors } from '@/lib/utils/form-error-handler';
import { FieldError } from '@/lib/api/types/common';
import { useAuth } from '@/lib/hooks/auth/use-auth';

export function useVerifyOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute countdown
  const [canResend, setCanResend] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const expiresAt = searchParams.get('expiresAt') || '';
  const { verifyOtpAndLogin, clearAuthError } = useAuth();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const validateForm = (data: VerifyOtpFormData) => {
    const validation = verifyOtpSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return false;
    }
    return true;
  };

  const handleSubmit = async (otp: string) => {
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateForm({ email, otp })) {
      return;
    }

    setIsLoading(true);
    setError('');
    setFieldErrors([]);
    clearAuthError();

    try {
      await verifyOtpAndLogin(email, otp);
      router.push(redirectTo);
    } catch (err: unknown) {
      const { message, fieldErrors, errorType } = handleApiError(err);
      
      // Set appropriate error message based on error type
      if (hasFieldErrors(fieldErrors)) {
        setError('Please fix the errors below');
      } else if (hasGeneralErrors(fieldErrors)) {
        setError(message);
      } else {
        setError(message);
      }
      
      setFieldErrors(fieldErrors);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (canResend) {
      setTimeLeft(60);
      setCanResend(false);
      router.push(`/send-otp?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectTo)}`);
    }
  };

  const handleBackToEmail = () => {
    router.push(`/send-otp?redirect=${encodeURIComponent(redirectTo)}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    email,
    expiresAt,
    isLoading,
    error,
    fieldErrors,
    timeLeft,
    canResend,
    formatTime,
    handleSubmit,
    handleResendOtp,
    handleBackToEmail,
  };
}
