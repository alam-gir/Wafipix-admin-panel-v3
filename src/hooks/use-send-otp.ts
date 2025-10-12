'use client';

/**
 * Custom hook for Send OTP form logic
 */

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendOtpSchema, type SendOtpFormData } from '@/lib/schemas/auth';
import { handleApiError, hasFieldErrors, hasGeneralErrors } from '@/lib/utils/form-error-handler';
import { useAuth } from '@/lib/hooks/auth/use-auth';

export function useSendOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const { sendOtpToEmail, clearAuthError } = useAuth();

  const validateForm = (data: SendOtpFormData) => {
    const validation = sendOtpSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return false;
    }
    return true;
  };

  const handleSubmit = async (email: string) => {
    if (!validateForm({ email })) {
      return;
    }

    setIsLoading(true);
    setError('');
    setFieldErrors([]);
    clearAuthError();

    try {
      const response = await sendOtpToEmail(email.trim());
      
      // Redirect directly to verify-otp page
      const verifyUrl = `/verify-otp?email=${encodeURIComponent(email.trim())}&redirect=${encodeURIComponent(redirectTo)}&expiresAt=${encodeURIComponent(response.expiresAt)}`;
      router.push(verifyUrl);
    } catch (err: any) {
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

  const resetForm = () => {
    setSuccess(false);
    setError('');
    setFieldErrors([]);
    setExpiresAt(null);
  };

  return {
    isLoading,
    error,
    fieldErrors,
    handleSubmit,
  };
}
