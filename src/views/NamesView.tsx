import React, { useEffect, useState } from 'react';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { cn } from '../lib/utils';

// Sample of 99 names (can pull from a JSON if we import one, but I'll provide a few and expand if needed. 
// A static array of all 99 names would be long, so I'll put a complete list but abbreviated here to save space or just full list)
const ALLAH_NAMES = [
  { "number": 1, "name": "Ar-Rahman", "arabic": "الرَّحْمَنُ", "meaning": "The Beneficent" },
  { "number": 2, "name": "Ar-Raheem", "arabic": "الرَّحِيمُ", "meaning": "The Merciful" },
  { "number": 3, "name": "Al-Malik", "arabic": "الْمَلِكُ", "meaning": "The King" },
  { "number": 4, "name": "Al-Quddus", "arabic": "الْقُدُّوسُ", "meaning": "The Most Sacred" },
  { "number": 5, "name": "As-Salam", "arabic": "السَّلَامُ", "meaning": "The Source of Peace" },
  { "number": 6, "name": "Al-Mu'min", "arabic": "الْمُؤْمِنُ", "meaning": "The Infuser of Faith" },
  { "number": 7, "name": "Al-Muhaymin", "arabic": "الْمُهَيْمِنُ", "meaning": "The Preserver of Safety" },
  { "number": 8, "name": "Al-Aziz", "arabic": "الْعَزِيزُ", "meaning": "The All Mighty" },
  { "number": 9, "name": "Al-Jabbar", "arabic": "الْجَبَّارُ", "meaning": "The Compeller" },
  { "number": 10, "name": "Al-Mutakabbir", "arabic": "الْمُتَكَبِّرُ", "meaning": "The Supreme, The Majestic" },
  { "number": 11, "name": "Al-Khaliq", "arabic": "الْخَالِقُ", "meaning": "The Creator" },
  { "number": 12, "name": "Al-Bari", "arabic": "الْبَارِئُ", "meaning": "The Evolver" },
  { "number": 13, "name": "Al-Musawwir", "arabic": "الْمُصَوِّرُ", "meaning": "The Fashioner" },
  { "number": 14, "name": "Al-Ghaffar", "arabic": "الْغَفَّارُ", "meaning": "The Constant Forgiver" },
  { "number": 15, "name": "Al-Qahhar", "arabic": "الْقَهَّارُ", "meaning": "The All-Prevailing One" },
  { "number": 16, "name": "Al-Wahhab", "arabic": "الْوَهَّابُ", "meaning": "The Supreme Bestower" },
  { "number": 17, "name": "Ar-Razzaq", "arabic": "الرَّزَّاقُ", "meaning": "The Provider" },
  { "number": 18, "name": "Al-Fattah", "arabic": "الْفَتَّاحُ", "meaning": "The Supreme Solver" },
  { "number": 19, "name": "Al-'Alim", "arabic": "الْعَلِيمُ", "meaning": "The All-Knowing One" },
  { "number": 20, "name": "Al-Qabid", "arabic": "الْقَابِضُ", "meaning": "The Withholder" },
  { "number": 21, "name": "Al-Basit", "arabic": "الْبَاسِطُ", "meaning": "The Extender" },
  { "number": 22, "name": "Al-Khafid", "arabic": "الْخَافِضُ", "meaning": "The Reducer" },
  { "number": 23, "name": "Ar-Rafi", "arabic": "الرَّافِعُ", "meaning": "The Exalter" },
  { "number": 24, "name": "Al-Mu'izz", "arabic": "الْمُعِزُّ", "meaning": "The Honourer" },
  { "number": 25, "name": "Al-Mudhill", "arabic": "الْمُذِلُّ", "meaning": "The Dishonourer" },
  { "number": 26, "name": "As-Sami'", "arabic": "السَّمِيعُ", "meaning": "The All-Hearing" },
  { "number": 27, "name": "Al-Basir", "arabic": "الْبَصِيرُ", "meaning": "The All-Seeing" },
  { "number": 28, "name": "Al-Hakam", "arabic": "الْحَكَمُ", "meaning": "The Impartial Judge" },
  { "number": 29, "name": "Al-'Adl", "arabic": "الْعَدْلُ", "meaning": "The Embodiment of Justice" },
  { "number": 30, "name": "Al-Latif", "arabic": "اللَّطِيفُ", "meaning": "The Knower of Subtleties" },
  { "number": 31, "name": "Al-Khabir", "arabic": "الْخَبِيرُ", "meaning": "The All-Aware" },
  { "number": 32, "name": "Al-Halim", "arabic": "الْحَلِيمُ", "meaning": "The Clement One" },
  { "number": 33, "name": "Al-Azim", "arabic": "الْعَظِيمُ", "meaning": "The Magnificent" },
  { "number": 34, "name": "Al-Ghafur", "arabic": "الْغَفُورُ", "meaning": "The Great Forgiver" },
  { "number": 35, "name": "Ash-Shakur", "arabic": "الشَّكُورُ", "meaning": "The Acknowledging One" },
  { "number": 36, "name": "Al-'Aliyy", "arabic": "الْعَلِيُّ", "meaning": "The Sublime One" },
  { "number": 37, "name": "Al-Kabir", "arabic": "الْكَبِيرُ", "meaning": "The Great One" },
  { "number": 38, "name": "Al-Hafiz", "arabic": "الْحَفِيظُ", "meaning": "The Preserving One" },
  { "number": 39, "name": "Al-Muqit", "arabic": "الْمُقِيتُ", "meaning": "The Sustainer" },
  { "number": 40, "name": "Al-Hasib", "arabic": "الْحَسِيبُ", "meaning": "The Reckoner" },
  { "number": 41, "name": "Al-Jalil", "arabic": "الْجَلِيلُ", "meaning": "The Majestic One" },
  { "number": 42, "name": "Al-Karim", "arabic": "الْكَرِيمُ", "meaning": "The Bountiful One" },
  { "number": 43, "name": "Ar-Raqib", "arabic": "الرَّقِيبُ", "meaning": "The Watchful One" },
  { "number": 44, "name": "Al-Mujib", "arabic": "الْمُجِيبُ", "meaning": "The Responding One" },
  { "number": 45, "name": "Al-Wasi'", "arabic": "الْوَاسِعُ", "meaning": "The All-Encompassing" },
  { "number": 46, "name": "Al-Hakim", "arabic": "الْحَكِيمُ", "meaning": "The Wise One" },
  { "number": 47, "name": "Al-Wadud", "arabic": "الْوَدُودُ", "meaning": "The Loving One" },
  { "number": 48, "name": "Al-Majid", "arabic": "الْمَجِيدُ", "meaning": "The Glorious One" },
  { "number": 49, "name": "Al-Ba'ith", "arabic": "الْبَاعِثُ", "meaning": "The Resurrector" },
  { "number": 50, "name": "Ash-Shahid", "arabic": "الشَّهِيدُ", "meaning": "The Witness" },
  { "number": 51, "name": "Al-Haqq", "arabic": "الْحَقُّ", "meaning": "The Truth" },
  { "number": 52, "name": "Al-Wakil", "arabic": "الْوَكِيلُ", "meaning": "The Trustee" },
  { "number": 53, "name": "Al-Qawiyy", "arabic": "الْقَوِيُّ", "meaning": "The Possessor of All Strength" },
  { "number": 54, "name": "Al-Matin", "arabic": "الْمَتِينُ", "meaning": "The Forceful One" },
  { "number": 55, "name": "Al-Waliyy", "arabic": "الْوَلِيُّ", "meaning": "The Protecting Friend" },
  { "number": 56, "name": "Al-Hamid", "arabic": "الْحَمِيدُ", "meaning": "The Praised One" },
  { "number": 57, "name": "Al-Muhsi", "arabic": "الْمُحْصِي", "meaning": "The All-Enumerating One" },
  { "number": 58, "name": "Al-Mubdi", "arabic": "الْمُبْدِئُ", "meaning": "The Originator" },
  { "number": 59, "name": "Al-Mu'id", "arabic": "الْمُعِيدُ", "meaning": "The Restorer" },
  { "number": 60, "name": "Al-Muhyi", "arabic": "الْمُحْيِي", "meaning": "The Giver of Life" },
  { "number": 61, "name": "Al-Mumit", "arabic": "الْمُمِيتُ", "meaning": "The Creator of Death" },
  { "number": 62, "name": "Al-Hayy", "arabic": "الْحَيُّ", "meaning": "The Ever Living One" },
  { "number": 63, "name": "Al-Qayyum", "arabic": "الْقَيُّومُ", "meaning": "The Self-Existing One" },
  { "number": 64, "name": "Al-Wajid", "arabic": "الْوَاجِدُ", "meaning": "The Finder" },
  { "number": 65, "name": "Al-Majid", "arabic": "الْمَاجِدُ", "meaning": "The Noble" },
  { "number": 66, "name": "Al-Wahid", "arabic": "الْوَاحِدُ", "meaning": "The Unique" },
  { "number": 67, "name": "Al-Ahad", "arabic": "الْأَحَد", "meaning": "The One" },
  { "number": 68, "name": "As-Samad", "arabic": "الصَّمَدُ", "meaning": "The Eternal" },
  { "number": 69, "name": "Al-Qadir", "arabic": "الْقَادِرُ", "meaning": "The All-Powerful" },
  { "number": 70, "name": "Al-Muqtadir", "arabic": "الْمُقْتَدِرُ", "meaning": "The Creator of All Power" },
  { "number": 71, "name": "Al-Muqaddim", "arabic": "الْمُقَدِّمُ", "meaning": "The Expediter" },
  { "number": 72, "name": "Al-Mu'akhkhir", "arabic": "الْمُؤَخِّرُ", "meaning": "The Delayer" },
  { "number": 73, "name": "Al-Awwal", "arabic": "الْأَوَّلُ", "meaning": "The First" },
  { "number": 74, "name": "Al-Akhir", "arabic": "الْآخِرُ", "meaning": "The Last" },
  { "number": 75, "name": "Az-Zahir", "arabic": "الظَّاهِرُ", "meaning": "The Manifest One" },
  { "number": 76, "name": "Al-Batin", "arabic": "الْبَاطِنُ", "meaning": "The Hidden One" },
  { "number": 77, "name": "Al-Wali", "arabic": "الْوَالِي", "meaning": "The Protecting Friend" },
  { "number": 78, "name": "Al-Muta'ali", "arabic": "الْمُتَعَالِي", "meaning": "The Supreme One" },
  { "number": 79, "name": "Al-Barr", "arabic": "الْبَرُّ", "meaning": "The Doer of Good" },
  { "number": 80, "name": "At-Tawwab", "arabic": "التَّوَّابُ", "meaning": "The Guide to Repentance" },
  { "number": 81, "name": "Al-Muntaqim", "arabic": "الْمُنْتَقِمُ", "meaning": "The Avenger" },
  { "number": 82, "name": "Al-Afuww", "arabic": "الْعَفُوُّ", "meaning": "The Forgiver" },
  { "number": 83, "name": "Ar-Ra'uf", "arabic": "الرَّؤُوفُ", "meaning": "The Clement" },
  { "number": 84, "name": "Malik-ul-Mulk", "arabic": "مَالِكُ الْمُلْكِ", "meaning": "The Owner of All" },
  { "number": 85, "name": "Dhu-al-Jalal wa-al-Ikram", "arabic": "ذُو الْجَلَالِ وَالْإِكْرَامِ", "meaning": "The Lord of Majesty and Bounty" },
  { "number": 86, "name": "Al-Muqsit", "arabic": "الْمُقْسِطُ", "meaning": "The Equitable One" },
  { "number": 87, "name": "Al-Jami'", "arabic": "الْجَامِعُ", "meaning": "The Gatherer" },
  { "number": 88, "name": "Al-Ghaniyy", "arabic": "الْغَنِيُّ", "meaning": "The Rich One" },
  { "number": 89, "name": "Al-Mughni", "arabic": "الْمُغْنِي", "meaning": "The Enricher" },
  { "number": 90, "name": "Al-Mani'", "arabic": "الْمَانِعُ", "meaning": "The Preventer of Harm" },
  { "number": 91, "name": "Ad-Darr", "arabic": "الضَّارُ", "meaning": "The Creator of The Harmful" },
  { "number": 92, "name": "An-Nafi'", "arabic": "النَّافِعُ", "meaning": "The Creator of Good" },
  { "number": 93, "name": "An-Nur", "arabic": "النُّورُ", "meaning": "The Light" },
  { "number": 94, "name": "Al-Hadi", "arabic": "الْهَادِي", "meaning": "The Guide" },
  { "number": 95, "name": "Al-Badi", "arabic": "الْبَدِيعُ", "meaning": "The Incomparable" },
  { "number": 96, "name": "Al-Baqi", "arabic": "الْبَاقِي", "meaning": "The Everlasting One" },
  { "number": 97, "name": "Al-Warith", "arabic": "الْوَارِثُ", "meaning": "The Inheritor of All" },
  { "number": 98, "name": "Ar-Rashid", "arabic": "الرَّشِيدُ", "meaning": "The Righteous Teacher" },
  { "number": 99, "name": "As-Sabur", "arabic": "الصَّبُورُ", "meaning": "The Patient One" }
];

export default function NamesView({ onBack }: { onBack: () => void }) {
    return (
        <div className="flex flex-col h-full bg-bg-base relative pt-12 pb-24 px-5 overflow-y-auto no-scrollbar font-sans text-text-main animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-4 sticky top-0 bg-bg-base/90 backdrop-blur-sm z-10 py-2 -mx-5 px-5">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold font-serif italic text-accent">99 Names of ALLAH</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {ALLAH_NAMES.map((n) => (
                    <div key={n.number} className="bg-bg-panel border border-border-main p-4 rounded-2xl shadow-sm text-center flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center shrink-0 mx-auto -mt-8 shadow-md">
                            {n.number}
                        </div>
                        <h2 className="text-3xl font-bold font-serif text-accent my-2 leading-relaxed notranslate" style={{ fontFamily: '"Noto Naskh Arabic", serif' }} translate="no">
                            {n.arabic}
                        </h2>
                        <h3 className="font-bold text-lg">{n.name}</h3>
                        <p className="text-sm text-text-muted">{n.meaning}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
