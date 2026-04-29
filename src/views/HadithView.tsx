import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, BookOpen, Search, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { saveLastHadithRead } from '../lib/db';
import { isBookmarked, toggleBookmark } from '../lib/bookmarks';

interface Hadith {
    hadithnumber: number;
    arabicnumber: number;
    text: string;
}

interface MergedHadith {
    id: string;
    collection: string;
    collectionLabel: string;
    number: number;
    book: string;
    arabic: string;
    translation: string;
}

const AVAILABLE_COLLECTIONS = [
    { id: 'bukhari', label: 'সহীহ বুখারি (Bukhari)', tabLabel: 'বুখারি' },
    { id: 'muslim', label: 'সহীহ মুসলিম (Muslim)', tabLabel: 'মুসলিম' },
    { id: 'tirmidhi', label: 'জামে তিরমিযি (Tirmidhi)', tabLabel: 'তিরমিযি' },
    { id: 'abudawud', label: 'সুনানে আবু দাউদ (Abu Dawud)', tabLabel: 'আবু দাউদ' },
    { id: 'nasai', label: 'সুনানে নাসায়ী (Nasai)', tabLabel: 'নাসায়ী' }
];

export default function HadithView({ onBack }: { onBack?: () => void }) {
    const [search, setSearch] = useState('');
    const [activeColId, setActiveColId] = useState('bukhari');
    
    const [hadiths, setHadiths] = useState<MergedHadith[]>([]);
    const [chapter, setChapter] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookmarksState, setBookmarksState] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const initialState: Record<string, boolean> = {};
        hadiths.forEach(h => {
            initialState[h.id] = isBookmarked(h.id);
        });
        setBookmarksState(initialState);
    }, [hadiths]);

    const handleBookmark = (hadith: MergedHadith) => {
        const isB = toggleBookmark({
            id: hadith.id,
            type: 'hadith',
            title: `${hadith.collectionLabel} • ${hadith.number}`,
            subtitle: hadith.book,
            payload: { collectionId: activeColId, chapter: chapter },
            timestamp: Date.now()
        });
        setBookmarksState(prev => ({ ...prev, [hadith.id]: isB }));
    };

    const activeColLabel = AVAILABLE_COLLECTIONS.find(c => c.id === activeColId)?.label || activeColId;

    useEffect(() => {
        const resumeUrl = localStorage.getItem('resume_hadith');
        if (resumeUrl) {
            try {
                const { collection } = JSON.parse(resumeUrl);
                if (collection && typeof collection === 'string') {
                    const match = AVAILABLE_COLLECTIONS.find(c => collection.toLowerCase().includes(c.id));
                    if (match) setActiveColId(match.id);
                }
            } catch (e) {}
            localStorage.removeItem('resume_hadith');
        }
    }, []);

    // Save as last read when changing collection
    useEffect(() => {
        saveLastHadithRead(`Sahih ${activeColId}`, 1, "Selection");
        localStorage.setItem('guest_hadith_history', JSON.stringify({ collection: `Sahih ${activeColId}`, number: 1, book: "Selection" }));
    }, [activeColId]);

    const fetchChapter = async (collectionId: string, chapterId: number, append: boolean = false) => {
        setLoading(true);
        setError(null);
        try {
            const [araRes, benRes] = await Promise.all([
                fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${collectionId}/sections/${chapterId}.json`),
                fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-${collectionId}/sections/${chapterId}.json`)
            ]);

            if (!araRes.ok || !benRes.ok) {
                 if (araRes.status === 404 || benRes.status === 404) {
                     setHasMore(false);
                 } else {
                     setError("Failed to load hadiths.");
                 }
                 setLoading(false);
                 return;
            }

            const araData = await araRes.json();
            const benData = await benRes.json();

            const araList: Hadith[] = araData.hadiths || [];
            const benList: Hadith[] = benData.hadiths || [];

            const bookName = araData.metadata?.section?.[chapterId] || `Chapter ${chapterId}`;

            const merged: MergedHadith[] = [];
            
            // Map benList to a dictionary for faster lookup
            const benMap = new Map<number, string>();
            benList.forEach(h => benMap.set(h.hadithnumber, h.text));

            araList.forEach(ara => {
                // sometimes the ben collection has the arabic prefixed, we will just use the exact ben text.
                // Or if it's missing, we ignore or leave blank
                let transText = benMap.get(ara.hadithnumber) || '';
                
                // Extremely basic parsing if the translation already has arabic inside it,
                // but usually React formatting separates them anyway.
                
                merged.push({
                    id: `${collectionId}-${ara.hadithnumber}`,
                    collection: collectionId,
                    collectionLabel: activeColLabel,
                    number: ara.hadithnumber,
                    book: bookName,
                    arabic: ara.text,
                    translation: transText.trim(),
                });
            });

            if (append) {
                setHadiths(prev => [...prev, ...merged]);
            } else {
                setHadiths(merged);
            }
            
            // If less than 10 hadiths grabbed, we might just assume we could load more but for safety we'll require a button click
            setHasMore(true);

        } catch (err: any) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Reset when collection changes
        setHadiths([]);
        setChapter(1);
        setHasMore(true);
        fetchChapter(activeColId, 1, false);
    }, [activeColId]);

    const handleLoadMore = () => {
        const nextChapter = chapter + 1;
        setChapter(nextChapter);
        fetchChapter(activeColId, nextChapter, true);
    };

    const filteredHadiths = hadiths.filter(h => 
        search === '' || 
        (h.translation || '').toLowerCase().includes(search.toLowerCase()) ||
        (h.book || '').toLowerCase().includes(search.toLowerCase()) ||
        (h.arabic || '').includes(search)
    );

    return (
        <div className="flex flex-col h-full bg-bg-base relative text-text-main">
            {/* Header */}
            <div className="pt-12 pb-6 px-6 bg-header-bg text-white sticky top-0 z-20 border-b border-border-main">
                <div className="flex items-center gap-3 mb-4">
                    {onBack && (
                        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    )}
                    <h1 className="text-4xl font-serif italic m-0">হাদিস সংগ্রহ</h1>
                </div>
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                    <input 
                        type="text" 
                        placeholder="হাদিস অনুসন্ধান করুন..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                </div>
            </div>

            {/* Collection Tabs */}
            <div className="py-3 border-b border-border-main">
                <div className="flex flex-wrap justify-center gap-2 px-4">
                    {AVAILABLE_COLLECTIONS.map(col => (
                        <button
                            key={col.id}
                            onClick={() => setActiveColId(col.id)}
                            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                                activeColId === col.id 
                                ? 'bg-[#2B5A50] text-[#F9F7F4] shadow border border-[#2B5A50]' 
                                : 'bg-transparent text-text-muted hover:bg-black/5 dark:hover:bg-white/5 border border-border-main'
                            }`}
                        >
                            {col.tabLabel}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hadith List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24 w-full max-w-full">
                {filteredHadiths.map((hadith) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={hadith.id}
                        className="bg-bg-panel p-5 rounded-2xl border border-border-main shadow-sm flex flex-col gap-4 w-full overflow-hidden"
                    >
                        <div className="flex justify-between items-start gap-2">
                            <div className="bg-[#2B5A50]/10 px-3 py-1 rounded-lg text-[13px] font-bold text-[#2B5A50] tracking-wide shrink min-w-0 break-words">
                                {(hadith.collectionLabel || hadith.collection || '').split(' (')[0]} • {hadith.number}
                            </div>
                            <button 
                                onClick={() => handleBookmark(hadith)}
                                className="text-text-muted hover:text-[#2B5A50] transition-colors shrink-0"
                            >
                                {bookmarksState[hadith.id] ? <BookmarkCheck className="w-5 h-5 text-[#2B5A50]" /> : <Bookmark className="w-5 h-5" />}
                            </button>
                        </div>
                        
                        <p className="font-arabic text-2xl leading-[2.2] text-right text-text-main mt-4 notranslate" dir="rtl" translate="no">
                            {hadith.arabic}
                        </p>
                        
                        <div className="h-px w-full bg-border-main my-2 shrink-0"></div>
                        
                        <p className="text-[15px] text-text-main leading-relaxed whitespace-pre-wrap">
                            {hadith.translation}
                        </p>
                    </motion.div>
                ))}
                
                {loading && (
                    <div className="flex justify-center items-center py-6">
                        <Loader2 className="w-6 h-6 animate-spin text-accent" />
                        <span className="ml-2 text-text-muted text-sm font-medium">লোড হচ্ছে...</span>
                    </div>
                )}
                
                {!loading && hasMore && filteredHadiths.length > 0 && search === '' && (
                    <button 
                        onClick={handleLoadMore}
                        className="w-full mt-4 bg-bg-panel border border-border-main text-text-main font-bold py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                    >
                        পরবর্তী অধ্যায় লোড করুন
                    </button>
                )}
                
                {!loading && !hasMore && filteredHadiths.length > 0 && search === '' && (
                    <p className="text-center text-text-muted text-sm py-6">সব হাদিস লোড করা হয়েছে।</p>
                )}
                
                {!loading && error && (
                    <div className="text-center text-red-500 text-sm py-4">
                        {error}
                        <button onClick={() => fetchChapter(activeColId, chapter, chapter > 1)} className="block mx-auto mt-2 underline">
                            পুনরায় চেষ্টা করুন
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
