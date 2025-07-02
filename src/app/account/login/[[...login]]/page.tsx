"use client"
import { useState, useEffect } from "react";
import { auth } from "@/config/firebase-config";
import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
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

    try {
      await signInWithEmailAndPassword(auth, username, password);
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
      <div className="bg-blue-200 flex justify-center items-center min-h-[calc(100vh-3.5rem)] w-screen">
        <form className="bg-white flex flex-col p-8 rounded shadow-md w-96"
              onSubmit={signIn}>
          <div className="flex justify-center">
            <h2>ManaVault Login</h2>
          </div>
          <div>
            <p>Username</p>
            <input
              className="border"
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              />
              <p>Password</p>
              <input 
                className="border"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
          </div>
          {error && (
            <p className="text-red-500">
              {error}
            </p>
          )}
          <button
          className="border rounded mt-8 p-2 hover:bg-gray-300"
            type="submit"
            >
              Login
            </button>
        </form>
      </div>
    )
}