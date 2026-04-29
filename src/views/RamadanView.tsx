import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Moon } from 'lucide-react';

interface RamadanViewProps {
    onBack: () => void;
    location: { lat: number; lng: number } | null;
    locationName?: string;
}

interface RamadanDay {
    date: string;
    dayNum: string;
    sehri: string;
    iftar: string;
}

export default function RamadanView({ onBack, location, locationName }: RamadanViewProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [countdownDate, setCountdownDate] = useState<Date | null>(null);
    const [countdownStr, setCountdownStr] = useState('');
    const [ramadanDays, setRamadanDays] = useState<RamadanDay[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!location) {
                setError('Location access required for accurate Sehri & Iftar times.');
                setLoading(false);
                return;
            }
            try {
                // 1. Get today's Hijri Date to determine target Ramadan year
                const date = new Date();
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();
                
                const gToHRes = await fetch(`https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`);
                const gToHData = await gToHRes.json();
                
                if (!gToHData?.data?.hijri) throw new Error("Could not fetch current Hijri date.");
                
                const currentHijriMonth = parseInt(gToHData.data.hijri.month.number, 10);
                let targetHijriYear = parseInt(gToHData.data.hijri.year, 10);
                
                // If today is past Ramadan (Shawwal is 10), then next Ramadan is next year.
                if (currentHijriMonth > 9) {
                    targetHijriYear += 1;
                }

                // 2. Fetch the Ramadan Calendar
                const calRes = await fetch(`https://api.aladhan.com/v1/hijriCalendar/${targetHijriYear}/09?latitude=${location.lat}&longitude=${location.lng}&method=2`);
                const calData = await calRes.json();
                
                if (!calData?.data || !Array.isArray(calData.data)) throw new Error("Could not fetch Ramadan calendar.");
                
                const days: RamadanDay[] = calData.data.map((item: any) => {
                    const hijriDayStr = item.date.hijri.day;
                    const gregorianDate = item.date.gregorian.date; // DD-MM-YYYY
                    const fajrTime = item.timings.Fajr.split(' ')[0];
                    const sehriEnd = item.timings.Imsak.split(' ')[0];
                    const iftarTime = item.timings.Maghrib.split(' ')[0];
                    
                    return {
                        date: gregorianDate,
                        dayNum: hijriDayStr,
                        sehri: sehriEnd,
                        iftar: iftarTime
                    };
                });
                setRamadanDays(days);
                
                // 3. Setup countdown
                // Calculate until the first day of Ramadan (index 0) Fajr time
                if (days.length > 0) {
                    const firstDayStr = days[0].date; // DD-MM-YYYY
                    const [d, m, y] = firstDayStr.split('-');
                    // We'll set countdown target to midnight of that day, or Iftar time? Usually just the start of the day.
                    const t = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), 0, 0, 0);
                    
                    // If we are currently IN ramadan, we could countdown to Iftar, but let's just make it "Ramadan is here" if now >= start
                    setCountdownDate(t);
                }

            } catch (err: any) {
                setError(err.message || "Failed to load Ramadan data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [location]);

    useEffect(() => {
        if (!countdownDate) return;
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = countdownDate.getTime() - now;
            
            if (distance < 0) {
                setCountdownStr('Ramadan is here! May Allah accept our fasting.');
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            setCountdownStr(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
        };
        
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [countdownDate]);

    // AM/PM Converter helper
    const convertTo12Hour = (time24: string) => {
        let [hours, minutes] = time24.split(':');
        let h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${minutes} ${ampm}`;
    };

    return (
        <div className="flex flex-col h-full bg-bg-base relative pt-12 pb-24 px-5 overflow-y-auto no-scrollbar font-sans text-text-main animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-4 sticky top-0 bg-bg-base/90 backdrop-blur-sm z-10 py-2 -mx-5 px-5">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold font-serif italic text-accent flex items-center gap-2">
                        <Moon className="w-6 h-6" /> Ramadan
                    </h1>
                </div>
            </div>
            
            {locationName && (
                <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span>{locationName}</span>
                </div>
            )}

            {loading && (
                 <div className="h-64 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
                </div>
            )}
            
            {error && !loading && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-center shadow-sm">
                   {error}
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* Countdown Card */}
                    <div className="bg-gradient-to-br from-accent to-[#296048] p-6 rounded-[2rem] shadow-md text-white mb-8 text-center relative overflow-hidden">
                        <Moon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
                        <h2 className="text-sm font-medium opacity-90 uppercase tracking-widest mb-2">Countdown to Ramadan</h2>
                        <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight pb-2 relative z-10">
                            {countdownStr}
                        </div>
                    </div>

                    <h3 className="font-bold text-lg mb-4 text-text-main">
                        Ramadan Timetable (Sehri & Iftar)
                    </h3>

                    {/* Auto scroll to today can be tricky without tracking exact current day, but we'll show all 30 days */}
                    <div className="flex flex-col gap-3">
                        {ramadanDays.map((day, idx) => {
                             // Let's highlight if today is this date
                             const dateObj = new Date();
                             const dd = String(dateObj.getDate()).padStart(2, '0');
                             const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                             const yyyy = dateObj.getFullYear();
                             const todayStr = `${dd}-${mm}-${yyyy}`;
                             const isToday = day.date === todayStr;

                             return (
                                <div key={idx} className={`p-4 rounded-2xl flex flex-row items-center justify-between shadow-sm border ${isToday ? 'bg-accent/10 border-accent/30' : 'bg-bg-panel border-border-main'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold font-serif text-lg ${isToday ? 'bg-accent text-white' : 'bg-black/5 dark:bg-white/5 text-text-main'}`}>
                                            {day.dayNum}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-text-main">{day.date}</div>
                                            {isToday && <span className="text-[10px] uppercase font-bold text-accent tracking-wider">Today</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-0.5">Sehri</span>
                                            <span className="font-mono text-sm font-semibold">{convertTo12Hour(day.sehri)}</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-0.5">Iftar</span>
                                            <span className="font-mono text-sm font-semibold text-accent">{convertTo12Hour(day.iftar)}</span>
                                        </div>
                                    </div>
                                </div>
                             )
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
