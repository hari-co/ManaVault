"use client"
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface UserProfile {
  username: string;
  email: string;
  createdAt: any;
}

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setUser(user);
      if (!user) {
        router.push('/account/login');
        return;
      }

      // Fetch user profile data
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const profileData = userDoc.data() as UserProfile;
          setProfile(profileData);
          setUsername(profileData.username);
          setEmail(profileData.email);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for updating username will be implemented later
    console.log('Update username to:', username);
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for updating email will be implemented later
    console.log('Update email to:', email);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for updating password will be implemented later
    console.log('Update password');
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user || !profile) {
    return <div className="p-4">Profile not found</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      {/* Username Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Username</h2>
        <form onSubmit={handleUsernameChange}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Username
            </label>
            <p className="text-sm text-gray-500 mb-4">{profile.username}</p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#616dc9] focus:border-transparent"
              placeholder="Enter new username"
            />
          </div>
          <button
            type="submit"
            className="bg-[#616dc9] text-white px-4 py-2 rounded hover:bg-[#5159b3] transition-colors"
          >
            Update Username
          </button>
        </form>
      </div>

      {/* Email Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Email Address</h2>
        <form onSubmit={handleEmailChange}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Email
            </label>
            <p className="text-sm text-gray-500 mb-4">{profile.email}</p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#616dc9] focus:border-transparent"
              placeholder="Enter new email address"
            />
          </div>
          <button
            type="submit"
            className="bg-[#616dc9] text-white px-4 py-2 rounded hover:bg-[#5159b3] transition-colors"
          >
            Update Email
          </button>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#616dc9] focus:border-transparent"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#616dc9] focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#616dc9] focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-[#616dc9] text-white px-4 py-2 rounded hover:bg-[#5159b3] transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
