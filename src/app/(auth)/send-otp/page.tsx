import { SendOtpForm } from '@/components/auth/send-otp-form';

export default function SendOtpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SendOtpForm />
    </div>
  );
}