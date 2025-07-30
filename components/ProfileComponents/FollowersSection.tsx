"use client"
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase-config';
import Link from 'next/link';
import FollowingModal from './FollowingModal';
import FollowersModal from './FollowersModal';

interface FollowersSectionProps {
  followingCount: number;
  followersCount: number;
  isOwnProfile: boolean;
  userId: string;
}

interface UserData {
  username: string;
  email: string;
  uid: string;
}

export default function FollowersSection({ 
  followingCount, 
  followersCount, 
  isOwnProfile,
  userId 
}: FollowersSectionProps) {
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followingPreview, setFollowingPreview] = useState<UserData[]>([]);
  const [followersPreview, setFollowersPreview] = useState<UserData[]>([]);
  const [loadingPreviews, setLoadingPreviews] = useState(false);

  useEffect(() => {
    fetchPreviews();
  }, [userId, followingCount, followersCount]);

  const fetchPreviews = async () => {
    setLoadingPreviews(true);
    try {
      // Fetch following preview (up to 7)
      const followingRef = doc(db, "users", userId, "profile", "following");
      const followingDoc = await getDoc(followingRef);
      
      if (followingDoc.exists()) {
        const followingData = followingDoc.data();
        const userIds = followingData.userIds || [];
        const limitedUserIds = userIds.slice(0, 7);
        
        const followingUsersData = await Promise.all(
          limitedUserIds.map(async (uid: string) => {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
              return { ...userDoc.data(), uid } as UserData;
            }
            return null;
          })
        );
        
        setFollowingPreview(followingUsersData.filter(user => user !== null) as UserData[]);
      }

      // Fetch followers preview (up to 7)
      const followersRef = doc(db, "users", userId, "profile", "followers");
      const followersDoc = await getDoc(followersRef);
      
      if (followersDoc.exists()) {
        const followersData = followersDoc.data();
        const userIds = followersData.userIds || [];
        const limitedUserIds = userIds.slice(0, 7);
        
        const followersUsersData = await Promise.all(
          limitedUserIds.map(async (uid: string) => {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
              return { ...userDoc.data(), uid } as UserData;
            }
            return null;
          })
        );
        
        setFollowersPreview(followersUsersData.filter(user => user !== null) as UserData[]);
      }
    } catch (error) {
      console.error("Error fetching preview data:", error);
    } finally {
      setLoadingPreviews(false);
    }
  };
  return (
    <div className="w-80">
      <div className="bg-[#141823] shadow rounded-lg p-6 border border-gray-500">
        <div className="space-y-8">
          {/* Following Section */}
          <div>
            <button 
              onClick={() => setShowFollowingModal(true)}
              className="text-xl font-semibold mb-3 hover:text-[#616dc9] transition-colors cursor-pointer"
            >
              Following ({followingCount})
            </button>
            <div className="space-y-2 min-h-[280px]">
              {/* Following Preview */}
              {loadingPreviews ? (
                <div className="text-xs text-gray-400">Loading...</div>
              ) : followingCount === 0 ? (
                <div className="text-sm text-gray-500">
                  {isOwnProfile ? "You're not following anyone yet." : "Not following anyone yet."}
                </div>
              ) : (
                <div className="space-y-2">
                  {followingPreview.map((user) => (
                    <div key={user.uid} className="flex items-center space-x-3 p-2 hover:bg-[#181e2c] rounded transition-colors">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <div 
                          className="w-5 h-5 bg-gray-400"
                          style={{
                            maskImage: 'url(/user.svg)',
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskImage: 'url(/user.svg)',
                            WebkitMaskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center'
                          }}
                        />
                      </div>
                      <Link href={`/profile/${user.uid}`} className="text-sm text-white hover:text-[#616dc9] transition-colors">
                        {user.username}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Followers Section */}
          <div>
            <button 
              onClick={() => setShowFollowersModal(true)}
              className="text-xl font-semibold mb-3 hover:text-[#616dc9] transition-colors cursor-pointer"
            >
              Followers ({followersCount})
            </button>
            <div className="space-y-2 min-h-[280px]">
              {/* Followers Preview */}
              {loadingPreviews ? (
                <div className="text-xs text-gray-400">Loading...</div>
              ) : followersCount === 0 ? (
                <div className="text-sm text-gray-500">
                  {isOwnProfile ? "No followers yet." : "No followers."}
                </div>
              ) : (
                <div className="space-y-2">
                  {followersPreview.map((user) => (
                    <div key={user.uid} className="flex items-center space-x-3 p-2 hover:bg-[#181e2c] rounded transition-colors">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <div 
                          className="w-5 h-5 bg-gray-400"
                          style={{
                            maskImage: 'url(/user.svg)',
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskImage: 'url(/user.svg)',
                            WebkitMaskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center'
                          }}
                        />
                      </div>
                      <Link href={`/profile/${user.uid}`} className="text-sm text-white hover:text-[#616dc9] transition-colors">
                        {user.username}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <FollowingModal 
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        userId={userId}
        followingCount={followingCount}
      />
      
      <FollowersModal 
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        userId={userId}
        followersCount={followersCount}
      />
    </div>
  );
}
