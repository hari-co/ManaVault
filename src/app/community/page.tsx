"use client"
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase-config';
import { useRouter } from 'next/navigation';

export default function Community() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUser(user);
      if (!user) {
        router.push('/account/login');
        return;
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return <div className="p-4">Please log in to access the community.</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#181e2c' }}>
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">Community</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Collections */}
          <div className="bg-[#141823] rounded-lg p-6 border border-gray-600">
            <h2 className="text-xl font-semibold mb-4 text-white">Featured Collections</h2>
            <p className="text-gray-300 text-sm mb-4">
              Discover amazing card collections from the community
            </p>
            <div className="space-y-3">
              <div className="bg-[#1f2537] p-3 rounded hover:bg-[#2a2f42] transition-colors">
                <p className="text-white font-medium">Coming Soon</p>
                <p className="text-gray-400 text-sm">Featured collections will appear here</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#141823] rounded-lg p-6 border border-gray-600">
            <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
            <p className="text-gray-300 text-sm mb-4">
              See what the community has been up to
            </p>
            <div className="space-y-3">
              <div className="bg-[#1f2537] p-3 rounded hover:bg-[#2a2f42] transition-colors">
                <p className="text-white font-medium">Coming Soon</p>
                <p className="text-gray-400 text-sm">Community activity will appear here</p>
              </div>
            </div>
          </div>

          {/* Trending Cards */}
          <div className="bg-[#141823] rounded-lg p-6 border border-gray-600">
            <h2 className="text-xl font-semibold mb-4 text-white">Trending Cards</h2>
            <p className="text-gray-300 text-sm mb-4">
              Popular cards in the community right now
            </p>
            <div className="space-y-3">
              <div className="bg-[#1f2537] p-3 rounded hover:bg-[#2a2f42] transition-colors">
                <p className="text-white font-medium">Coming Soon</p>
                <p className="text-gray-400 text-sm">Trending cards will appear here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="mt-8 bg-[#141823] rounded-lg p-6 border border-gray-600">
          <h2 className="text-2xl font-semibold mb-6 text-white">Community Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#616dc9] mb-2">--</div>
              <div className="text-gray-300">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#616dc9] mb-2">--</div>
              <div className="text-gray-300">Cards Collected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#616dc9] mb-2">--</div>
              <div className="text-gray-300">Public Libraries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#616dc9] mb-2">--</div>
              <div className="text-gray-300">Active This Week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
