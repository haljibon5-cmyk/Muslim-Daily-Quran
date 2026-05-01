import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

// Helper to get today's date ID (YYYY-MM-DD)
export const getTodayId = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// -- History Save Functions --

export const saveLastQuranRead = async (surahNum: number, ayahNum: number, surahName: string) => {
    if (!auth.currentUser) return;
    const ref = doc(db, 'users', auth.currentUser.uid, 'history', 'main');
    await setDoc(ref, {
        lastQuranSurah: surahNum,
        lastQuranAyah: ayahNum,
        lastQuranSurahName: surahName,
        lastQuranTimestamp: new Date(),
        updatedAt: new Date()
    }, { merge: true });
};

export const saveLastHadithRead = async (collection: string, number: number, book: string) => {
    if (!auth.currentUser) return;
    const ref = doc(db, 'users', auth.currentUser.uid, 'history', 'main');
    await setDoc(ref, {
        lastHadithCollection: collection,
        lastHadithNumber: number,
        lastHadithBook: book,
        lastHadithTimestamp: new Date(),
        updatedAt: new Date()
    }, { merge: true });
};

export const saveLastTasbih = async (target: number, current: number, name: string) => {
    if (!auth.currentUser) return;
    const ref = doc(db, 'users', auth.currentUser.uid, 'history', 'main');
    await setDoc(ref, {
        lastTasbihTarget: target,
        lastTasbihCurrent: current,
        lastTasbihName: name,
        updatedAt: new Date()
    }, { merge: true });
};

export const getHistory = async () => {
    if (!auth.currentUser) return null;
    const ref = doc(db, 'users', auth.currentUser.uid, 'history', 'main');
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
};

// -- Progress Save Functions --

export const getDailyProgress = async () => {
    const today = getTodayId();
    let localData = { salatCompletion: 0, quranCompletion: 0, tasbihCompletion: 0, totalCompletion: 0 };
    
    try {
        // Clean up old daily progress keys
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('daily_progress_') && key !== `daily_progress_${today}`) {
                localStorage.removeItem(key);
            }
        }

        const stored = localStorage.getItem(`daily_progress_${today}`);
        if (stored) localData = JSON.parse(stored);
    } catch(e) {}

    return localData;
};

export const updateDailyProgress = async (type: 'salat' | 'quran' | 'tasbih', percentage: number, incremental: boolean = false) => {
    const today = getTodayId();
    let currentData: any = { salatCompletion: 0, quranCompletion: 0, tasbihCompletion: 0 };
    
    // Get existing from local
    try {
        const stored = localStorage.getItem(`daily_progress_${today}`);
        if (stored) currentData = JSON.parse(stored);
    } catch(e) {}

    // update specific metric
    const fieldMap: Record<string, string> = {
        'salat': 'salatCompletion',
        'quran': 'quranCompletion',
        'tasbih': 'tasbihCompletion'
    };
    const field = fieldMap[type];
    
    if (incremental) {
        currentData[field] = Math.min(100, (currentData[field] || 0) + percentage);
    } else {
        currentData[field] = Math.min(100, percentage);
    }
    
    // calculate average/total
    const total = Math.floor(((currentData.salatCompletion || 0) + (currentData.quranCompletion || 0) + (currentData.tasbihCompletion || 0)) / 3);
    
    const finalData = {
        ...currentData,
        date: today,
        totalCompletion: total,
    };
    
    // Save to local
    localStorage.setItem(`daily_progress_${today}`, JSON.stringify(finalData));
};
