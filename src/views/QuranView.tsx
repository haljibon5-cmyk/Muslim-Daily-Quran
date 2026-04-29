import React, { useEffect, useState, useRef } from 'react';
import { fetchSurahs, fetchSurahDetails, fetchEditions } from '../services/api';
import { ChevronLeft, Search, Play, Pause, Volume2, Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { saveLastQuranRead, updateDailyProgress } from '../lib/db';
import { auth } from '../lib/firebase';
import { isBookmarked, toggleBookmark } from '../lib/bookmarks';

export default function QuranView({ onBack }: { onBack?: () => void }) {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [resumedAyah, setResumedAyah] = useState<number | null>(null);
  const [editions, setEditions] = useState<any[]>([]);
  const [selectedTranslation, setSelectedTranslation] = useState('en.asad');

  useEffect(() => {
    fetchSurahs().then(setSurahs).catch(console.error);
    fetchEditions().then(data => {
        const sorted = data.sort((a: any, b: any) => a.language.localeCompare(b.language));
        setEditions(sorted);
    }).catch(console.error);
  }, []);

  useEffect(() => {
      // Check for resume request
      const resumeUrl = localStorage.getItem('resume_quran');
      if (resumeUrl) {
          try {
              const { surah, ayah } = JSON.parse(resumeUrl);
              if (surah) {
                  setSelectedSurah(surah);
                  if (ayah) setResumedAyah(ayah);
              }
          } catch (e) {}
          localStorage.removeItem('resume_quran');
      }
  }, []);

  const filtered = surahs.filter(s => s.englishName.toLowerCase().includes(search.toLowerCase()) || s.name.includes(search));

  if (selectedSurah) {
    return (
        <SurahReader 
            surahId={selectedSurah} 
            surahTitle={surahs.find(s => s.number === selectedSurah)?.englishName || ''} 
            translation={selectedTranslation}
            resumedAyah={resumedAyah}
            onBack={() => {
                setSelectedSurah(null);
                setResumedAyah(null);
            }} 
        />
    );
  }

  return (
    <div className="flex flex-col h-full bg-bg-base relative">
      <div className="pt-12 pb-6 px-6 bg-header-bg sticky top-0 z-10 border-b border-border-main">
        <div className="flex items-center gap-3 mb-4">
            {onBack && (
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-text-main" />
                </button>
            )}
            <h1 className="text-4xl font-serif text-text-main italic m-0">Holy Quran</h1>
        </div>
        <div className="flex flex-col gap-3">
            <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input 
                    type="text" 
                    placeholder="Search Surah..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-bg-panel border border-border-main rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-text-main placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
            </div>
            
            <select 
                value={selectedTranslation} 
                onChange={(e) => setSelectedTranslation(e.target.value)}
                className="w-full bg-bg-panel border border-border-main rounded-xl px-4 py-3 text-sm font-medium text-text-main focus:outline-none focus:ring-1 focus:ring-[#D4AF37] appearance-none"
            >
                {editions.map(ed => (
                    <option key={ed.identifier} value={ed.identifier}>
                        {ed.language.toUpperCase()} - {ed.englishName}
                    </option>
                ))}
            </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        {filtered.map((surah) => (
            <motion.button 
                key={surah.number}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedSurah(surah.number)}
                className="w-full flex items-center justify-between p-4 bg-bg-panel rounded-2xl border border-border-main hover:border-accent/50 transition-colors text-left"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-header-bg flex items-center justify-center border border-border-main relative transform rotate-45">
                        <span className="text-xs font-bold text-accent transform -rotate-45">{surah.number}</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-text-main mb-1">{surah.englishName}</h4>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest">{surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs</p>
                    </div>
                </div>
                <div className="text-right">
                    <h3 className="font-arabic text-xl font-bold text-accent notranslate" dir="rtl" translate="no">{surah.name}</h3>
                </div>
            </motion.button>
        ))}
        {filtered.length === 0 && <p className="text-center text-text-muted mt-10">No surahs found.</p>}
      </div>
    </div>
  );
}

function SurahReader({ surahId, surahTitle, translation, resumedAyah, onBack }: { surahId: number, surahTitle: string, translation: string, resumedAyah?: number | null, onBack: () => void }) {
    const [verses, setVerses] = useState<{ar: any, en: any, audio: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [bookmarksState, setBookmarksState] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const initialState: Record<string, boolean> = {};
        verses.forEach(v => {
            const id = `quran-${surahId}-${v.ar.numberInSurah}`;
            initialState[id] = isBookmarked(id);
        });
        setBookmarksState(initialState);
    }, [verses, surahId]);

    const handleBookmark = (verse: any) => {
        const id = `quran-${surahId}-${verse.ar.numberInSurah}`;
        const isB = toggleBookmark({
            id,
            type: 'quran',
            title: `${surahTitle} - Ayah ${verse.ar.numberInSurah}`,
            subtitle: translation,
            payload: { surahId, ayahNum: verse.ar.numberInSurah, translationId: translation },
            timestamp: Date.now()
        });
        setBookmarksState(prev => ({ ...prev, [id]: isB }));
    };

    useEffect(() => {
        setLoading(true);
        fetchSurahDetails(surahId, translation)
            .then(data => {
                const arabic = data[0].ayahs;
                const tran = data[1].ayahs;
                const audio = data[2].ayahs; // The `ar.alafasy` edition
                const merged = arabic.map((ayah: any, i: number) => ({
                    ar: ayah,
                    en: tran[i],
                    audio: audio[i].audio
                }));
                setVerses(merged);
                
                // Track automatically when they open it
                if (merged.length > 0) {
                   saveLastQuranRead(surahId, resumedAyah || 1, surahTitle);
                   localStorage.setItem('guest_quran_history', JSON.stringify({ surah: surahId, ayah: resumedAyah || 1, name: surahTitle }));
                   
                   // Update daily progress for reading Quran
                   if (auth.currentUser) {
                       updateDailyProgress('quran', 100).catch(console.error);
                   } else {
                       let lp = {"salat": 0, "quran": 0, "tasbih": 0, "total": 0};
                       try {
                           const savedLp = localStorage.getItem('guest_progress');
                           if (savedLp) lp = JSON.parse(savedLp);
                       } catch(e) {}
                       lp.quran = 100;
                       lp.total = Math.floor((lp.salat + lp.quran + lp.tasbih)/3);
                       localStorage.setItem('guest_progress', JSON.stringify(lp));
                   }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [surahId, translation, resumedAyah, surahTitle]);

    useEffect(() => {
        if (!loading && verses.length > 0 && resumedAyah) {
             const timer = setTimeout(() => {
                 const el = document.getElementById(`ayah-${resumedAyah}`);
                 if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      // Optional: briefly highlight it
                      el.classList.add('ring-2', 'ring-accent', 'transition-all');
                      setTimeout(() => el.classList.remove('ring-2', 'ring-accent', 'transition-all'), 2000);
                 }
             }, 100);
             return () => clearTimeout(timer);
        }
    }, [loading, verses, resumedAyah]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        }
    }, [])

    const speakTranslationFallback = (text: string, langCodeMatch: string, onEnd: () => void) => {
        let cleanText = text.replace(/[\(\)\[\]\{\}\<\>]/g, ' ').replace(/[\n\r]/g, ' ').trim();
        
        if (cleanText.length > 180) {
            cleanText = cleanText.substring(0, 180);
            const lastSpace = Math.max(cleanText.lastIndexOf(' '), cleanText.lastIndexOf('।'));
            if (lastSpace > 0) {
                cleanText = cleanText.substring(0, lastSpace);
            }
        }

        const encodedText = encodeURIComponent(cleanText);
        
        const fallbackAudio = new Audio(`https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=${langCodeMatch}&q=${encodedText}`);
        
        let ended = false;
        const handleEnd = () => {
            if (!ended) {
                ended = true;
                onEnd();
            }
        };

        fallbackAudio.onended = handleEnd;
        fallbackAudio.onerror = (e) => {
            handleEnd(); 
        };
        
        audioRef.current = fallbackAudio; 

        const playPromise = fallbackAudio.play();
        if (playPromise !== undefined) {
             playPromise.catch((e) => {
                  if (e.name !== 'AbortError') {
                       handleEnd();
                  }
             });
        }
    };

    const speakTranslation = (text: string, lang: string, onEnd: () => void) => {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        const langCodeMatch = lang.split('.')[0];

        const langMap: Record<string, string> = {
            'bn': 'bn-BD', 
            'ur': 'ur-PK', 
            'hi': 'hi-IN', 
            'en': 'en-US', 
            'fr': 'fr-FR',
            'es': 'es-ES', 
            'ru': 'ru-RU', 
            'id': 'id-ID',
            'tr': 'tr-TR', 
            'de': 'de-DE', 
            'zh': 'zh-CN', 
        };
        
        const targetLang = langMap[langCodeMatch] || langCodeMatch || 'en-US';
        utterance.lang = targetLang;
        
        const voices = window.speechSynthesis.getVoices();
        const matchedVoice = voices.find(v => v.lang.startsWith(targetLang) || v.lang.startsWith(langCodeMatch));
        
        if (matchedVoice) {
            utterance.voice = matchedVoice;
        }

        utterance.rate = 0.85;
        utterance.onend = onEnd;
        utterance.onerror = (e) => {
            console.error("Native TTS error, attempting fallback URL audio...", e);
            speakTranslationFallback(text, langCodeMatch, onEnd);
        };

        const hasAnyMatchingVoice = voices.some(v => v.lang.startsWith(targetLang.split('-')[0]));
        
        if (voices.length > 0 && !hasAnyMatchingVoice && langCodeMatch !== 'en') {
             console.log("No native voice installed for this language, using Fallback API...");
             speakTranslationFallback(text, langCodeMatch, onEnd);
             return;
        }

        window.speechSynthesis.speak(utterance);
    };

    const togglePlay = (index: number) => {
        // Log history point
        const currentAyah = verses[index]?.ar?.numberInSurah || 1;
        saveLastQuranRead(surahId, currentAyah, surahTitle);
        localStorage.setItem('guest_quran_history', JSON.stringify({ surah: surahId, ayah: currentAyah, name: surahTitle }));

        const warmup = new SpeechSynthesisUtterance('');
        warmup.volume = 0;
        window.speechSynthesis.speak(warmup);

        if (playingIndex === index) {
            if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
                setPlayingIndex(null);
            } else if (audioRef.current) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        if (e.name !== 'AbortError') console.error('Play interrupted', e);
                    });
                }
            } else {
                 window.speechSynthesis.cancel();
                 setPlayingIndex(null);
            }
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }
        window.speechSynthesis.cancel();

        const url = verses[index]?.audio;
        if (url) {
            const newAudio = new Audio(url);
            newAudio.onended = () => {
                const translatedText = verses[index].en.text;
                const cleanText = translatedText.replace(/<[^>]*>?/gm, '');
                
                speakTranslation(cleanText, translation, () => {
                     if (index + 1 < verses.length) {
                         togglePlay(index + 1);
                     } else {
                         setPlayingIndex(null);
                     }
                });
            };
            audioRef.current = newAudio;
            const playPromise = newAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    if (e.name !== 'AbortError') console.error('Initial Arabic play failed', e);
                });
            }
            setPlayingIndex(index);
        }
    }

    return (
        <div className="flex flex-col h-full bg-bg-base absolute inset-0 z-20">
            <div className="pt-12 pb-4 px-4 bg-header-bg sticky top-0 z-30 flex items-center justify-center relative border-b border-border-main">
                <button onClick={onBack} className="absolute left-4 top-12 p-2 -ml-2 text-text-muted hover:text-text-main hover:bg-bg-panel rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="font-serif italic text-xl text-text-main">{surahTitle}</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8 pb-32">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-48 space-y-4">
                        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-text-muted font-medium">Loading Verses...</p>
                    </div>
                ) : (
                    verses.map((verse, index) => (
                        <div key={verse.ar.numberInSurah} className={cn("bg-bg-panel rounded-3xl p-6 border border-border-main flex flex-col gap-6", playingIndex === index ? "border-accent/50 shadow-[0_0_15px_rgba(212,175,55,0.1)]" : "")} id={`ayah-${verse.ar.numberInSurah}`}>
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center bg-header-bg rounded-xl px-3 py-1 font-mono text-[10px] font-bold text-accent tracking-widest uppercase border border-border-main">
                                        {surahId}:{verse.ar.numberInSurah}
                                    </div>
                                    <button 
                                        onClick={() => togglePlay(index)} 
                                        className={cn(
                                            "p-2 rounded-full transition-colors border",
                                            playingIndex === index ? "bg-accent text-accent-fg border-accent" : "bg-header-bg text-accent border-border-main hover:border-accent/50"
                                        )}
                                    >
                                        {playingIndex === index ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                    </button>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <button 
                                        onClick={() => handleBookmark(verse)}
                                        className="text-text-muted hover:text-accent transition-colors"
                                    >
                                        {bookmarksState[`quran-${surahId}-${verse.ar.numberInSurah}`] ? <BookmarkCheck className="w-5 h-5 text-accent" /> : <Bookmark className="w-5 h-5" />}
                                    </button>
                                    {playingIndex === index && <Volume2 className="w-5 h-5 text-accent animate-pulse" />}
                                </div>
                            </div>
                            <p className="font-arabic text-3xl leading-loose text-right text-text-main notranslate" dir="rtl" translate="no">{verse.ar.text}</p>
                            <div className="w-full h-px bg-[#1F2937] mt-2 mb-2"></div>
                            <p className="text-text-muted text-[15px] leading-relaxed">{verse.en.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
