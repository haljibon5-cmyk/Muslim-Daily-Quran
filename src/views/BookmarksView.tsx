import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { BookmarkItem, getBookmarks, removeBookmark } from '../lib/bookmarks';

export default function BookmarksView({ onBack, onNavigateToQuran, onNavigateToHadith }: { onBack: () => void, onNavigateToQuran: (surahId?: number, ayahNum?: number) => void, onNavigateToHadith: (collectionId?: string) => void }) {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

    useEffect(() => {
        setBookmarks(getBookmarks().sort((a, b) => b.timestamp - a.timestamp));
    }, []);

    const handleDelete = (id: string) => {
        removeBookmark(id);
        setBookmarks(getBookmarks().sort((a, b) => b.timestamp - a.timestamp));
    };

    const handleOpen = (item: BookmarkItem) => {
        if (item.type === 'quran') {
            // Save state so Quran view opens at exactly this
            localStorage.setItem('resume_quran', JSON.stringify({
                surah: item.payload.surahId,
                ayah: item.payload.ayahNum
            }));
            onNavigateToQuran();
        } else if (item.type === 'hadith') {
            localStorage.setItem('resume_hadith', JSON.stringify({
                collection: item.payload.collectionId
            }));
            onNavigateToHadith();
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-base relative">
            <div className="pt-12 pb-6 px-6 bg-header-bg text-white sticky top-0 z-20 border-b border-border-main">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-serif italic m-0">বুকমার্ক সমূহ (Bookmarks)</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 text-text-main">
                {bookmarks.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-text-muted">
                        <p>No bookmarks found.</p>
                    </div>
                ) : (
                    bookmarks.map((item, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={item.id}
                            className="bg-bg-panel p-4 rounded-xl border border-border-main shadow-sm flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col flex-1" onClick={() => handleOpen(item)}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent px-2 py-0.5 rounded">
                                            {item.type}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg cursor-pointer hover:text-accent transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-text-muted mt-1">{item.subtitle}</p>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                    className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors ml-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
