/**
 * Authentication form schemas using Zod
 */

import { z } from 'zod';

// Send OTP Schema
export const sendOtpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
});

// Verify OTP Schema
export const verifyOtpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  otp: z
    .string()
    .min(6, 'Please enter the complete verification code')
    .max(6, 'Invalid verification code')
    .regex(/^\d{6}$/, 'Verification code must be 6 digits'),
});

// Login Schema (if needed in future)
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

// Export types
export type SendOtpFormData = z.infer<typeof sendOtpSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
