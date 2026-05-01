import { useEffect, useRef, useState } from 'react';

// Using a reliable public domain Azan audio from Wikimedia Commons
const AZAN_URL = "https://upload.wikimedia.org/wikipedia/commons/3/30/Adhan_in_Egypt.ogg";

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    time: number;
    type: 'azan' | 'system';
}

export function usePrayerNotifications(location: { lat: number, lng: number } | null, isEnabled: boolean) {
    const [prayerTimes, setPrayerTimes] = useState<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const triggeredPrayers = useRef<Set<string>>(new Set());
    
    const [isAzanPlaying, setIsAzanPlaying] = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>(() => {
        try {
            const saved = localStorage.getItem('app_notifications');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        if (!audioRef.current && typeof window !== 'undefined') {
            audioRef.current = new Audio(AZAN_URL);
            audioRef.current.onended = () => setIsAzanPlaying(false);
            audioRef.current.onpause = () => setIsAzanPlaying(false);
            audioRef.current.onplay = () => setIsAzanPlaying(true);
        }
    }, []);

    const addNotification = (notif: Omit<AppNotification, 'id' | 'time'>) => {
        const newNotif: AppNotification = {
            ...notif,
            id: Math.random().toString(36).substring(7),
            time: Date.now()
        };
        setNotifications(prev => {
            const updated = [newNotif, ...prev].slice(0, 50); // Keep last 50
            localStorage.setItem('app_notifications', JSON.stringify(updated));
            return updated;
        });
    };

    const clearNotifications = () => {
        setNotifications([]);
        localStorage.removeItem('app_notifications');
    };

    const stopAzan = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsAzanPlaying(false);
        }
    };

    useEffect(() => {
        if (!location) return;

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${location.lat}&longitude=${location.lng}&method=2`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const day = date.getDate();
                const todayData = data.data.find((d: any) => parseInt(d.date.gregorian.day, 10) === day);
                if (todayData) {
                    setPrayerTimes(todayData.timings);
                }
            })
            .catch(console.error);
    }, [location]);

    useEffect(() => {
        if (!prayerTimes || !isEnabled) return;

        const interval = setInterval(() => {
            const now = new Date();
            const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            // Clean up Aladhan's format ("05:30 (EEST)" -> "05:30")
            const timesToCheck = {
                Fajr: prayerTimes.Fajr.split(' ')[0],
                Dhuhr: prayerTimes.Dhuhr.split(' ')[0],
                Asr: prayerTimes.Asr.split(' ')[0],
                Maghrib: prayerTimes.Maghrib.split(' ')[0],
                Isha: prayerTimes.Isha.split(' ')[0]
            };

            Object.entries(timesToCheck).forEach(([prayer, time]) => {
                const prayerId = `${prayer}-${now.toDateString()}`; // Track per day to avoid repeats
                if (time === currentTimeStr && !triggeredPrayers.current.has(prayerId)) {
                    triggeredPrayers.current.add(prayerId);
                    
                    addNotification({
                        title: `Time for ${prayer}`,
                        message: `It's time to pray ${prayer}. May Allah accept your prayers.`,
                        type: 'azan'
                    });

                    playAzanAndNotify(prayer);
                }
            });
            
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [prayerTimes, isEnabled]);

    const playAzanAndNotify = (prayerName: string) => {
        // Show Browser Notification
        if ("Notification" in window && Notification.permission === "granted") {
            if (navigator.serviceWorker) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(`Time for ${prayerName}`, {
                        body: `It's time to pray ${prayerName}. May Allah accept your prayers.`,
                        icon: '/vite.svg',
                        badge: '/vite.svg',
                        vibrate: [200, 100, 200, 100, 200, 100, 200]
                    });
                }).catch(() => {
                    new Notification(`Time for ${prayerName}`, {
                        body: `It's time to pray ${prayerName}. May Allah accept your prayers.`,
                        icon: '/vite.svg' 
                    });
                });
            } else {
                new Notification(`Time for ${prayerName}`, {
                    body: `It's time to pray ${prayerName}. May Allah accept your prayers.`,
                    icon: '/vite.svg' 
                });
            }
        }

        // Play Azan Audio
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().then(() => {
                setIsAzanPlaying(true);
            }).catch(e => {
                console.warn("Autoplay blocked. User must interact with the page first.", e);
                setIsAzanPlaying(false);
            });
        }
    };
    
    // Explicit function to test/request permission
    const testAzan = () => {
       addNotification({
           title: `Test Azan Notification`,
           message: `This is a test notification for Azan.`,
           type: 'system'
       });
       playAzanAndNotify('Test');
    };

    return { testAzan, isAzanPlaying, stopAzan, notifications, clearNotifications };
}
