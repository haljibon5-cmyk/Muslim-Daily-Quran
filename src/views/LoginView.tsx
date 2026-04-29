import React, { useState } from 'react';
import { Moon, Mail, Lock, User as UserIcon, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { signInWithGoogle, auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginView({ isDarkMode, onGuest }: { isDarkMode: boolean, onGuest: () => void }) {
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const handleError = (error: any) => {
        console.error("Auth error:", error);
        if (error.code === 'auth/operation-not-allowed') {
            setAuthError('Email/Password login is currently disabled in Firebase Console. Please enable it in Authentication > Sign-in method.');
        } else if (error.code === 'auth/email-already-in-use') {
            setAuthError('This email is already in use. Please log in instead.');
        } else if (error.code === 'auth/weak-password') {
            setAuthError('Password is too weak. Please use at least 6 characters.');
        } else if (error.code === 'auth/invalid-credential') {
            setAuthError('Invalid email or password.');
        } else {
            setAuthError(error.message || 'An unknown error occurred.');
        }
    };

    const handleGoogle = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            alert("গুগল লগইন ব্যর্থ হয়েছে (Google Login Failed).");
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        setLoading(true);
        sessionStorage.setItem('isLoggingIn', 'true');
        try {
            if (mode === 'signup') {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                if (cred.user) {
                    await updateProfile(cred.user, { displayName: name });
                    try {
                        const userRef = doc(db, 'users', cred.user.uid);
                        await setDoc(userRef, {
                            email: cred.user.email,
                            displayName: name,
                            createdAt: new Date().toISOString()
                        }, { merge: true });
                    } catch (err) {
                        console.error("Error setting firestore doc", err);
                    }
                }
            } else if (mode === 'login') {
                const cred = await signInWithEmailAndPassword(auth, email, password);
                if (cred.user) {
                    try {
                        const userRef = doc(db, 'users', cred.user.uid);
                        await setDoc(userRef, {
                            email: cred.user.email,
                            displayName: cred.user.displayName || email,
                        }, { merge: true });
                    } catch (err) {
                         console.error("Error setting firestore doc", err);
                    }
                }
            } else if (mode === 'forgot') {
                await sendPasswordResetEmail(auth, email);
                alert("পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে (Password reset email sent)!");
                setMode('login');
            }
        } catch (error: any) {
            handleError(error);
        } finally {
            sessionStorage.removeItem('isLoggingIn');
        }
        setLoading(false);
    };

    return (
        <div className={cn("flex flex-col items-center justify-center h-[100dvh] w-full relative overflow-y-auto", isDarkMode ? "bg-bg-base" : "bg-header-bg")}>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 flex flex-col items-center bg-black/20 backdrop-blur-md p-6 sm:p-8 rounded-[40px] border border-white/10 shadow-2xl w-[90%] max-w-sm text-center my-8"
            >
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4 border border-accent/30 shadow-inner">
                    <Moon className="w-8 h-8 text-accent" />
                </div>
                
                <h1 className="text-2xl font-serif text-white font-bold italic mb-1">Muslim Daily Quran</h1>
                <p className="text-white/70 text-xs mb-6 px-4 leading-relaxed">
                    আপনার অগ্রগতি এবং নামাজ-কুরআনের রুটিন সেভ রাখুন।
                </p>

                <AnimatePresence mode="wait">
                    <motion.form 
                        key={mode}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleEmailAuth}
                        className="w-full space-y-4"
                    >
                        {authError && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-100 text-xs p-3 rounded-xl text-left mb-4">
                                {authError}
                            </div>
                        )}

                        {mode === 'signup' && (
                            <div className="relative">
                                <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                                <input required type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/30 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-white/30" />
                            </div>
                        )}
                        
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                            <input required type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/30 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-white/30" />
                        </div>

                        {mode !== 'forgot' && (
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                                <input required type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/30 border border-white/20 rounded-xl py-3 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-white/30" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        )}

                        {mode === 'login' && (
                            <div className="text-right">
                                <button type="button" onClick={() => { setMode('forgot'); setAuthError(null); }} className="text-[10px] text-accent hover:underline">Forgot password?</button>
                            </div>
                        )}

                        <button 
                            disabled={loading}
                            type="submit"
                            className="w-full bg-accent text-bg-base py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-accent/90 transition-colors active:scale-95 text-sm disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </motion.form>
                </AnimatePresence>

                <div className="w-full flex items-center justify-between my-5">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-[10px] text-white/50 px-3 uppercase tracking-widest">Or</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>

                <div className="w-full space-y-3">
                    <button 
                        type="button"
                        onClick={handleGoogle}
                        className="w-full bg-white text-header-bg py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-md hover:bg-gray-100 transition-colors active:scale-95 text-sm"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <button 
                        type="button"
                        onClick={onGuest}
                        className="w-full bg-black/30 border border-white/10 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-black/40 transition-colors active:scale-95 text-sm"
                    >
                        Continue as Guest
                    </button>
                </div>
                
                <div className="mt-6 text-xs text-white/60 flex gap-1">
                    {mode === 'login' ? (
                        <>Don't have an account? <button onClick={() => { setMode('signup'); setAuthError(null); }} className="text-accent hover:underline font-bold">Sign up</button></>
                    ) : (
                        <><button onClick={() => { setMode('login'); setAuthError(null); }} className="text-accent hover:underline font-bold flex items-center gap-1"><ArrowLeft className="w-3 h-3"/> Back to login</button></>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
