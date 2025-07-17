"use client"
import CardSearch from '../../../components/CardSearch';
import Binders from '../../../components/Binders';
import CardDisplay from '../../../components/CardDisplay';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase-config';
import { BinderProvider } from '@/context/BinderContext';
import { useRouter } from 'next/navigation';

export default function Library() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            setUser(user);
            if (!user) {
                router.push('/account/login');
            }
        });
        return () => unsubscribe();
    })

    return (
        user && (
        <BinderProvider>
            <div className='flex flex-col h-[calc(100vh-3.5rem)] w-full font-sans font-medium'>
                <div className='text-gray-300 bg-gradient-to-b from-[#3f3cec] to-[#423fe9] p-3 h-60 relative flex-shrink-0'>
                    <div className='absolute top-0 left-0 w-full h-full'
                    style={{
                        backgroundImage: `
                        linear-gradient(transparent, #181e2c)`,
                        zIndex: 2
                    }}/>
                    {/* <img  */}
                    <h1 className="font-bold text-5xl p-9 z-10 relative">Library</h1>
                </div>
                <div className='flex flex-grow bg-[#181e2c]'>
                    <div>
                        <Binders />
                    </div>
                    <div className='flex w-full h-full flex-col'>
                        <div className='flex rounded-bl-lg rounded-br-lg ml-12 mr-12 py-3 px-7 h-25 bg-[#141822] text-[#bfc8ce] relative z-10 border border-gray-600'>
                            <div className="absolute top-0 left-0 w-full h-full z-1 overflow-x-hidden"
                                    style={{
                                    backgroundImage: `
                                    repeating-linear-gradient(0deg, rgba(36, 40, 61, 0.8) 0px, rgba(36, 40, 61, 0.8) 1px, transparent 1px, transparent 20px),
                                    repeating-linear-gradient(90deg, rgba(36, 40, 61, 0.8) 0px, rgba(36, 40, 61, 0.8) 1px, transparent 1px, transparent 20px)
                                    `,
                                    WebkitMaskImage: `linear-gradient(white, transparent 70%)`,
                                    maskImage: `linear-gradient(white, transparent 70%)`
                                }}></div>
                            <div className='z-10'>
                                <h2>Quick Add</h2>
                                <CardSearch />
                            </div>
                        </div>
                        <div className='flex h-full justify-center scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300'>
                            <CardDisplay/>
                        </div>
                    </div>
                </div>
            </div>
        </BinderProvider>)
    );
}