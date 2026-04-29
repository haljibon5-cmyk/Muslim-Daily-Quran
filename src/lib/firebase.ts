import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        sessionStorage.setItem('isLoggingIn', 'true');
        const result = await signInWithPopup(auth, googleProvider);
        // Ensure user doc exists
        const userRef = doc(db, 'users', result.user.uid);
        await setDoc(userRef, {
            email: result.user.email,
            displayName: result.user.displayName,
            createdAt: new Date()
        }, { merge: true });
        
        sessionStorage.removeItem('isLoggingIn');
        return result.user;
    } catch (error) {
        sessionStorage.removeItem('isLoggingIn');
        console.error("Error signing in with Google", error);
        throw error;
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
        throw error;
    }
};
