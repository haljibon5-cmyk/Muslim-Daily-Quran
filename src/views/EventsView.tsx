import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { format, parse } from 'date-fns';

const EVENTS_DATA = [
    { name: "Islamic New Year", hDay: 1, hMonth: 1, label: "1 Muharram" },
    { name: "Day of Ashura", hDay: 10, hMonth: 1, label: "10 Muharram" },
    { name: "Mawlid al-Nabi", hDay: 12, hMonth: 3, label: "12 Rabi al-Awwal" },
    { name: "Isra and Mi'raj", hDay: 27, hMonth: 7, label: "27 Rajab" },
    { name: "Laylat al-Qadr", hDay: 27, hMonth: 9, label: "27 Ramadan" },
    { name: "Eid al-Fitr", hDay: 1, hMonth: 10, label: "1 Shawwal" },
    { name: "Day of Arafah", hDay: 9, hMonth: 12, label: "9 Dhu al-Hijjah" },
    { name: "Eid al-Adha", hDay: 10, hMonth: 12, label: "10 Dhu al-Hijjah" },
];

export default function EventsView({ onBack }: { onBack: () => void }) {
    const [events, setEvents] = useState<(typeof EVENTS_DATA[0] & { gDate?: string, isUpcoming?: boolean })[]>(
        EVENTS_DATA.map(e => ({ ...e }))
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const date = new Date();
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();

                // Get current Hijri date
                const todayRes = await fetch(`https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`);
                const todayData = await todayRes.json();
                
                if (todayData?.data?.hijri) {
                    const currentHYear = parseInt(todayData.data.hijri.year);
                    const currentHMonth = parseInt(todayData.data.hijri.month.number);
                    const currentHDay = parseInt(todayData.data.hijri.day);

                    const eventsWithDates = await Promise.all(EVENTS_DATA.map(async (event) => {
                        let eventHYear = currentHYear;
                        
                        // If the event has already passed this Hijri year, get the date for next year
                        let isUpcoming = true;
                        if (event.hMonth < currentHMonth || (event.hMonth === currentHMonth && event.hDay < currentHDay)) {
                            eventHYear += 1;
                        } else if (event.hMonth === currentHMonth && event.hDay === currentHDay) {
                            // Today!
                            isUpcoming = true;
                        }

                        const paddedDay = String(event.hDay).padStart(2, '0');
                        const paddedMonth = String(event.hMonth).padStart(2, '0');
                        
                        try {
                            const res = await fetch(`https://api.aladhan.com/v1/hToG/${paddedDay}-${paddedMonth}-${eventHYear}`);
                            const data = await res.json();
                            if (data?.data?.gregorian?.date) {
                                // Date is format DD-MM-YYYY
                                const parsed = parse(data.data.gregorian.date, 'dd-MM-yyyy', new Date());
                                const gDateStr = format(parsed, 'd MMMM yyyy');
                                return { ...event, gDate: gDateStr, isUpcoming };
                            }
                        } catch (err) { }
                        
                        return { ...event, isUpcoming };
                    }));

                    // Sort events by upcoming first
                    const sorted = eventsWithDates.sort((a: any, b: any) => {
                        if (!a.gDate || !b.gDate) return 0;
                        const dateA = parse(a.gDate, 'd MMMM yyyy', new Date());
                        const dateB = parse(b.gDate, 'd MMMM yyyy', new Date());
                        return dateA.getTime() - dateB.getTime();
                    });

                    setEvents(sorted);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDates();
    }, []);

    return (
        <div className="flex flex-col h-full bg-bg-base relative pt-12 pb-24 px-5 overflow-y-auto no-scrollbar font-sans text-text-main animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-8 sticky top-0 bg-bg-base/90 backdrop-blur-sm z-10 py-2 -mx-5 px-5">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold font-serif italic text-accent">Islamic Events</h1>
            </div>

            <div className="space-y-4">
                <p className="text-sm opacity-80 mb-6">Upcoming Islamic events and holidays. These dates are based on the Hijri calendar.</p>
                
                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
                    </div>
                )}

                {!loading && events.map((event, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="bg-bg-panel border border-border-main p-4 rounded-2xl shadow-sm flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{event.name}</h3>
                                <p className="text-sm text-text-muted">{event.label}</p>
                            </div>
                        </div>
                        <div className="text-right pl-4">
                            {event.gDate && (
                                <p className="text-sm font-semibold text-accent">{event.gDate}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
