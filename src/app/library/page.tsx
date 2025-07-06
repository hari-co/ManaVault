"use client"
import CardSearch from '../../../components/cardsearch';
import Binders from '../../../components/binders';
import CardDisplay from '../../../components/cardDisplay';
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
            <div className='flex flex-col h-[calc(100vh-3.5rem)] w-full'>
                <div className='bg-green-600 flex flex-col p-3 h-32'>
                    <h1 className="font-bold text-5xl py-6">Library</h1>
                </div>
                <div className='flex bg-fuchsia-400'>
                    Toolbar
                    <CardSearch />
                </div>
                <div className='flex flex-grow bg-amber-500'>
                    <Binders />
                    <CardDisplay/>
                </div>
            </div>
        </BinderProvider>)
    );
}