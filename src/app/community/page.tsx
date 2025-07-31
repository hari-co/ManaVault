"use client"
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/config/firebase-config';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, orderBy, limit, Query, DocumentData } from 'firebase/firestore';

interface UserSearchResult {
  id: string;
  username: string;
  displayName?: string;
  email?: string;
}

export default function Community() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const searchUsers = async (searchTerm: string) => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setSearching(true);
    setHasSearched(true);
    
    try {
      const usersRef = collection(db, 'users');
      const userQuery = query(
        usersRef,
        where('username', '>=', searchTerm.toLowerCase()),
        where('username', '<=', searchTerm.toLowerCase() + '\uf8ff'),
        orderBy('username'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(userQuery);
      const results: UserSearchResult[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as {
          username: string;
          displayName?: string;
          email?: string;
        };
        results.push({
          id: doc.id,
          username: userData.username,
          displayName: userData.displayName,
          email: userData.email
        });
      });
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    const timeoutId = setTimeout(() => {
      searchUsers(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  const visitUserProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#181e2c' }}>
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">Find Users</h1>
        
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for users by username..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-4 bg-[#141823] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#616dc9] transition-colors"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {searching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#616dc9]"></div>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {hasSearched && (
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''}
                </h2>
                <div className="grid gap-4">
                  {searchResults.map((userResult) => (
                    <div
                      key={userResult.id}
                      className="bg-[#141823] border border-gray-600 rounded-lg p-4 hover:border-[#616dc9] transition-colors cursor-pointer"
                      onClick={() => visitUserProfile(userResult.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            @{userResult.username}
                          </h3>
                          {userResult.displayName && (
                            <p className="text-gray-300 text-sm">
                              {userResult.displayName}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-[#616dc9]">
                          <span className="text-sm">View Profile</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No users found</h3>
                <p className="text-gray-500">Try searching with a different username</p>
              </div>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Discover the ManaVault Community</h3>
            <p className="text-gray-500">Enter a username to find MTG collectors and explore their profiles and collections</p>
          </div>
        )}
      </div>
    </div>
  );
}
