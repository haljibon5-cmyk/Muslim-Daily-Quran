export const fetchPrayerTimes = async (lat: number, lng: number) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const response = await fetch(
    `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=2`
  );
  if (!response.ok) throw new Error('Failed to fetch prayer times');
  const data = await response.json();
  return data.data;
};

export const fetchSurahs = async () => {
  const response = await fetch('https://api.alquran.cloud/v1/surah');
  if (!response.ok) throw new Error('Failed to fetch surahs');
  const data = await response.json();
  return data.data;
};

export const fetchEditions = async () => {
  const response = await fetch('https://api.alquran.cloud/v1/edition?format=text&type=translation');
  if (!response.ok) throw new Error('Failed to fetch editions');
  const data = await response.json();
  return data.data;
}

export const fetchSurahDetails = async (id: number, translation: string = 'en.asad') => {
  const response = await fetch(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,${translation},ar.alafasy`);
  if (!response.ok) throw new Error('Failed to fetch surah details');
  const data = await response.json();
  return data.data; // Array of 3 editions (0: arabic, 1: translation, 2: audio)
};
