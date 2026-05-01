import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, BookOpen, Compass, Settings, AlertCircle, Moon, Sun, LayoutDashboard, LogOut, User as UserIcon, Bell, BellOff, Crown, ShieldAlert, ArrowLeft } from 'lucide-react';
import { cn } from './lib/utils';
import { motion } from 'motion/react';
import PrayerTimesView from './views/PrayerTimesView';
import QuranView from './views/QuranView';
import QiblaView from './views/QiblaView';
import HomeView from './views/HomeView';
import TasbihView from './views/TasbihView';
import HadithView from './views/HadithView';
import ZakatView from './views/ZakatView';
import HistoryView from './views/HistoryView';
import DuaView from './views/DuaView';
import EventsView from './views/EventsView';
import CalendarView from './views/CalendarView';
import NamesView from './views/NamesView';
import RamadanView from './views/RamadanView';
import BookmarksView from './views/BookmarksView';
import LoginView from './views/LoginView';
import NotificationsView from './views/NotificationsView';
import NotFoundView from './views/NotFoundView';
import { auth, db, logOut } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { usePrayerNotifications } from './hooks/useAzan';

import SubscriptionView from './views/SubscriptionView';
import AdminView from './views/AdminView';
import AdBanner from './components/AdBanner';

export const MosqueIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "w-full h-full"}>
    {/* Base Mosque Shape */}
    <g fill="currentColor">
      {/* Minarets */}
      <rect x="12" y="14" width="4" height="24" rx="1" />
      <polygon points="14,4 17,14 11,14" />
      
      <rect x="42" y="14" width="4" height="18" rx="1" />
      <polygon points="44,4 47,14 41,14" />
      
      {/* Main Dome */}
      <path d="M18 36 C 18 18, 40 18, 40 36 Z" />
      
      {/* Spire */}
      <rect x="28" y="10" width="2" height="8" />
      <path d="M29 6 C31 6, 32 8, 30 10 C32 9, 31 7, 29 6 Z" />

      {/* Building Base */}
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M8 36 h 42 v 22 h -42 Z 
           M24 58 v -10 a 5 5 0 0 1 10 0 v 10 Z 
           M12 44 a 2 2 0 0 1 4 0 v 6 a 2 2 0 0 1 -4 0 Z 
           M18 44 a 2 2 0 0 1 4 0 v 6 a 2 2 0 0 1 -4 0 Z" 
      />
    </g>

    {/* Green Clock Overlaid */}
    <g transform="translate(44, 42)">
      {/* Clock Background */}
      {/* Adding a cutout effect behind the clock by drawing a stroke matching background if needed, but since we can't easily query background color here without more context, we'll just draw the green circle */}
      <circle cx="0" cy="0" r="16" fill="#4ade80" />
      
      {/* Tick Marks */}
      <path d="M0 -12 L0 -10 M0 12 L0 10 M-12 0 L-10 0 M12 0 L10 0" stroke="#111" strokeWidth="2" strokeLinecap="round" />
      
      {/* Hands */}
      {/* Hour hand (points ~10 o'clock) */}
      <line x1="0" y1="0" x2="-5" y2="-5" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
      {/* Minute hand (points ~2 o'clock) */}
      <line x1="0" y1="0" x2="6" y2="-4" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Center dot */}
      <circle cx="0" cy="0" r="2" fill="#111" />
    </g>
  </svg>
)

const QiblaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Outer circle with ticks */}
    <circle cx="12" cy="12" r="9" opacity="0.6" />
    <line x1="12" y1="2" x2="12" y2="4" opacity="0.6" />
    <line x1="12" y1="20" x2="12" y2="22" opacity="0.6" />
    <line x1="2" y1="12" x2="4" y2="12" opacity="0.6" />
    <line x1="20" y1="12" x2="22" y2="12" opacity="0.6" />
    
    {/* Blue Pin/Indicator */}
    <path d="M12 1 C13.5 1 14.5 2.5 14.5 4 C14.5 6 12 8 12 8 C12 8 9.5 6 9.5 4 C9.5 2.5 10.5 1 12 1 Z" fill="#3B82F6" stroke="none" />
    
    {/* Kaaba Top Face */}
    <path d="M12 9 L16.5 10.5 L12 12 L7.5 10.5 Z" fill="#FCD34D" stroke="currentColor" strokeWidth="0.5" />
    
    {/* Kaaba Left Face */}
    <path d="M7.5 10.5 L12 12 L12 17 L7.5 15.5 Z" fill="currentColor" stroke="none" />
    
    {/* Kaaba Right Face */}
    <path d="M12 12 L16.5 10.5 L16.5 15.5 L12 17 Z" fill="currentColor" stroke="none" />
    
    {/* Gold Band Left */}
    <path d="M7.5 12 L12 13.5 L12 14.5 L7.5 13 Z" fill="#FCD34D" stroke="none" />
    
    {/* Gold Band Right */}
    <path d="M12 13.5 L16.5 12 L16.5 13 L12 14.5 Z" fill="#FCD34D" stroke="none" />

    {/* Door */}
    <path d="M13.5 15 L14.5 14.5 L14.5 16 Z" fill="black" opacity="0.5" stroke="none" />
  </svg>
)

