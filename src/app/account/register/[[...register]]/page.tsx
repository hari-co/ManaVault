"use client"
import { useState, useEffect } from "react";
import { auth, db } from "@/config/firebase-config";
import { createUserWithEmailAndPassword,  onAuthStateChanged, User} from "firebase/auth";
import { addDoc, setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { validateRegistration } from "@/utils/registration-validation";
import { create } from "domain";

export default function register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const register = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = await validateRegistration(username, password, confirmPassword);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredentials.user.uid;
      try {
        await setDoc(doc(db, "users", uid), { username, email, createdAt: new Date() });
        await setDoc(doc(db, "users", uid, "profile", "description"), {});
        await setDoc(doc(db, "users", uid, "binders", "all"), {name: "All Cards", index: 0, color: "adadad"});
      } catch (error: any) {
        setError("Error creating user data. Please try again.");
        await userCredentials.user.delete();
        return;
      }
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      router.push('/library');
    } catch (error: any) {
      setError(error.message);
    }
  }
  
  if (user === undefined) {
    return (<div></div>)
  }

    return (!user &&
      <div className="bg-linear-to-br from-[#181e2c] via-[#1b1b4e] to-[#141823] flex justify-center items-center min-h-[calc(100vh-3.5rem)] w-full">
        <form className="bg-[#141823]/70 flex flex-col p-6 rounded-xl shadow-md w-96 text-gray-50 font-sans space-y-3"
              onSubmit={register}>
          <div className="flex justify-center mb-4">
            <h2 className="text-3xl font-bold text-white">Register</h2>
          </div>
          <div>
            <p className="text-gray-300 mb-2 font-semibold tracking-wide">Username</p>
            <input
              className="bg-gray-700/40 border border-gray-600 w-full h-10 rounded-md px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              />
              <p className="text-gray-300 mb-2 font-semibold tracking-wide">Email</p>
              <input
                className="bg-gray-700/40 border border-gray-600 w-full h-10 rounded-md px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <p className="text-gray-300 mb-2 font-semibold tracking-wide">Password</p>
              <input 
                className="bg-gray-700/40 border border-gray-600 w-full h-10 rounded-md px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <p className="text-gray-300 mb-2 font-semibold tracking-wide">Confirm Password</p>
              <input
                className="bg-gray-700/40 border border-gray-600 w-full h-10 rounded-md px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                />
          </div>
            {error && (
            <p className="text-red-400 text-center bg-red-900/20 border border-red-500/30 rounded-md p-3 font-medium">
              {error}
            </p>)}
          <button
            className="bg-[#5d5fd4] hover:bg-[#3f4088] text-white font-bold rounded-md mt-4 p-2 transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#141823] shadow-lg"
            type="submit"
            >
              Register
            </button>
        </form>
      </div>
    )
}