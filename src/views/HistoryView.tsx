import React, { useEffect, useState } from 'react';
import { BookOpen, Star, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Tab } from '../App';
import { getHistory } from '../lib/db';
import { User } from 'firebase/auth';

export default function HistoryView({ onNavigate, isGuest, user, onBack }: { onNavigate: (t: Tab) => void, isGuest: boolean, user: User | null, onBack?: () => void }) {
    const [history, setHistory] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getHistory().then(data => {
                if (data) setHistory(data);
                setLoading(false);
            });
        } else if (isGuest) {
            const guestTasbih = localStorage.getItem('tasbihCount');
            const guestTasbihTarget = localStorage.getItem('tasbihTarget');
            const guestQuran = localStorage.getItem('guest_quran_history');
            const guestHadith = localStorage.getItem('guest_hadith_history');
            
            const compiled: any = {};
            if (guestTasbih) compiled.lastTasbihCurrent = parseInt(guestTasbih);
            if (guestTasbihTarget) compiled.lastTasbihTarget = parseInt(guestTasbihTarget);
            compiled.lastTasbihName = 'Regular Dhikr';
            
            if (guestQuran) {
                try {
                    const parsed = JSON.parse(guestQuran);
                    compiled.lastQuranSurah = parsed.surah;
                    compiled.lastQuranAyah = parsed.ayah;
                    compiled.lastQuranSurahName = parsed.name;
                } catch(e) {}
            }
            if (guestHadith) {
                try {
                    const parsed = JSON.parse(guestHadith);
                    compiled.lastHadithCollection = parsed.collection;
                    compiled.lastHadithNumber = parsed.number;
                    compiled.lastHadithBook = parsed.book;
                } catch(e) {}
            }

            setHistory(compiled);
            setLoading(false);
        }
    }, [user, isGuest]);

    const resumeQuran = () => {
        if (history?.lastQuranSurah) {
            localStorage.setItem('resume_quran', JSON.stringify({ surah: history.lastQuranSurah, ayah: history.lastQuranAyah }));
            onNavigate('quran');
        } else {
            onNavigate('quran');
        }
    };

    const resumeHadith = () => {
        if (history?.lastHadithCollection) {
            localStorage.setItem('resume_hadith', JSON.stringify({ collection: history.lastHadithCollection }));
            onNavigate('hadith');
        } else {
            onNavigate('hadith');
        }
    };

    const resumeTasbih = () => {
        onNavigate('tasbih');
    };

    return (
        <div className="flex flex-col h-full bg-bg-base text-text-main relative">
            {/* Header */}
            <div className="pt-12 pb-6 px-6 bg-header-bg text-white sticky top-0 z-10 border-b border-border-main shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    {onBack && (
                        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    )}
                    <h1 className="text-4xl font-serif italic m-0">Reading History</h1>
                </div>
                <p className="text-sm text-white/70">Pick up exactly where you left off.</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 space-y-6">
                
                {loading ? (
                    <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <>
                        {/* Quran History */}
                        <div>
                            <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest px-2 mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-accent" />
                                Last Read Quran
                            </h2>
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                onClick={resumeQuran}
                                className="bg-bg-panel border border-border-main rounded-2xl p-4 shadow-sm flex items-center justify-between group cursor-pointer hover:border-accent transition-colors active:scale-[0.98]"
                            >
                                {history?.lastQuranSurah ? (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                                            <span className="font-arabic text-xl text-accent font-bold notranslate" dir="rtl" translate="no">
                                                {Number(history.lastQuranSurah).toLocaleString('ar-EG')}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{history.lastQuranSurahName || `Surah ${history.lastQuranSurah}`}</h3>
                                            <p className="text-xs text-text-muted mt-0.5">Ayah {history.lastQuranAyah}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 text-text-muted">No Quran reading history yet.</div>
                                )}
                                <button className="w-10 h-10 rounded-full bg-bg-base flex items-center justify-center border border-border-main group-hover:bg-accent group-hover:text-header-bg group-hover:border-accent transition-colors flex-shrink-0">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        </div>

                        {/* Hadith History */}
                        <div>
                            <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest px-2 mb-4 flex items-center gap-2">
                                <Star className="w-4 h-4 text-accent" />
                                Last Read Hadith
                            </h2>
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                onClick={resumeHadith}
                                className="bg-bg-panel border border-border-main rounded-2xl p-4 shadow-sm flex items-center justify-between group cursor-pointer hover:border-accent transition-colors active:scale-[0.98]"
                            >
                                {history?.lastHadithCollection ? (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex flex-col items-center justify-center border border-accent/20">
                                            <span className="text-[10px] font-bold text-accent uppercase">Hadith</span>
                                            <span className="font-bold text-sm text-text-main line-clamp-1 truncate w-full text-center">#{history.lastHadithNumber || '-'}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-md line-clamp-1">{history.lastHadithCollection}</h3>
                                            <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{history.lastHadithBook}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 text-text-muted">No Hadith reading history yet.</div>
                                )}
                                <button className="w-10 h-10 rounded-full bg-bg-base flex items-center justify-center border border-border-main group-hover:bg-accent group-hover:text-header-bg group-hover:border-accent transition-colors flex-shrink-0">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        </div>

                        {/* Tasbih History */}
                        <div>
                            <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest px-2 mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-accent" />
                                Recent Dhikr
                            </h2>
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                onClick={resumeTasbih}
                                className="bg-bg-panel border border-border-main rounded-2xl p-4 shadow-sm flex items-center justify-between group cursor-pointer hover:border-accent transition-colors active:scale-[0.98]"
                            >
                                <div className="flex justify-between items-center w-full">
                                    <div>
                                        <h3 className="font-bold text-md">{history?.lastTasbihName || 'Subhanallah'}</h3>
                                        <p className="text-xs text-text-muted mt-0.5">Target: {history?.lastTasbihTarget || 33}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold font-mono tracking-tighter text-accent">{history?.lastTasbihCurrent || 0}<span className="text-sm text-text-muted">/{history?.lastTasbihTarget || 33}</span></span>
                                        {(history?.lastTasbihCurrent >= history?.lastTasbihTarget) && <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Completed</p>}
                                    </div>
                                    <button className="ml-4 w-10 h-10 rounded-full bg-bg-base flex items-center justify-center border border-border-main group-hover:bg-accent group-hover:text-header-bg group-hover:border-accent transition-colors flex-shrink-0">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
