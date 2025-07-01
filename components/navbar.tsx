'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '@/config/firebase-config';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const NavBar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const signOutUser = async () => {
        try {
            await signOut(auth);
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <nav className='top-0 z-50 bg-black text-white p-4 font-semibold h-14 m-0'>
            <div className='bg-blue-400 container mx-auto flex items-center justify-between px-10'>
                <Link href="/" className='hover:text-purple-400'>ManaVault</Link>
                <div className='hidden md:flex space-x-6'>
                    {user ? (
                        <div className='flex space-x-6'>
                        <Link href="/library" className='hover:text-purple-400'>Library</Link>
                        <button className='hover:text-purple-400' onClick={signOutUser}>Log Out</button>
                        </div>
                    ) : (
                        <div className='flex space-x-6'>
                        <Link href="/account/login" className='hover:text-purple-400'>Login</Link>
                        <Link href="/account/register" className='hover:text-purple-400'>Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;