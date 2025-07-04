import { useState, useEffect } from "react";
import { auth } from "@/config/firebase-config";
import { onAuthStateChanged, User } from "firebase/auth";

export function useFirebaseUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return user;
}