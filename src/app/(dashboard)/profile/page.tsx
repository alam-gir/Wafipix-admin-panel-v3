import { ProfileContent } from '@/components/profile/profile-content';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>
      
      <ProfileContent />
    </div>
  );
}
