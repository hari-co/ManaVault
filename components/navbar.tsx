'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '@/config/firebase-config';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';

const NavBar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    const isHome = pathname === "/";

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

    return (<>
    {isHome &&
        <nav className='flex absolute top-0 w-full z-50 bg-[#111e4100] text-white py-4 px-20 font-sans font-semibold h-14 justify-center'>
            <div className='w-full flex items-center justify-between'>
                <Link href="/" className='hover:text-[#616dc9]'>ManaVault</Link>
                <div className='hidden md:flex space-x-6'>
                    {user ? (
                        <div className='flex space-x-6'>
                        <Link href="/library" className='hover:text-[#616dc9]'>Library</Link>
                        <button className='hover:text-[#616dc9]' onClick={signOutUser}>Log Out</button>
                        </div>
                    ) : (
                        <div className='flex space-x-6'>
                        <Link href="/account/login" className='hover:text-[#616dc9]'>Login</Link>
                        <Link href="/account/register" className='hover:text-[#616dc9]'>Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    }
    {!isHome &&
        <nav className='flex top-0 z-50 bg-[#141823] text-white py-4 px-20 font-sans font-semibold h-14 justify-center'>
            <div className='w-full flex items-center justify-between'>
                <Link href="/" className='hover:text-[#616dc9]'>ManaVault</Link>
                <div className='hidden md:flex space-x-6'>
                    {user ? (
                        <div className='flex space-x-6'>
                        <Link href="/library" className='hover:text-[#616dc9]'>Library</Link>
                        <button className='hover:text-[#616dc9]' onClick={signOutUser}>Log Out</button>
                        </div>
                    ) : (
                        <div className='flex space-x-6'>
                        <Link href="/account/login" className='hover:text-[#616dc9]'>Login</Link>
                        <Link href="/account/register" className='hover:text-[#616dc9]'>Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>}
    </>);
};

export default NavBar;