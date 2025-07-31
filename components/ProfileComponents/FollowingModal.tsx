"use client"
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase-config';
import Link from 'next/link';

interface FollowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  followingCount: number;
}

interface UserData {
  username: string;
  email: string;
  uid: string;
}

export default function FollowingModal({ isOpen, onClose, userId, followingCount }: FollowingModalProps) {
  const [followingUsers, setFollowingUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && followingCount > 0) {
      fetchFollowingUsers();
    }
  }, [isOpen, userId, followingCount]);

  const fetchFollowingUsers = async () => {
    setLoading(true);
    try {
      const followingRef = doc(db, "users", userId, "profile", "following");
      const followingDoc = await getDoc(followingRef);
      
      if (followingDoc.exists()) {
        const followingData = followingDoc.data();
        const userIds = followingData.userIds || [];
        
        const usersData = await Promise.all(
          userIds.map(async (uid: string) => {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
              return { ...userDoc.data(), uid } as UserData & { uid: string };
            }
            return null;
          })
        );
        
        setFollowingUsers(usersData.filter(user => user !== null) as (UserData & { uid: string })[]);
      }
    } catch (error) {
      console.error("Error fetching following users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-[#000000b2] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#141823] rounded-lg p-6 w-96 max-h-96 overflow-y-auto border border-gray-500 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Following ({followingCount})</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : followingUsers.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-gray-400">Not following anyone yet.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {followingUsers.map((user, index) => (
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
                <div>
                  <Link href={`/profile/${user.uid}`} className="font-medium text-white hover:text-[#616dc9] transition-colors">{user.username}</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