export const QuranIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "w-full h-full"}>
    {/* Stand - Back Legs */}
    <path d="M22 65 L15 85 Q 14 88 18 88 L25 82 L48 66 Z" fill="#4a2610"/>
    <path d="M78 65 L85 85 Q 86 88 82 88 L75 82 L52 66 Z" fill="#4a2610"/>
    
    {/* Stand - Front Legs */}
    <path d="M38 65 Q 25 72 16 80 Q 14 82 17 84 Q 25 81 32 75 L52 63 Z" fill="#5c331a"/>
    <path d="M62 65 Q 75 72 84 80 Q 86 82 83 84 Q 75 81 68 75 L48 63 Z" fill="#5c331a"/>

    {/* Book Cover (Dark Red Edge) */}
    <path d="M50 78 L12 60 L14 38 L50 48 L86 38 L88 60 Z" fill="#4d1b1b"/>
    
    {/* Page Bottom Edge (Gold/Brown pages stack) */}
    <path d="M50 78 L12 60 L14 55 L50 73 L86 55 L88 60 Z" fill="#d1bd9d"/>
    <path d="M50 73 L14 55 L16 50 L50 68 L84 50 L86 55 Z" fill="#e8dccb"/>
    
    {/* Main Pages */}
    <path d="M50 70 L14 52 L22 25 L50 40 Z" fill="#fcf3da"/>
    <path d="M50 70 L86 52 L78 25 L50 40 Z" fill="#fcf3da"/>
    
    {/* Inner Deco Border */}
    <path d="M48 64 L22 50 L27 30 L48 44 Z" stroke="#8a6136" strokeWidth="2" fill="none"/>
    <path d="M52 64 L78 50 L73 30 L52 44 Z" stroke="#8a6136" strokeWidth="2" fill="none"/>
    <path d="M46 62 L24 49 L29 32 L46 42 Z" stroke="#8a6136" strokeWidth="0.5" fill="none"/>
    <path d="M54 62 L76 49 L71 32 L54 42 Z" stroke="#8a6136" strokeWidth="0.5" fill="none"/>

    {/* Medallions */}
    <circle cx="35" cy="46" r="4" fill="#a47b4d" stroke="#6e502c" strokeWidth="0.5" />
    <circle cx="35" cy="46" r="2.5" fill="#fcf3da" />
    <path d="M34 46 Q35 45 36 46 T 35 47" stroke="#6e502c" strokeWidth="0.5" fill="none" />
    
    <circle cx="65" cy="46" r="4" fill="#a47b4d" stroke="#6e502c" strokeWidth="0.5" />
    <circle cx="65" cy="46" r="2.5" fill="#fcf3da" />
    <path d="M64 46 Q65 45 66 46 T 65 47" stroke="#6e502c" strokeWidth="0.5" fill="none" />

    {/* Text Blocks Left */}
    <path d="M28 35 Q30 36 33 35 T38 36" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M27 39 Q29 40 32 39 T37 40 T44 42" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M26 43 Q28 44 31 43" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M40 44 Q42 45 45 46" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M25 47 Q27 48 30 47" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M40 48 Q42 49 45 50" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M24 51 Q26 52 29 51 T34 52 T45 54" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M25 55 Q27 56 30 55 T35 56 T44 58" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    
    {/* Text Blocks Right */}
    <path d="M72 35 Q70 36 67 35 T62 36" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M73 39 Q71 40 68 39 T63 40 T56 42" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M74 43 Q72 44 69 43" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M60 44 Q58 45 55 46" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M75 47 Q73 48 70 47" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M60 48 Q58 49 55 50" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M76 51 Q74 52 71 51 T66 52 T55 54" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M75 55 Q73 56 70 55 T65 56 T56 58" stroke="#8a6b4e" strokeWidth="0.8" strokeLinecap="round"/>
    
    {/* Center crease (spine) */}
    <path d="M50 40 L50 71" stroke="#e0d4c3" strokeWidth="2" />
    <path d="M50 40 L50 71" stroke="#b0a28f" strokeWidth="1" strokeDasharray="2 2" />

    {/* Red Tasbih Beads Draping */}
    <g>
      {/* Right side drape */}
      <circle cx="88" cy="40" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="86" cy="38" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="83" cy="37" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="80" cy="38" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="77" cy="40" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="74" cy="42" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="71" cy="45" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="68" cy="48" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="65" cy="51" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="61" cy="53" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="58" cy="55" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="54" cy="54" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      
      {/* Up top crease */}
      <circle cx="52" cy="50" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="53" cy="46" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="54" cy="42" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="55" cy="38" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="55" cy="33" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="53" cy="29" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      
      {/* Down left crease */}
      <circle cx="50" cy="28" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="47" cy="31" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="45" cy="35" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="44" cy="40" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="43" cy="45" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="41" cy="49" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      
      {/* Left side curve */}
      <circle cx="38" cy="52" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="34" cy="53" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="31" cy="56" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="31" cy="61" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="32" cy="65" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="34" cy="69" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="36" cy="73" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      <circle cx="38" cy="77" r="2.5" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>

      {/* Tassel handle base */}
      <path d="M 37 80 L 39 80 L 39 88 L 37 88 Z" fill="#a82b2b" stroke="#6e1919" strokeWidth="0.5"/>
      
      {/* Tassel tails */}
      <path d="M 38 88 Q 35 93 30 92" stroke="#a82b2b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 38 88 Q 38 93 38 94" stroke="#a82b2b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 38 88 Q 42 93 45 92" stroke="#a82b2b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      
      <circle cx="30" cy="92" r="1.5" fill="#a82b2b" />
      <circle cx="38" cy="94" r="1.5" fill="#a82b2b" />
      <circle cx="45" cy="92" r="1.5" fill="#a82b2b" />
    </g>

  </svg>
);

