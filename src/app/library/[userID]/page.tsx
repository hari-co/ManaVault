"use client"
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase-config';
import { BinderProvider } from '@/context/BinderContext';
import { useParams, useRouter } from 'next/navigation';

import Binders from '../../../../components/Binders';
import CardDisplay from '../../../../components/CardDisplay';
import BinderStats from '../../../../components/BinderStats';
import ShareModal from '../../../../components/ShareModal';

export default function Library() {
    const [user, setUser] = useState<User | null>(null);
    const [viewOnly, setViewOnly] = useState<boolean>(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const router = useRouter();
    const params = useParams<{userID: string}>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            setUser(user);
            setViewOnly(user?.uid != params.userID);
        });
        return () => unsubscribe();
    })

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShareUrl(`${window.location.origin}/library/${params.userID}`);
        }
    }, [params.userID]);

    return (
        (
        <BinderProvider>
            <div className='flex flex-col min-h-[calc(100vh-3.5rem)] w-full font-sans font-medium'>
                <div className='text-gray-300 bg-gradient-to-b from-[#3f3cec] to-[#423fe9] p-3 h-60 relative flex-shrink-0'>
                    <div className='absolute top-0 left-0 w-full h-full'
                    style={{
                        backgroundImage: `
                        linear-gradient(transparent, #181e2c)`,
                        zIndex: 2
                    }}/>
                    <h1 className="font-bold text-5xl pl-12 pt-15 z-10 relative">Library</h1>
                    <div className='absolute right-15 top-8 z-10'>
                        <button 
                            onClick={() => setShowShareModal(true)}
                            className='flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200 shadow-lg'
                        >
                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z'/>
                            </svg>
                            <span className='text-sm font-medium'>Share</span>
                        </button>
                    </div>
                    <BinderStats paramID={params.userID}/>
                </div>
                <div className='flex flex-grow bg-[#181e2c]'>
                    <div>
                        <Binders viewOnly={viewOnly} paramID={params.userID}/>
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
                            </div>
                        </div>
                        <div className='flex h-full justify-center scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300'>
                            <CardDisplay viewOnly={viewOnly} paramID={params.userID}/>
                        </div>
                    </div>
                </div>
                <div className='h-15 bg-[#181e2c]'></div>
            </div>
            
            <ShareModal 
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                shareUrl={shareUrl}
                title={viewOnly ? "Share This Library" : "Share My Library"}
            />
        </BinderProvider>)
    );
}