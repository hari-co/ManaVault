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
                <div className='bg-green-600 p-3 h-32'>
                    <h1 className="font-bold text-5xl py-6">Library</h1>
                </div>
                <div className='flex flex-grow bg-[#1e252c]'>
                    <div>
                        <Binders />
                    </div>
                    <div className='flex w-full h-full flex-col'>
                        <div className='flex rounded-bl-lg rounded-br-lg ml-12 mr-12 py-3 px-7 h-25 bg-[#141822] text-[#bfc8ce]'>
                            <div>
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