export const BookmarksIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "w-full h-full"}>
    {/* Crescent & Spire */}
    <path d="M47 16 A5 5 0 1 1 54 10 A6 6 0 0 0 47 16 Z" fill="#c3a976" />
    <path d="M50 17 L50 28" stroke="#c3a976" strokeWidth="2" />
    <path d="M42 30 Q50 26 58 30 Q50 28 42 30 Z" fill="#c3a976" />
    
    {/* Dome Arch */}
    <path d="M20 72 A 32 32 0 0 1 80 72" stroke="#2a455a" strokeWidth="8" strokeLinecap="round" />
    
    {/* Feather Pen */}
    <path d="M80 32 Q60 55 46 72 Q52 70 58 60 Q65 65 80 32 Z" fill="#2a455a"/>
    <path d="M80 32 Q70 30 60 45 Q50 55 46 72 Q50 55 80 32 Z" fill="#2a455a"/>
    {/* Slashes on feather */}
    <line x1="46" y1="72" x2="80" y2="32" stroke="#ffffff" strokeWidth="1.5" />
    <line x1="60" y1="56" x2="68" y2="52" stroke="#ffffff" strokeWidth="1.5" />
    <line x1="66" y1="48" x2="74" y2="44" stroke="#ffffff" strokeWidth="1.5" />
    
    {/* Pen Tip */}
    <path d="M46 72 L42 76 L48 72 Z" fill="#2a455a" />
    
    {/* Book Base (Gold) */}
    <path d="M12 78 Q32.5 70 50 82 Q67.5 70 88 78 L85 82 Q67.5 74 50 86 Q32.5 74 15 82 Z" fill="#c3a976" />
    
    {/* Open Book Shadow / Bottom line */}
    <path d="M8 86 Q32.5 78 50 90 Q67.5 78 92 86" stroke="#2a455a" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export type Tab = 'home' | 'quran' | 'prayer' | 'qibla' | 'tasbih' | 'hadith' | 'zakat' | 'history' | 'settings' | 'notifications' | 'subscription' | 'admin' | 'dua' | 'events' | 'calendar' | 'names' | 'ramadan' | 'bookmarks' | '404';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const path = window.location.pathname;
    if (path !== '/' && path !== '/index.html') {
      return '404';
    }
    return (sessionStorage.getItem('activeTab') as Tab) || 'home';
  });
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  
  useEffect(() => {
    sessionStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('splashShown'));
  const [showAd, setShowAd] = useState(false);
  const [showAppOpenAd, setShowAppOpenAd] = useState(false);
  const [azanEnabled, setAzanEnabled] = useState(() => localStorage.getItem('azanEnabled') === 'true');
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('isGuest') === 'true');

  const handleSetGuest = (val: boolean) => {
      setIsGuest(val);
      localStorage.setItem('isGuest', String(val));
  };

  // Azan Notifications
  const [isPremium, setIsPremium] = useState(() => localStorage.getItem('isPremium') === 'true');

  const { testAzan, isAzanPlaying, stopAzan, notifications, clearNotifications } = usePrayerNotifications(location, azanEnabled);

  const toggleAzan = () => {
    const newState = !azanEnabled;
    setAzanEnabled(newState);
    localStorage.setItem('azanEnabled', String(newState));
    if (newState) {
      if ("Notification" in window) {
        Notification.requestPermission();
      }
    }
  };

  const handleSubscribe = (days: number) => {
     setIsPremium(true);
     localStorage.setItem('isPremium', 'true');
     // Automatically hide ads if they were about to be triggered
     // In a real app, you would verify payment via backend
     alert(`Successfully subscribed for ${days} days! No more ads.`);
  };

  useEffect(() => {
    // Apply saved language automatically
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang && savedLang !== 'en') {
      const applyLanguage = (attempt = 1) => {
        const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (combo && typeof combo.options !== 'undefined' && combo.options.length > 0) {
          combo.value = savedLang;
          combo.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        } else if (attempt < 10) {
          // If widget hasn't loaded fully yet, check again soon
          setTimeout(() => applyLanguage(attempt + 1), 500);
        } else {
          console.warn("Failed to apply google translate language automatically");
        }
      };
      setTimeout(applyLanguage, 1000);
    }

    let unsubscribeSnapshot: () => void;
    
    // First, always handle simple canceled logic immediately
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('canceled') === 'true') {
        alert('Payment unsuccessful! Your premium service has not been activated.');
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsGuest(false); // Clear guest status if logged in
        
        // Handle pending payment success URL natively in logged-in user
        if (urlParams.get('success') === 'true') {
           const days = parseInt(urlParams.get('days') || '30', 10);
           const premiumUntil = new Date();
           premiumUntil.setDate(premiumUntil.getDate() + days);
           
           try {
             await setDoc(doc(db, 'users', currentUser.uid), {
                isPremium: true,
                premiumUntil: premiumUntil.toISOString()
             }, { merge: true });
             
             alert('Payment successful! Your premium is now active.');
           } catch (err) {
             console.error("Error setting premium status:", err);
           }
           window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Listen for realtime premium status changes (so Admin can revoke it instantly!)
        unsubscribeSnapshot = onSnapshot(doc(db, 'users', currentUser.uid), async (docSnap) => {
           if (docSnap.exists()) {
             const data = docSnap.data();
             
             if (data.isBanned) {
                 const { signOut } = await import('firebase/auth');
                 await signOut(auth);
                 alert("Your account has been banned/deleted by the admin.");
                 return;
             }

             const isPremiumNow = !!data.isPremium;
             
             // Check if premium expired
             if (isPremiumNow && data.premiumUntil) {
                if (new Date(data.premiumUntil) < new Date()) {
                   setIsPremium(false);
                   localStorage.setItem('isPremium', 'false');
                   return;
                }
             }

             setIsPremium(isPremiumNow);
             localStorage.setItem('isPremium', String(isPremiumNow));
           } else {
             // Admin deleted the user or account doesn't exist
             if (!sessionStorage.getItem('isLoggingIn')) {
                 const { signOut } = await import('firebase/auth');
                 await signOut(auth);
             }
           }
        }, (error) => {
           console.error("onSnapshot permission error:", error);
           // Silent catch for permissions
        });
      } else {
        // Logged out
        setIsPremium(false);
        localStorage.setItem('isPremium', 'false');
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
      setIsAuthChecking(false);
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // Apply dark mode reliably
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Initial theme setup
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
       setIsDarkMode(false);
    }
    
    // Splash screen timer
    if (showSplash) {
      const timer = setTimeout(() => {
         setShowSplash(false);
         setShowAppOpenAd(true);
         sessionStorage.setItem('splashShown', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });

          try {
             const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`, {
                 headers: {
                     'Accept-Language': 'en'
                 }
             });
             const data = await res.json();
             if (data && data.address) {
                 const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
                 const country = data.address.country || '';
                 if (city) {
                     setLocationName(`${city}, ${country}`.replace(/(^, |, $)/g, ''));
                 } else {
                     setLocationName(country || 'Location Active');
                 }
             }
          } catch (e) {
             console.error('Reverse geocoding failed', e);
          }
        },
        (error) => {
          setLocError("Please enable location permissions to get accurate prayer times.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocError("Geolocation is not supported by your browser.");
    }
  }, []);

  const isAdmin = user?.email === 'rahelk3625@gmail.com';
  const effectiveIsPremium = isPremium || isAdmin;

  useEffect(() => {
    if (!effectiveIsPremium) {
      // Vignette
      const scriptVignette = document.createElement('script');
      scriptVignette.dataset.zone = '10949803';
      scriptVignette.src = 'https://n6wxm.com/vignette.min.js';
      scriptVignette.id = 'monetag-vignette';
      document.body.appendChild(scriptVignette);

      // In-Page Push
      const scriptPush = document.createElement('script');
      scriptPush.dataset.zone = '10949811';
      scriptPush.src = 'https://nap5k.com/tag.min.js';
      scriptPush.id = 'monetag-push';
      document.body.appendChild(scriptPush);

      return () => {
        const existingVignette = document.getElementById('monetag-vignette');
        if (existingVignette) {
          existingVignette.remove();
        }
        const existingPush = document.getElementById('monetag-push');
        if (existingPush) {
          existingPush.remove();
        }
      };
    }
  }, [effectiveIsPremium]);

  const handleNavigate = (tab: Tab) => {
    if (tab !== activeTab) {
      if (!effectiveIsPremium && tab !== 'subscription') {
         setShowAd(true);
         setTimeout(() => setShowAd(false), 2000); // Auto hide after 2s for simulation
      }
      setActiveTab(tab);
    }
  };

  const handleSignOut = async () => {
    if (isGuest) {
      handleSetGuest(false);
    } else {
      await logOut();
    }
    setActiveTab('home');
  };

  if (showSplash || isAuthChecking) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-[100dvh] w-full relative max-w-md mx-auto shadow-2xl overflow-hidden", isDarkMode ? "bg-bg-base" : "bg-header-bg")}>
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none"></div>
         <Moon className="w-20 h-20 text-accent mb-6 animate-pulse" />
         <h1 className="text-3xl font-serif text-white font-bold italic z-10 text-center px-4">Muslim Daily Quran</h1>
         <p className="text-white/80 mt-4 px-8 text-center text-sm z-10">Dive into your faith with every click. Explore, learn, and connect on a journey through Islam's beauty.</p>
      </div>
    );
  }

  // Require Login OR Guest
  if (!user && !isGuest) {
    return <LoginView isDarkMode={isDarkMode} onGuest={() => handleSetGuest(true)} />;
  }

  return (
    <div className={cn("flex flex-col h-[100dvh] overflow-hidden font-sans max-w-md mx-auto relative shadow-2xl transition-colors duration-300", "bg-bg-base text-text-main")}>
      
      {/* Main Content Area */}
      <main className={cn("flex-1 overflow-y-auto no-scrollbar relative w-full h-full", effectiveIsPremium ? "pb-20" : "pb-[122px]")}>
        {activeTab === 'home' && <HomeView location={location} locationName={locationName} onNavigate={handleNavigate} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} user={user} isGuest={isGuest} isPremium={isPremium} />}
        {activeTab === 'prayer' && <PrayerTimesView location={location} locationName={locationName} locError={locError} onNavigate={handleNavigate} onBack={() => setActiveTab('home')} />}
        {activeTab === 'quran' && <QuranView onBack={() => setActiveTab('home')} />}
        {activeTab === 'qibla' && <QiblaView location={location} onBack={() => setActiveTab('home')} />}
        {activeTab === 'tasbih' && <TasbihView onBack={() => setActiveTab('home')} />}
        {activeTab === 'hadith' && <HadithView onBack={() => setActiveTab('home')} />}
        {activeTab === 'zakat' && <ZakatView onBack={() => setActiveTab('home')} />}
        {activeTab === 'history' && <HistoryView onNavigate={handleNavigate} isGuest={isGuest} user={user} onBack={() => setActiveTab('home')} />}
        {activeTab === 'dua' && <DuaView onBack={() => setActiveTab('home')} />}
        {activeTab === 'events' && <EventsView onBack={() => setActiveTab('home')} />}
        {activeTab === 'calendar' && <CalendarView onBack={() => setActiveTab('home')} />}
        {activeTab === 'names' && <NamesView onBack={() => setActiveTab('home')} />}
        {activeTab === 'ramadan' && <RamadanView onBack={() => setActiveTab('home')} location={location} locationName={locationName} />}
        {activeTab === 'bookmarks' && (
             <BookmarksView 
                  onBack={() => setActiveTab('home')} 
                  onNavigateToQuran={() => setActiveTab('quran')}
                  onNavigateToHadith={() => setActiveTab('hadith')}
             />
        )}
        {activeTab === '404' && <NotFoundView onNavigateHome={() => {
            window.history.replaceState({}, document.title, '/');
            handleNavigate('home');
        }} />}
        {activeTab === 'admin' && isAdmin && <AdminView onBack={() => setActiveTab('home')} />}
        {activeTab === 'notifications' && (
           <NotificationsView 
               notifications={notifications} 
               clearNotifications={clearNotifications} 
               isAzanPlaying={isAzanPlaying} 
               stopAzan={stopAzan} 
               onBack={() => setActiveTab('home')}
           />
        )}
        {activeTab === 'subscription' && (
           <SubscriptionView 
               isPremium={isPremium} 
               onSubscribe={handleSubscribe} 
               onBack={setActiveTab} 
           />
        )}
        {activeTab === 'settings' && (
           <div className="p-6 flex flex-col items-center justify-start max-h-full overflow-y-auto no-scrollbar space-y-6 text-text-main pt-6 pb-24 relative">
             <button onClick={() => setActiveTab('home')} className="absolute left-6 top-6 p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                 <ArrowLeft className="w-6 h-6" />
             </button>
             <div className="w-24 h-24 rounded-full overflow-hidden bg-bg-panel border-4 border-border-main mb-2 shadow-lg flex items-center justify-center mt-8">
                {user?.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : <UserIcon className="w-12 h-12 text-text-muted" />}
             </div>
             <div className="text-center">
                <h2 className="text-xl font-bold">{isGuest ? 'Guest User' : (user?.displayName || 'Muslim User')}</h2>
                <p className="text-sm text-text-muted">{isGuest ? 'Not signed in' : user?.email}</p>
             </div>
             
             <div className="w-full h-px bg-border-main my-2"></div>

             <div className="w-full flex flex-col space-y-4">
                 {isAdmin && (
                   <button 
                       onClick={() => handleNavigate('admin')}
                       className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-2xl shadow-sm text-red-500 transition hover:bg-red-500/20"
                   >
                       <div className="flex items-center gap-3">
                           <div className="bg-red-500/20 p-2 rounded-xl text-red-500">
                               <ShieldAlert className="w-5 h-5" />
                           </div>
                           <div className="text-left">
                               <p className="font-bold text-sm">Admin Panel</p>
                               <p className="text-xs">Manage Users & Payments</p>
                           </div>
                       </div>
                   </button>
                 )}

                 <button 
                     onClick={() => handleNavigate('subscription')}
                     className="flex items-center justify-between p-4 bg-accent/10 border border-accent/30 rounded-2xl shadow-sm text-accent transition hover:bg-accent/20"
                 >
                     <div className="flex items-center gap-3">
                         <div className="bg-accent/20 p-2 rounded-xl text-accent">
                             <Crown className="w-5 h-5" />
                         </div>
                         <div className="text-left">
                             <p className="font-bold text-sm">Premium</p>
                             <p className="text-xs">{isPremium ? 'Active' : 'Remove Ads & Unlock All'}</p>
                         </div>
                     </div>
                 </button>

                  <div className="flex items-center justify-between p-4 bg-bg-panel rounded-2xl border border-border-main shadow-sm mb-4">
                     <div className="flex items-center gap-3">
                         <div className="bg-accent/10 p-2 rounded-xl text-accent">
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                 <circle cx="12" cy="12" r="10" />
                                 <path d="M2 12h20" />
                                 <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                             </svg>
                         </div>
                         <div className="text-left">
                             <p className="font-bold text-sm">Language</p>
                             <p className="text-xs text-text-muted">App display language</p>
                         </div>
                     </div>
                     <select 
                         className="bg-transparent border border-border-main text-text-main text-sm rounded-lg focus:ring-accent focus:border-accent block p-2 max-w-[140px] truncate"
                         defaultValue={localStorage.getItem('app_lang') || 'en'}
                         onChange={(e) => {
                             const newLang = e.target.value;
                             localStorage.setItem('app_lang', newLang);
                             
                             const changeLang = (attempt = 1) => {
                                 const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                                 if (combo && typeof combo.options !== 'undefined') {
                                     combo.value = newLang;
                                     combo.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                                 } else {
                                     // Fallback if widget not ready
                                     if (attempt < 5) {
                                         setTimeout(() => changeLang(attempt + 1), 500);
                                     } else {
                                         console.warn('Google Translate combo not found.');
                                         // Set cookie just in case it takes effect later or on next natural reload
                                         if (newLang === 'en') {
                                             document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                                             document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
                                         } else {
                                             document.cookie = `googtrans=/en/${newLang}; path=/;`;
                                             document.cookie = `googtrans=/en/${newLang}; path=/; domain=${window.location.hostname};`;
                                         }
                                     }
                                 }
                             };
                             changeLang();
                         }}
                     >
                         <option value="en">English</option>
                         <option value="af">Afrikaans</option>
                         <option value="sq">Albanian</option>
                         <option value="am">Amharic</option>
                         <option value="ar">Arabic</option>
                         <option value="hy">Armenian</option>
                         <option value="az">Azerbaijani</option>
                         <option value="eu">Basque</option>
                         <option value="be">Belarusian</option>
                         <option value="bn">Bengali</option>
                         <option value="bs">Bosnian</option>
                         <option value="bg">Bulgarian</option>
                         <option value="ca">Catalan</option>
                         <option value="ceb">Cebuano</option>
                         <option value="ny">Chichewa</option>
                         <option value="zh-CN">Chinese (Simplified)</option>
                         <option value="zh-TW">Chinese (Traditional)</option>
                         <option value="co">Corsican</option>
                         <option value="hr">Croatian</option>
                         <option value="cs">Czech</option>
                         <option value="da">Danish</option>
                         <option value="nl">Dutch</option>
                         <option value="en">English</option>
                         <option value="eo">Esperanto</option>
                         <option value="et">Estonian</option>
                         <option value="tl">Filipino</option>
                         <option value="fi">Finnish</option>
                         <option value="fr">French</option>
                         <option value="fy">Frisian</option>
                         <option value="gl">Galician</option>
                         <option value="ka">Georgian</option>
                         <option value="de">German</option>
                         <option value="el">Greek</option>
                         <option value="gu">Gujarati</option>
                         <option value="ht">Haitian Creole</option>
                         <option value="ha">Hausa</option>
                         <option value="haw">Hawaiian</option>
                         <option value="iw">Hebrew</option>
                         <option value="hi">Hindi</option>
                         <option value="hmn">Hmong</option>
                         <option value="hu">Hungarian</option>
                         <option value="is">Icelandic</option>
                         <option value="ig">Igbo</option>
                         <option value="id">Indonesian</option>
                         <option value="ga">Irish</option>
                         <option value="it">Italian</option>
                         <option value="ja">Japanese</option>
                         <option value="jw">Javanese</option>
                         <option value="kn">Kannada</option>
                         <option value="kk">Kazakh</option>
                         <option value="km">Khmer</option>
                         <option value="rw">Kinyarwanda</option>
                         <option value="ko">Korean</option>
                         <option value="ku">Kurdish (Kurmanji)</option>
                         <option value="ky">Kyrgyz</option>
                         <option value="lo">Lao</option>
                         <option value="la">Latin</option>
                         <option value="lv">Latvian</option>
                         <option value="lt">Lithuanian</option>
                         <option value="lb">Luxembourgish</option>
                         <option value="mk">Macedonian</option>
                         <option value="mg">Malagasy</option>
                         <option value="ms">Malay</option>
                         <option value="ml">Malayalam</option>
                         <option value="mt">Maltese</option>
                         <option value="mi">Maori</option>
                         <option value="mr">Marathi</option>
                         <option value="mn">Mongolian</option>
                         <option value="my">Myanmar (Burmese)</option>
                         <option value="ne">Nepali</option>
                         <option value="no">Norwegian</option>
                         <option value="or">Odia (Oriya)</option>
                         <option value="ps">Pashto</option>
                         <option value="fa">Persian</option>
                         <option value="pl">Polish</option>
                         <option value="pt">Portuguese</option>
                         <option value="pa">Punjabi</option>
                         <option value="ro">Romanian</option>
                         <option value="ru">Russian</option>
                         <option value="sm">Samoan</option>
                         <option value="gd">Scots Gaelic</option>
                         <option value="sr">Serbian</option>
                         <option value="st">Sesotho</option>
                         <option value="sn">Shona</option>
                         <option value="sd">Sindhi</option>
                         <option value="si">Sinhala</option>
                         <option value="sk">Slovak</option>
                         <option value="sl">Slovenian</option>
                         <option value="so">Somali</option>
                         <option value="es">Spanish</option>
                         <option value="su">Sundanese</option>
                         <option value="sw">Swahili</option>
                         <option value="sv">Swedish</option>
                         <option value="tg">Tajik</option>
                         <option value="ta">Tamil</option>
                         <option value="tt">Tatar</option>
                         <option value="te">Telugu</option>
                         <option value="th">Thai</option>
                         <option value="tr">Turkish</option>
                         <option value="tk">Turkmen</option>
                         <option value="uk">Ukrainian</option>
                         <option value="ur">Urdu</option>
                         <option value="ug">Uyghur</option>
                         <option value="uz">Uzbek</option>
                         <option value="vi">Vietnamese</option>
                         <option value="cy">Welsh</option>
                         <option value="xh">Xhosa</option>
                         <option value="yi">Yiddish</option>
                         <option value="yo">Yoruba</option>
                         <option value="zu">Zulu</option>
                     </select>
                 </div>
 
                 <button type="button" onClick={toggleAzan} className="w-full focus:outline-none flex items-center justify-between p-4 bg-bg-panel rounded-2xl border border-border-main shadow-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                     <div className="flex items-center gap-3">
                         <div className="bg-accent/10 p-2 rounded-xl text-accent">
                             {azanEnabled ? <Bell className="w-5 h-5 shadow-sm" /> : <BellOff className="w-5 h-5 opacity-70" />}
                         </div>
                         <div className="text-left">
                             <p className="font-bold text-sm">Azan Notifications</p>
                             <p className="text-xs text-text-muted">{azanEnabled ? "Sound ON (Click to Silent)" : "Silent (Click to ON)"}</p>
                         </div>
                     </div>
                     <div 
                         className={cn(
                             "w-12 h-6 rounded-full flex items-center p-1 transition-colors duration-300 pointer-events-none",
                             azanEnabled ? "bg-accent" : "bg-border-strong"
                         )}
                     >
                         <div className={cn(
                             "w-4 h-4 rounded-full bg-white transition-transform duration-300",
                             azanEnabled ? "translate-x-6" : "translate-x-0"
                         )}></div>
                     </div>
                 </button>
                 
                 {azanEnabled && (
                     <button 
                         onClick={testAzan}
                         className="w-full py-3 bg-bg-panel border border-border-main rounded-2xl text-sm font-bold text-accent hover:bg-accent/5 transition"
                     >
                         Test Azan & Notification
                     </button>
                 )}
                 <p className="text-xs text-center text-text-muted pb-4 px-4">Note: Your browser may block audio if you haven't interacted with the app. Enable permissions when prompted.</p>
             </div>

             <button 
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 w-full mt-auto bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-2xl font-bold hover:bg-red-500/20 transition"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
             </button>
           </div>
        )}
      </main>

      {/* App Open Ad Overlay */}
      {showAppOpenAd && !effectiveIsPremium && (
        <div className="absolute inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="w-full max-w-sm flex-1 flex items-center justify-center border-4 border-dashed border-gray-300 relative">
               <button 
                  onClick={() => setShowAppOpenAd(false)}
                  className="absolute top-4 right-4 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold border border-gray-300 z-10"
               >
                   Continue to App
               </button>
               <div className="text-center text-gray-500">
                   <p className="font-bold text-lg mb-1">Monetag App Open</p>
                   <p className="text-xs uppercase tracking-widest mb-4">Initial Load Ad</p>
                   <div className="text-[10px] space-y-1">
                       <p>Simulating Monetag Direct Link</p>
                   </div>
               </div>
           </div>
        </div>
      )}

      {/* Interstitial Ad Overlay */}
      {showAd && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-xl w-full max-w-sm h-[400px] flex items-center justify-center border-4 border-dashed border-gray-300 relative shadow-2xl">
               <button 
                  onClick={() => setShowAd(false)}
                  className="absolute -top-4 -right-4 bg-gray-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white"
               >
                   &times;
               </button>
               <div className="text-center text-gray-500">
                   <p className="font-bold text-lg mb-1">Monetag Interstitial</p>
                   <p className="text-xs uppercase tracking-widest mb-4">Ad Space</p>
                   <div className="text-[10px] space-y-1">
                       <p>Simulating monetag vignette/interstitial</p>
                   </div>
               </div>
           </div>
           <p className="text-white mt-4 text-sm bg-black/50 px-4 py-1 rounded-full">Simulated Ad (Auto-closing)</p>
        </div>
      )}

      {!effectiveIsPremium && <AdBanner />}

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-[#f2f0f9] border-t border-[#e2dde8] px-4 py-2 flex justify-around items-center pb-[max(8px,env(safe-area-inset-bottom))] z-50 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.08)] h-[72px]">
        <NavItem 
          icon={<HomeMenuIcon />} 
          label="Home" 
          isActive={activeTab === 'home'} 
          onClick={() => handleNavigate('home')} 
        />
        <NavItem 
          icon={<QuranIcon className="w-full h-full" />} 
          label="Quran" 
          isActive={activeTab === 'quran'} 
          onClick={() => handleNavigate('quran')} 
        />
        <NavItem 
          icon={<MosqueIcon />} 
          label="Prayer" 
          isActive={activeTab === 'prayer'} 
          onClick={() => handleNavigate('prayer')} 
        />
        <NavItem 
          icon={<QiblaIcon />} 
          label="Qibla" 
          isActive={activeTab === 'qibla'} 
          onClick={() => handleNavigate('qibla')} 
        />
      </nav>
    </div>
  );
}

const HomeMenuIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "w-full h-full"}>
    <defs>
      <linearGradient id="homeBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2A1B54" />
        <stop offset="50%" stopColor="#1B1745" />
        <stop offset="100%" stopColor="#100B20" />
      </linearGradient>
      <linearGradient id="homeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4A8BF4" />
        <stop offset="30%" stopColor="#7B5EE5" />
        <stop offset="80%" stopColor="#A857D0" />
        <stop offset="100%" stopColor="#2B287A" />
      </linearGradient>
    </defs>

    {/* Background Squircle */}
    <rect x="5" y="5" width="90" height="90" rx="26" fill="url(#homeBg)" stroke="url(#homeBorder)" strokeWidth="1.5" />

    {/* House Composition */}
    <g fill="#E4E0F0">
      {/* Chimney placed underneath roof stroke */}
      <path d="M 64 42 L 64 26 A 2 2 0 0 1 66 24 L 69 24 A 2 2 0 0 1 71 26 L 71 47 Z" />

      {/* Main Base */}
      <path d="M 32 59
               L 50 41
               L 68 59
               L 68 74
               L 58 74
               L 58 56
               L 42 56
               L 42 74
               L 32 74 Z" 
            stroke="#E4E0F0" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </g>

    {/* Roof Line */}
    <path d="M 22 54 L 50 26 L 78 54" stroke="#E4E0F0" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 group",
        isActive ? "text-[#598b73]" : "text-[#598b73]/50 hover:text-[#598b73]"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-nav-pill"
          className="absolute inset-0 bg-[#598b73]/10 rounded-2xl -z-10"
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
        />
      )}
      <motion.div
        animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {React.cloneElement(icon as React.ReactElement, {
          className: cn("w-6 h-6 transition-all duration-300", isActive && "drop-shadow-[0_0_8px_rgba(var(--accent),0.4)]")
        })}
      </motion.div>
      <motion.span 
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.8, y: 2 }}
        className={cn(
          "text-[10px] font-bold uppercase tracking-wider mt-1 transition-colors duration-300",
          isActive ? "text-accent" : "text-text-muted text-opacity-80"
        )}
      >
        {label}
      </motion.span>
      {isActive && (
        <motion.div 
          layoutId="nav-indicator"
          className="absolute -bottom-2 w-4 h-1 bg-accent rounded-t-full shadow-[0_-2px_8px_var(--tw-shadow-color)] shadow-accent/50"
        />
      )}
    </button>
  );
}
