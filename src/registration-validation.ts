import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase-config';

export async function validateRegistration(
    username: string,
    password: string,
    confirmPassword: string,
): Promise<string | null> {
    const usernameCheck = await getDoc(doc(db, "usernames", username))
    const RegEx = /^[a-zA-Z0-9]+$/;

    if (password !== confirmPassword) return 'Passwords do not match.';
    if (usernameCheck.exists()) return 'Username is unavailable.';
    if (username.length < 3 || username.length > 20) return 'Username must be between 3 and 20 characters.';
    if (!RegEx.test(username)) return 'Username can only contain alphanumeric characters.';
    return null;
}