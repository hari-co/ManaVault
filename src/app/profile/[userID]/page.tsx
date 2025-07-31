"use client"
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/config/firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import FollowButton from '../../../../components/ProfileComponents/FollowButton';
import FollowersSection from '../../../../components/ProfileComponents/FollowersSection';

interface UserProfile {
  username: string;
  email: string;
  createdAt: any;
  description?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const router = useRouter();
  const params = useParams<{userID: string}>()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setUser(user);

      try {
        const userDoc = await getDoc(doc(db, "users", params.userID));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setProfile(userData);
        }

        const descriptionRef = doc(db, "users", params.userID, "profile", "description");
        const descriptionDoc = await getDoc(descriptionRef);
        if (descriptionDoc.exists()) {
          const descriptionData = descriptionDoc.data();
          const description = descriptionData.description || '';
          setBioText(description);
          setProfile(prev => prev ? { ...prev, description } : null);
        } else {
          setBioText('');
        }

        const followingRef = doc(db, "users", params.userID, "profile", "following");
        const followingDoc = await getDoc(followingRef);
        if (followingDoc.exists()) {
          const followingData = followingDoc.data();
          const userIds = followingData.userIds || [];
          setFollowingCount(userIds.length);
        } else {
          setFollowingCount(0);
        }

        const followersRef = doc(db, "users", params.userID, "profile", "followers");
        const followersDoc = await getDoc(followersRef);
        if (followersDoc.exists()) {
          const followersData = followersDoc.data();
          const userIds = followersData.userIds || [];
          setFollowersCount(userIds.length);
        } else {
          setFollowersCount(0);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, params.userID]);

  const handleEditBio = () => {
    setIsEditingBio(true);
  };

  const handleSaveBio = async () => {
    if (!user) return; // Only allow authenticated users to edit
    
    try {
      const profileRef = doc(db, "users", params.userID, "profile", "description");
      await setDoc(profileRef, { description: bioText });
      
      setProfile(prev => prev ? { ...prev, description: bioText } : null);
      setIsEditingBio(false);
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleCancelBio = () => {
    setBioText(profile?.description || '');
    setIsEditingBio(false);
  };

  const isOwnProfile = user?.uid === params.userID;

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!profile) {
    return <div className="p-4">Profile not found</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-[#141823] shadow rounded-lg p-6 border border-gray-500 h-[720px]">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <div 
                  className="w-8 h-8 bg-gray-400"
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
              
              <div className="flex flex-1 min-w-0 space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center space-x-3 mb-1">
                    <h2 className="text-2xl font-bold text-white">{profile.username}</h2>
                    {user && (
                      <FollowButton 
                        currentUser={user}
                        targetUserId={params.userID}
                        isOwnProfile={isOwnProfile}
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    Member since {profile.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                  </p>
                  <button 
                    onClick={() => router.push(`/library/${params.userID}`)}
                    className="mt-2 px-4 py-2 text-sm bg-[#616dc9] text-white rounded hover:bg-[#5159b3] transition-colors"
                  >
                    View Library
                  </button>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-300 min-h-[120px]">
                    {isEditingBio ? (
                      <div className="space-y-2">
                        <textarea
                          value={bioText}
                          onChange={(e) => setBioText(e.target.value)}
                          placeholder="Tell the community about yourself!"
                          className="w-full p-2 bg-[#181e2c] border border-gray-500 rounded text-sm text-white resize-none"
                          rows={3}
                          maxLength={200}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{bioText.length}/200</span>
                          <div className="space-x-2">
                            <button
                              onClick={handleCancelBio}
                              className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveBio}
                              className="px-3 py-1 text-xs bg-[#616dc9] text-white rounded hover:bg-[#5159b3] transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <p className={profile?.description ? "text-gray-300" : "italic text-gray-400"}>
                          {profile?.description || "No bio yet. Tell the community about yourself!"}
                        </p>
                        {isOwnProfile && (
                          <button 
                            onClick={handleEditBio}
                            className="ml-2 px-3 py-1 text-xs bg-[#616dc9] text-white rounded hover:bg-[#5159b3] transition-colors flex-shrink-0"
                          >
                            Edit Bio
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FollowersSection 
          followingCount={followingCount}
          followersCount={followersCount}
          isOwnProfile={isOwnProfile}
          userId={params.userID}
        />
      </div>
    </div>
  );
}
