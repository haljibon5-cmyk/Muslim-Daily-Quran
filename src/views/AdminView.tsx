import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Trash2, XCircle, Search, Power } from 'lucide-react';
import { motion } from 'motion/react';
import { Tab } from '../App';
import { collection, query, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AdminViewProps {
    onBack: () => void;
}

export default function AdminView({ onBack }: AdminViewProps) {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'users'));
            const snap = await getDocs(q);
            const userList: any[] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // sort so premium users are at the top
            userList.sort((a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0));
            setUsers(userList);
        } catch (error) {
            console.error("Error fetching users:", error);
            // Ignore alert to avoid iframe modal limits
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const togglePremium = async (userId: string, currentState: boolean) => {
        try {
            await setDoc(doc(db, 'users', userId), {
                isPremium: !currentState,
                // if granting via admin, give them 365 days
                premiumUntil: !currentState ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null
            }, { merge: true });
            
            // Re-fetch users instantly
            fetchUsers();
            // Try to show basic notification, skip confirm
        } catch (err) {
            console.error("Failed to update user:", err);
        }
    };

    const confirmDelete = async (userId: string) => {
        setDeleteConfirmId(userId);
    };

    const executeDelete = async (userId: string) => {
        try {
            const { auth } = await import('../lib/firebase');
            if (auth.currentUser) {
                const token = await auth.currentUser.getIdToken();
                // Send request to backend to delete from Auth
                const authRes = await fetch(`/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await authRes.json();
                if (!authRes.ok) {
                    console.error("Auth delete error:", data.error);
                    alert("Firebase Auth Delete Failed: " + data.error + "\n\nTo fix this: Please add a Firebase Service Account key. Go to Project Settings -> Service Accounts -> Generate new private key in Firebase, then paste the full JSON into 'FIREBASE_SERVICE_ACCOUNT_KEY' in your AI Studio settings.");
                    setDeleteConfirmId(null);
                    return; // Stop here if Auth fails
                }
            }

            // Wipe user data and ban them from Firestore
            const { setDoc, doc } = await import('firebase/firestore');
            await setDoc(doc(db, 'users', userId), {
                isBanned: true,
                displayName: "Deleted User",
                email: "deleted@user.local",
                photoURL: "",
                isPremium: false,
                premiumUntil: null
            }); 
            
            alert("User deleted from both Firebase Auth and Database!");
            setDeleteConfirmId(null);
            fetchUsers();
        } catch (err: any) {
            console.error("Failed to delete user:", err);
            alert("Failed to delete: " + err.message);
            setDeleteConfirmId(null);
        }
    };

    const filteredUsers = users.filter(u => 
        !u.isBanned && (
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="flex flex-col h-full bg-header-bg relative text-white pb-24 overflow-y-auto no-scrollbar">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none"></div>
            
            <div className="pt-12 pb-6 px-6 relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-red-500/20 border border-red-500/40 rounded-3xl flex items-center justify-center shadow-lg mb-4 backdrop-blur-sm">
                    <ShieldAlert className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-2xl font-bold font-serif italic text-center mb-2">
                    Admin Panel
                </h1>
                <p className="text-white/80 text-center text-xs px-4">Manage users and revoke fake payments.</p>
                
                <button onClick={onBack} className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition">
                    Exit Admin Panel
                </button>
            </div>

            <div className="p-6 relative z-10 flex flex-col gap-4">
                <div className="bg-bg-panel p-4 rounded-2xl flex items-center gap-3">
                    <Search className="w-5 h-5 text-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Search by email or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                         className="bg-transparent border-none outline-none w-full text-text-main placeholder-text-muted text-sm"
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredUsers.length === 0 && (
                            <p className="text-center text-white/50 text-sm mt-4">No users found.</p>
                        )}
                        {filteredUsers.map(u => (
                            <div key={u.id} className="bg-bg-panel border border-border-main p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-text-main shadow-sm">
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">{u.displayName || "Anonymous"}</span>
                                    <span className="text-xs text-text-muted">{u.email}</span>
                                    {u.isPremium ? (
                                        <span className="mt-1 text-[10px] uppercase font-bold tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-sm self-start">Premium Active</span>
                                    ) : (
                                        <span className="mt-1 text-[10px] uppercase font-bold tracking-wider text-text-muted bg-border-main px-2 py-0.5 rounded-sm self-start">Free User</span>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                                    <button 
                                        onClick={() => togglePremium(u.id, !!u.isPremium)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                                            u.isPremium 
                                                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                        }`}
                                    >
                                        {u.isPremium ? (
                                            <><ShieldAlert className="w-4 h-4" /> Revoke</>
                                        ) : (
                                            <><Power className="w-4 h-4" /> Grant Premium</>
                                        )}
                                    </button>
                                        {deleteConfirmId === u.id ? (
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => executeDelete(u.id)}
                                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center gap-1 w-full sm:w-auto"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Sure?
                                                </button>
                                                <button 
                                                    onClick={() => setDeleteConfirmId(null)}
                                                    className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center w-full sm:w-auto"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => confirmDelete(u.id)}
                                                className="px-4 py-2 rounded-xl text-xs font-bold bg-border-main text-red-500 hover:bg-red-500/20 transition flex items-center justify-center gap-2 w-full sm:w-auto"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
