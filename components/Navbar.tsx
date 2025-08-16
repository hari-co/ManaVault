'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, db } from '@/config/firebase-config';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';

const NavBar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState<string>('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const isHome = pathname === "/";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        setUsername(userDoc.data().username || '');
                    }
                } catch (error) {
                    console.error("Error fetching username:", error);
                }
            } else {
                setUsername('');
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.dropdown-container')) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const signOutUser = async () => {
        try {
            await signOut(auth);
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const NavContent = () => (
        <div className='w-full flex items-center justify-between'>
            <Link href="/" className='hover:text-[#616dc9]'>ManaVault</Link>
            <div className='hidden md:flex space-x-6'>
                <Link href="/community" className='hover:text-[#616dc9]'>Community</Link>
                {user ? (
                    <div className='flex space-x-6 items-center'>
                    <Link href="/library" className='hover:text-[#616dc9]'>Library</Link>
                    <div className='relative dropdown-container'>
                        <button 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className='flex items-center space-x-2 hover:text-[#616dc9] group transition-colors'
                        >
                            <div 
                                className='w-5 h-5 bg-white group-hover:bg-[#616dc9] transition-colors'
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
                            <span>{username}</span>
                        </button>
                        {dropdownOpen && (
                            <div className='absolute right-0 mt-2 w-48 bg-[#141823] rounded-md shadow-lg py-1 z-50 border border-gray-600'>
                                <Link 
                                    href={`/profile/${user.uid}`}
                                    className='block px-4 py-2 text-sm text-gray-300 hover:bg-[#1f2537] hover:text-white'
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button 
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        signOutUser();
                                    }}
                                    className='block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#1f2537] hover:text-white'
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                    </div>
                ) : (
                    <div className='flex space-x-6'>
                    <Link href="/account/login" className='hover:text-[#616dc9]'>Login</Link>
                    <Link href="/account/register" className='hover:text-[#616dc9]'>Register</Link>
                    </div>
                )}
            </div>
        </div>
    );

    const navClasses = isHome 
        ? 'flex absolute top-0 w-full z-50 bg-[#111e4100] text-white py-4 px-20 font-sans font-semibold h-14 justify-center'
        : 'flex top-0 z-50 bg-[#141823] text-white py-4 px-20 font-sans font-semibold h-14 justify-center border-b border-gray-500';

    return (
        <nav className={navClasses}>
            <NavContent />
        </nav>
    );
};

export default NavBar;
