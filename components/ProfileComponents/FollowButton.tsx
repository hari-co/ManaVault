'use client'
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { db } from '@/config/firebase-config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface FollowButtonProps {
  currentUser: User;
  targetUserId: string;
  isOwnProfile: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ currentUser, targetUserId, isOwnProfile }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUser || isOwnProfile) return;

      try {
        const currentUserFollowingRef = doc(db, "users", currentUser.uid, "profile", "following");
        const followingDoc = await getDoc(currentUserFollowingRef);
        
        if (followingDoc.exists()) {
          const followingData = followingDoc.data();
          const userIds = followingData.userIds || [];
          setIsFollowing(userIds.includes(targetUserId));
        } else {
          setIsFollowing(false);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowStatus();
  }, [currentUser, targetUserId, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!currentUser || loading) return;

    setLoading(true);
    try {
      const currentUserFollowingRef = doc(db, "users", currentUser.uid, "profile", "following");
      const targetUserFollowersRef = doc(db, "users", targetUserId, "profile", "followers");

      if (isFollowing) {
        await updateDoc(currentUserFollowingRef, {
          userIds: arrayRemove(targetUserId)
        }).catch(async () => {
          await setDoc(currentUserFollowingRef, {
            userIds: []
          });
        });

        await updateDoc(targetUserFollowersRef, {
          userIds: arrayRemove(currentUser.uid)
        }).catch(async () => {
          await setDoc(targetUserFollowersRef, {
            userIds: []
          });
        });
      } else {
        await updateDoc(currentUserFollowingRef, {
          userIds: arrayUnion(targetUserId)
        }).catch(async () => {
          await setDoc(currentUserFollowingRef, {
            userIds: [targetUserId]
          });
        });

        await updateDoc(targetUserFollowersRef, {
          userIds: arrayUnion(currentUser.uid)
        }).catch(async () => {
          await setDoc(targetUserFollowersRef, {
            userIds: [currentUser.uid]
          });
        });
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error updating follow status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || isOwnProfile) {
    return null;
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`px-4 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 ${
        isFollowing
          ? 'bg-gray-600 text-white hover:bg-red-600 hover:text-white'
          : 'bg-[#616dc9] text-white hover:bg-[#5159b3]'
      }`}
    >
      {loading ? 'Loading...' : (isFollowing ? 'Following' : 'Follow')}
    </button>
  );
};

export default FollowButton;
