"use client"
import CardSearch from '../../../components/cardsearch';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase-config';
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
        user && (<>
            <div className='bg-green-600 flex flex-col'>
                <h1 className="font-bold text-5xl py-6">Library</h1>
                <CardSearch />
            </div>
            <div className='flex flex-col bg-amber-500'>
                <p>hello</p>
            </div>
        </>)
    );
}