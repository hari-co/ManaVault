"use client"
import { useState, useEffect } from "react";
import { auth } from "@/config/firebase-config";
import { createUserWithEmailAndPassword,  onAuthStateChanged, User} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordDifferent, setPasswordDifferent] = useState(false);
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
    setPasswordDifferent(false);

    if (password !== confirmPassword) {
      setPasswordDifferent(true);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
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
          {passwordDifferent && (
            <p className="text-red-500">
              Passwords do not match. Please try again.
            </p>
            )}
            {error && !passwordDifferent && (
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