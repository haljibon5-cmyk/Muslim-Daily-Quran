import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Sunrise, Home, Coffee, Moon, Briefcase, 
  Plane, Handshake, Heart, Activity, BookOpen, Droplets, 
  Shield, MoonStar, Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { duasData, languages, Language } from '../data/duas';

// Mock data for categories
const categories = [
  { id: 'morning', name: 'Morning &\nEvening', icon: Sunrise },
  { id: 'home', name: 'Home &\nFamily', icon: Home },
  { id: 'food', name: 'Food &\nDrinks', icon: Coffee },
  { id: 'sleep', name: 'Sleep', icon: Moon },
  { id: 'rizq', name: 'Rizq', icon: Briefcase },
  { id: 'travel', name: 'Travel', icon: Plane },
  { id: 'social', name: 'Social\nManners', icon: Handshake },
  { id: 'gratitude', name: 'Gratitude\nRepentance', icon: Heart },
  { id: 'illness', name: 'Illness\nDeath', icon: Activity },
  { id: 'salah', name: 'Salah', icon: Sunrise }, 
  { id: 'quranic', name: 'Quranic', icon: BookOpen },
  { id: 'purification', name: 'Purification', icon: Droplets },
  { id: 'refuge', name: 'Seeking\nRefuge', icon: Shield },
  { id: 'ramadan', name: 'Ramadan\nFasting', icon: MoonStar },
  { id: 'hajj', name: 'Hajj &\nUmrah', icon: BookOpen }, 
];

export default function DuaView({ onBack }: { onBack?: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>('en');

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-base text-text-main animate-fade-in w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center p-4 sticky top-0 bg-bg-base z-10 shadow-sm">
        <button onClick={handleBack} className="p-2 mr-2 hover:bg-black/5 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <h1 className="text-xl font-bold">{selectedCategory ? categories.find(c => c.id === selectedCategory)?.name.replace('\n', ' ') : 'Dua'}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar">
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
                <motion.div
                    key="categories"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    {/* Hero Section */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900 to-teal-700 shadow-xl p-6 text-center text-white">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                        <div className="relative z-10">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-teal-200 mb-4">POWERFUL DUA</h2>
                            <p className="text-2xl font-arabic leading-relaxed mb-4 notranslate" dir="rtl" translate="no">
                                وَمَن يُطِعِ اللَّهَ وَالرَّسُولَ فَأُولَئِكَ مَعَ الَّذِينَ
                            </p>
                            <p className="text-sm font-medium mb-2">
                                And whoever obeys Allah and the Apostle, these are with those.
                            </p>
                            <p className="text-xs text-teal-300">Surah Nisa 4:69</p>
                        </div>
                    </div>

                    {/* Categories Section */}
                    <div className="pb-16">
                        <h3 className="text-lg font-bold mb-4 flex items-center justify-center gap-2">
                            <span className="text-accent text-xl">❦</span> All Categories Dua
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {categories.map((category, index) => {
                                const Icon = category.icon;
                                return (
                                    <motion.button
                                        key={category.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className="bg-white dark:bg-card-bg border border-border-color rounded-2xl p-3 flex flex-col items-center justify-center gap-2 aspect-square hover:border-accent hover:shadow-md transition-all group"
                                    >
                                        <div className="text-accent group-hover:scale-110 transition-transform">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-medium text-center whitespace-pre-line text-text-muted group-hover:text-accent transition-colors leading-tight">
                                            {category.name}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="duas"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                >
                    {duasData[selectedCategory] ? (
                        duasData[selectedCategory].map((dua, index) => (
                             <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-card-bg border border-border-color rounded-2xl p-5 shadow-sm space-y-4"
                            >
                                <div className="border-b border-border-color pb-3">
                                    <h3 className="font-bold text-accent">{dua.title[currentLang]}</h3>
                                </div>
                                
                                <div className="text-right">
                                    <p className="font-arabic text-2xl leading-loose text-text-main notranslate" dir="rtl" translate="no">
                                        {dua.arabic}
                                    </p>
                                </div>
                                
                                <div className="space-y-2 bg-bg-base p-4 rounded-xl">
                                    <p className="text-sm font-medium text-accent">
                                        {dua.transliteration}
                                    </p>
                                    <p className="text-sm text-text-main italic border-t border-border-color pt-2 mt-2">
                                        "{dua.translation[currentLang]}"
                                    </p>
                                    <p className="text-xs font-semibold text-text-muted">
                                        Reference: {dua.reference}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                         <div className="text-center py-10 text-text-muted">
                             <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                             <p>Duas for this category will be added soon.</p>
                         </div>
                    )}
                </motion.div>
            )}
          </AnimatePresence>
      </div>
      <AnimatePresence>
        {!selectedCategory && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-24 left-0 right-0 px-4 z-20 flex justify-center"
          >
            <div className="bg-white dark:bg-card-bg shadow-lg border border-border-color rounded-full px-4 py-2 flex items-center gap-3">
              <Globe className="w-4 h-4 text-accent" />
              <select 
                value={currentLang} 
                onChange={(e) => setCurrentLang(e.target.value as Language)}
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer pr-4 appearance-none text-text-main"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-black dark:text-black">
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
