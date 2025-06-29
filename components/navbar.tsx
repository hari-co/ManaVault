import Link from 'next/link';
import React from 'react';

const NavBar: React.FC = () => {
    return (
        <nav className='top-0 z-50 bg-black text-white p-4 font-semibold'>
            <div className='container mx-auto flex items-center justify-between px-4 py-4'>
                <Link href="/" className='hover:text-purple-400'>Catchy Name</Link>
                <div className='hidden md:flex space-x-6'>
                    <Link href="/library" className='hover:text-purple-400'>Library</Link>
                    <Link href="/login" className='hover:text-purple-400'>Login</Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;