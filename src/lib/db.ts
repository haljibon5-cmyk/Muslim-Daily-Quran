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
    if (!auth.currentUser) return null;
    const today = getTodayId();
    const ref = doc(db, 'users', auth.currentUser.uid, 'progress', today);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : { salatCompletion: 0, quranCompletion: 0, tasbihCompletion: 0, totalCompletion: 0 };
};

export const updateDailyProgress = async (type: 'salat' | 'quran' | 'tasbih', percentage: number) => {
    if (!auth.currentUser) return;
    const today = getTodayId();
    const ref = doc(db, 'users', auth.currentUser.uid, 'progress', today);
    
    // First get existing to calculate total
    const snap = await getDoc(ref);
    let pd = snap.exists() ? snap.data() : { salatCompletion: 0, quranCompletion: 0, tasbihCompletion: 0 };
    
    // update specific metric
    if (type === 'salat') pd.salatCompletion = percentage;
    if (type === 'quran') pd.quranCompletion = percentage;
    if (type === 'tasbih') pd.tasbihCompletion = percentage;
    
    // calculate average/total
    const total = Math.floor((pd.salatCompletion + pd.quranCompletion + pd.tasbihCompletion) / 3);
    
    await setDoc(ref, {
        date: today,
        ...pd,
        totalCompletion: total,
        updatedAt: new Date()
    }, { merge: true });
};
