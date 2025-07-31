"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (<>
    <div className="flex w-full items-center justify-center min-h-screen relative text-gray-50 font-sans">
      <div className="absolute top-0 left-0 w-full h-full z-2 bg-[#1f275357]"/>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute top-0 left-0 z-1 w-full h-full object-cover"
        >
          <source src="/landingManaVault.mp4" type="video/mp4" />
          <img src="/manavaultlanding.png" alt="ManaVault Background" className="w-full h-full object-cover" />
        </video>
        <div className="z-10 flex items-center justify-center flex-col">
          <h1 className="text-center text-8xl z-10 font-semibold">ManaVault</h1>
          <h2 className="text-3xl font-medium">Track your MTG collection</h2>
          <button 
          className="mt-10 w-35 h-13 rounded-xl border border-gray-500 bg-[#1a1829b4] hover:bg-[#353152b4]"
          onClick={() => router.push("/account/login")}>
            <h2>Get started</h2>
          </button>
        </div>
    </div>
    <div>
      
    </div>
  </>);
};