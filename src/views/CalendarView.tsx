import React, { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { cn } from '../lib/utils';

export default function CalendarView({ onBack }: { onBack: () => void }) {
    const [hijriDate, setHijriDate] = useState<{ day: string, month: string, year: string, designation: string } | null>(null);
    const [gregorianDate, setGregorianDate] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDate = async () => {
            try {
                const date = new Date();
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();
                
                setGregorianDate(`${dd}-${mm}-${yyyy}`);

                const res = await fetch(`https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`);
                const data = await res.json();
                
                if (data && data.data && data.data.hijri) {
                    setHijriDate({
                        day: data.data.hijri.day,
                        month: data.data.hijri.month.en,
                        year: data.data.hijri.year,
                        designation: data.data.hijri.designation.abbreviated
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDate();
    }, []);

    return (
        <div className="flex flex-col h-full bg-bg-base relative pt-12 pb-24 px-5 overflow-y-auto no-scrollbar font-sans text-text-main animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-8 sticky top-0 bg-bg-base/90 backdrop-blur-sm z-10 py-2 -mx-5 px-5">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold font-serif italic text-accent">Islamic Calendar</h1>
            </div>

            <div className="flex flex-col items-center justify-center py-12 px-4 bg-bg-panel border border-border-main rounded-3xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <CalendarDays className="w-48 h-48" />
                </div>
                
                {loading ? (
                    <div className="h-40 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
                    </div>
                ) : (
                    <div className="text-center z-10">
                        <p className="text-sm uppercase tracking-widest text-text-muted mb-2">Today's Hijri Date</p>
                        <h2 className="text-6xl font-bold font-serif mb-2 text-accent">
                            {hijriDate?.day}
                        </h2>
                        <h3 className="text-2xl font-medium mb-1">
                            {hijriDate?.month}
                        </h3>
                        <p className="text-lg opacity-80 mb-6 font-serif">
                            {hijriDate?.year} {hijriDate?.designation}
                        </p>

                        <div className="w-16 h-px bg-border-strong mx-auto mb-6"></div>

                        <p className="text-xs uppercase tracking-widest text-text-muted mb-1">Gregorian Date</p>
                        <p className="font-medium text-lg">{gregorianDate}</p>
                    </div>
                )}
            </div>
            
            <p className="mt-8 text-center text-sm text-text-muted">The exact hijri date may vary by 1-2 days depending on the moon sighting in your region.</p>
        </div>
    );
}
