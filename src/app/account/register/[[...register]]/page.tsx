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
      <div className="bg-blue-200 flex justify-center items-center min-h-[calc(100vh-3.5rem)] w-screen">
        <form className="bg-white flex flex-col p-8 rounded shadow-md w-96"
              onSubmit={register}>
          <div className="flex justify-center">
            <h2>Register for ManaVault</h2>
          </div>
          <div>
            <p>Username</p>
            <input
              className="border"
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              />
              <p>Email</p>
              <input
                className="border"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
              <p>Confirm Password</p>
              <input
                className="border"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                />
          </div>
            {error && (
            <p className="text-red-500">{error}</p>)}
          <button
          className="border rounded mt-8 p-2 hover:bg-gray-300"
            type="submit"
            >
              Register
            </button>
        </form>
      </div>
    )
}