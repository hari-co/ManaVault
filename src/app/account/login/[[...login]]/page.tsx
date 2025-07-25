"use client"
import { useState, useEffect } from "react";
import { auth, db } from "@/config/firebase-config";
import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { query, where, getDocs, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
        setUser(user);
        if (user) {
          router.push('/library');
        }
    })
    return () => unsubscribe();
  });

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    let login: string;
    const input = username.trim();

    if (input.includes('@')) {
      login = input;
    } else {
      const q = query(collection(db, "users"), where("username", "==", input));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Username does not exist.');
        return;
      }
      const loginDoc = querySnapshot.docs[0];
      login = loginDoc.data().email;
    }

    try {
      await signInWithEmailAndPassword(auth, login, password);
      setUsername('');
      setPassword('');
      router.push('/library')
    } catch (error: any) {
      setError(error.message);
    }
  }

    if (user === undefined) {
      return (<div></div>)
    }
    
    return (!user &&
      <div className="bg-linear-to-br from-[#181e2c] via-[#1b1b4e] to-[#141823] flex justify-center items-center min-h-[calc(100vh-3.5rem)] w-full">
        <form className="bg-[#141823]/70 flex flex-col p-8 rounded-xl shadow-md w-96 text-gray-50 font-sans space-y-6"
              onSubmit={signIn}>
          <div className="flex justify-center mb-8">
            <h2 className="text-4xl font-bold text-[#9899da]">ManaVault</h2>
          </div>
          <div>
            <p className="text-gray-300 mb-3 font-semibold tracking-wide">Username</p>
            <input
              className="bg-gray-700/40 border border-gray-600 w-full h-12 rounded-md px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              />
              <p className="text-gray-300 mb-3 font-semibold tracking-wide">Password</p>
              <input 
                className="bg-gray-700/40 border border-gray-600 w-full h-12 rounded-md px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
          </div>
          {error && (
            <p className="text-red-400 text-center bg-red-900/20 border border-red-500/30 rounded-md p-3 font-medium">
              {error}
            </p>
          )}
          <button
            className="bg-[#5d5fd4] hover:bg-[#3f4088] text-white font-bold rounded-md mt-8 p-3 transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#141823] shadow-lg"
            type="submit"
            >
              Login
            </button>
        </form>
      </div>
    )
}