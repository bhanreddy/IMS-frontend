import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../types/models';
import { UserSchema } from '../types/schemas';
import { logError } from '../utils/error';

export function listenAuth(
    onChange: (user: User | null) => void
) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (!fbUser) {
            onChange(null);
            return;
        }

        try {
            const snap = await getDoc(doc(db, 'users', fbUser.uid));
            if (!snap.exists()) {
                console.warn('User authenticated but no profile found in Firestore');
                onChange(null);
                return;
            }

            const rawData = { uid: fbUser.uid, ...snap.data() };

            // Validation (Safe Parse)
            const result = UserSchema.safeParse(rawData);
            if (!result.success) {
                logError('AuthService:SchemaValidation', result.error);
                // Fall-Safe: return data even if slightly malformed to prevent lockout, 
                // but logged for investigation.
                onChange(rawData as User);
            } else {
                onChange(result.data as User);
            }

        } catch (error) {
            logError('AuthService:ProfileFetch', error);
            onChange(null);
        }
    });
}

const AuthService = {
    login: async (email: string, pass: string, schoolId?: string): Promise<{ user: User }> => {
        try {
            const result = await import('firebase/auth').then(m => m.signInWithEmailAndPassword(auth, email, pass));
            // Fetch profile for role-based redirect
            const snap = await getDoc(doc(db, 'users', result.user.uid));
            if (snap.exists()) {
                const userData = { uid: result.user.uid, ...snap.data() } as User;
                return { user: userData };
            }
            // Fallback for users without a profile document
            return {
                user: {
                    uid: result.user.uid,
                    role: 'student',
                    name: 'Guest User'
                } as User
            };
        } catch (e) {
            logError('AuthService:Login', e);
            throw e;
        }
    },
    logout: () => signOut(auth),
    listenAuth
};

export default AuthService;
