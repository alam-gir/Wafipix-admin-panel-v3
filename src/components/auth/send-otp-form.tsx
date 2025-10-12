'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSendOtp } from '@/hooks/use-send-otp';
import { Mail, Loader2 } from 'lucide-react';

export function SendOtpForm() {
  const [email, setEmail] = useState('');
  const { isLoading, error, fieldErrors, handleSubmit } = useSendOtp();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(email);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Enter your email address to receive a verification code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {fieldErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {fieldErrors
                    .filter(err => err.field !== null)
                    .map((fieldError, index) => (
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send verification code'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
