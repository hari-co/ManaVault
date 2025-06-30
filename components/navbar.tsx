import Link from 'next/link';
import React from 'react';
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs';

const NavBar: React.FC = () => {
    return (
        <nav className='top-0 z-50 bg-black text-white p-4 font-semibold h-14 m-0'>
            <div className='bg-blue-400 container mx-auto flex items-center justify-between px-10'>
                <Link href="/" className='hover:text-purple-400'>ManaVault</Link>
                <div className='hidden md:flex space-x-6'>
                    <SignedIn>
                        <Link href="/library" className='hover:text-purple-400'>Library</Link>
                        <UserButton/>
                    </SignedIn>
                    <SignedOut>
                        <Link href="/account/login" className='hover:text-purple-400'>Login</Link>
                        <Link href="/account/register" className='hover:text-purple-400'>Register</Link>
                    </SignedOut>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;