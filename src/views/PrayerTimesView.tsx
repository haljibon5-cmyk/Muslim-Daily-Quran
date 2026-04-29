import React, { useEffect, useState } from 'react';
import { format, isAfter, parse } from 'date-fns';
import { Compass, Sunrise, Sunset, Moon, Cloud, Sun, CloudRain, ArrowLeft, Settings, Menu, BellOff, Bell } from 'lucide-react';
import { fetchPrayerTimes } from '../services/api';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const getMoonPhase = (date: Date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 3) { year--; month += 12; }
  let a = Math.floor(year / 100);
  let b = Math.floor(a / 4);
  let c = 2 - a + b;
  let e = Math.floor(365.25 * (year + 4716));
  let f = Math.floor(30.6001 * (month + 1));
  let jd = c + day + e + f - 1524.5;
  let daysSinceNew = jd - 2451549.5;
  let newMoons = daysSinceNew / 29.53;
  let phase = newMoons - Math.floor(newMoons);
  let age = phase * 29.53;
  let illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100;
  return { age: Math.round(age), illumination: Math.round(illumination) };
};

const getWeatherIcon = (code: number, className: string = "w-6 h-6") => {
    // WMO Weather interpretation codes
    if (code === 0) return <Sun className={cn(className, "text-[#f0ba32]")} />;
    if (code > 0 && code < 4) return <Cloud className={cn(className, "text-[#54b9d0]")} />;
    if (code >= 51 && code <= 67) return <CloudRain className={cn(className, "text-[#54b9d0]")} />;
    return <Cloud className={cn(className, "text-[#54b9d0]")} />;
};

const getWeatherDesc = (code: number) => {
    if (code === 0) return 'Clear sky';
    if (code === 1 || code === 2) return 'Partly Cloudy';
    if (code === 3) return 'Overcast';
    if (code >= 51 && code <= 67) return 'Rain';
    return 'Cloudy';
};

export default function PrayerTimesView({ location, locationName, locError, onNavigate, onBack }: { location: { lat: number, lng: number } | null, locationName?: string, locError: string | null, onNavigate?: (tab: 'home'|'quran'|'qibla'|'settings') => void, onBack?: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [nextPrayer, setNextPrayer] = useState<{name: string, time: string, remaining: string} | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<any>(null);
  const [alarms, setAlarms] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('prayer_alarms');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return { Fajr: true, Sunrise: false, Dhuhr: true, Asr: true, Maghrib: true, Isha: true };
  });

  const toggleAlarm = (prayerName: string) => {
    setAlarms(prev => {
      const next = { ...prev, [prayerName]: !prev[prayerName] };
      try {
        localStorage.setItem('prayer_alarms', JSON.stringify(next));
      } catch(e) {}
      return next;
    });
  };
  
  const moonInfo = getMoonPhase(new Date());

  useEffect(() => {
    if (location) {
      setLoading(true);
      fetchPrayerTimes(location.lat, location.lng)
        .then(res => {
          setData(res);
        })
        .finally(() => setLoading(false));

      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`)
        .then(res => res.json())
        .then(data => setWeather(data))
        .catch(() => {});
    }
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      if (data) {
        calculateNextPrayer(data.timings);
      }
    }, 1000);
    
    if (data) calculateNextPrayer(data.timings);

    return () => clearInterval(interval);
  }, [data]);

  const calculateNextPrayer = (timings: any) => {
    const prayers = [
      { name: 'Fajr', key: 'Fajr' },
      { name: 'Sunrise', key: 'Sunrise' },
      { name: 'Dhuhr', key: 'Dhuhr' },
      { name: 'Asr', key: 'Asr' },
      { name: 'Maghrib', key: 'Maghrib' },
      { name: 'Isha', key: 'Isha' },
    ];

    const now = new Date();
    let next = null;

    for (let i = 0; i < prayers.length; i++) {
        const timeStr = timings[prayers[i].key];
        const prayerTime = parse(timeStr, 'HH:mm', new Date());
        
        if (isAfter(prayerTime, now)) {
            next = { ...prayers[i], time: timeStr };
            break;
        }
    }

    if (!next) {
        next = { name: 'Fajr', time: timings.Fajr }; 
    }

    if (next) {
        const nextTime = parse(next.time, 'HH:mm', new Date());
        let diff = nextTime.getTime() - now.getTime();
        if (diff < 0) {
           diff += 24 * 60 * 60 * 1000;
        }
        
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        // As per screenshot layout, if > 1 hr, show hours and mins, else just mins
        let remainingStr = '';
        if (h > 0) remainingStr = `${h}h ${m}m`;
        else remainingStr = `${m} minutes`;

        setNextPrayer({
            name: next.name,
            time: next.time,
            remaining: remainingStr
        });
    }
  };

  const formatAMPM = (timeStr: string) => {
      try {
          const d = parse(timeStr, 'HH:mm', new Date());
          return format(d, 'h:mm a');
      } catch (e) {
          return timeStr;
      }
  };

  const currentHour = format(currentTime, 'hh');
  const currentMinute = format(currentTime, 'mm');
  const currentAmPm = format(currentTime, 'a');

  // Flip Box Component for the clock
  const FlipBox = ({ children }: { children: React.ReactNode }) => (
      <div className="bg-gradient-to-b from-[#2d343b] via-[#21272d] to-[#1a1f26] border border-[#161a20] shadow-[0_4px_6px_rgba(0,0,0,0.3)] rounded flex items-center justify-center relative min-w-[2.75rem] h-[3.5rem] mx-0.5">
          <div className="absolute inset-0 bg-white/5 rounded pointer-events-none"></div>
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/90 shadow-[0_1px_0_rgba(255,255,255,0.15)] z-20"></div>
          <span className="text-4xl font-bold font-sans text-white relative z-10 tracking-tighter drop-shadow-md">{children}</span>
      </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#11161d] text-[#e0e1e3] font-sans relative overflow-x-hidden">
      {/* Background dark diamond/cube pattern */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>

      <div className="relative z-10 px-4 pb-20 pt-6">
          
          {/* Compass & Top Headers */}
          <div className="relative w-full h-[130px] z-20">
              {/* Menu and Settings */}
              <div className="absolute top-0 left-0 w-full flex justify-between items-start">
                  <button onClick={onBack} className="text-[#586470] hover:text-[#e0e1e3] transition-colors p-2 -ml-2">
                      <ArrowLeft className="w-8 h-8" strokeWidth={1.5} />
                  </button>
                  <button onClick={() => onNavigate?.('settings')} className="text-[#586470] hover:text-[#e0e1e3] transition-colors p-2 -mr-2">
                      <Settings className="w-7 h-7" strokeWidth={1.5} />
                  </button>
              </div>

              {/* Time Remaining */}
              <div className="absolute top-11 right-0 text-right z-10 pr-2">
                   <p className="text-[10px] text-[#e0e1e3] font-medium tracking-wide drop-shadow-md">Time Remaining in {nextPrayer?.name || '...'}</p>
                   <p className="text-[15px] font-medium text-[#54b9d0] mt-0.5 drop-shadow-md">{nextPrayer?.remaining || '...'}</p>
              </div>
              
              {/* The Compass */}
              <div className="absolute top-[34px] left-1/2 -translate-x-1/2 w-[108px] h-[108px] rounded-full border-[2px] border-[#13171d] shadow-[0_15px_25px_rgba(0,0,0,0.5)] bg-gradient-to-br from-[#ecc77a] via-[#cfac51] to-[#99732b] flex items-center justify-center p-[4px] z-30">
                  <div className="w-full h-full rounded-full border border-[#fef3c7]/60 flex items-center justify-center bg-[#c9ab57] relative overflow-hidden shadow-inner">
                       <div className="absolute text-[11px] font-bold text-black/60 top-1">N</div>
                       <div className="absolute text-[11px] font-bold text-black/60 bottom-1">S</div>
                       <div className="absolute text-[11px] font-bold text-black/60 left-1.5">W</div>
                       <div className="absolute text-[11px] font-bold text-black/60 right-1.5">E</div>
                       
                       {/* Distressed texture map for compass face */}
                       <div className="w-full h-full absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply rounded-full"></div>
                       {/* Inner ring */}
                       <div className="w-[85%] h-[85%] absolute inset-0 m-auto rounded-full border-[1px] border-black/20 font-serif text-[7px] text-black/40 flex items-center justify-center">
                          {/* Inner dial details */}
                       </div>
                       
                       {/* Needles */}
                       <div className="w-[5px] h-11 bg-gradient-to-t from-[#222] to-[#444] rotate-[-20deg] absolute top-[4px] left-1/2 -ml-[2.5px] drop-shadow-md rounded-t-full" style={{ transformOrigin: 'bottom center' }}></div>
                       <div className="w-[5px] h-11 bg-gradient-to-b from-[#e53935] to-[#b71c1c] rotate-[-20deg] absolute bottom-[4px] left-1/2 -ml-[2.5px] drop-shadow-md rounded-b-full" style={{ transformOrigin: 'top center' }}></div>
                       
                       <div className="w-[8px] h-[8px] border-2 border-[#b71c1c] rounded-full bg-gradient-to-br from-[#ecc77a] to-[#99732b] absolute shadow-md z-10 shadow-black/40"></div>
                  </div>
              </div>
          </div>

          {/* The Custom Cut Card Layer */}
          <div className="relative z-10 -mt-[40px] shadow-2xl filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)]">
              <div className="relative w-full h-[140px] z-10 pointer-events-none">
                  <svg 
                      viewBox="0 0 375 140" 
                      preserveAspectRatio="none" 
                      className="absolute inset-0 w-full h-full"
                  >
                      <defs>
                          <linearGradient id="cardTopGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2c333a" />
                              <stop offset="100%" stopColor="#20252a" />
                          </linearGradient>
                      </defs>
                      <path 
                          d="M1,65 Q1,45 20,45 L115,45 C150,45 155,95 187.5,95 C220,95 225,45 260,45 L355,45 Q374,45 374,65 L374,141 L1,141 Z" 
                          fill="url(#cardTopGrad)" 
                          stroke="#495561"
                          strokeWidth="1.5"
                      />
                  </svg>

                  {/* Weather / Location Content inside top card */}
                  <div className="absolute top-[60px] left-[20px] pointer-events-auto">
                      <div className="text-[34px] font-light text-white flex items-start leading-none tracking-tight">
                          {weather?.current_weather?.temperature ? Math.round(weather.current_weather.temperature) : '--'}
                          <span className="text-[20px] ml-1 mt-[-2px]">°C</span>
                      </div>
                      <div className="text-[11px] text-[#e0e1e3] mt-2 font-medium tracking-wide">
                          Max: {weather?.daily?.temperature_2m_max?.[0] ? Math.round(weather.daily.temperature_2m_max[0]) : '--'}°, Min: {weather?.daily?.temperature_2m_min?.[0] ? Math.round(weather.daily.temperature_2m_min[0]) : '--'}°
                      </div>
                      <div className="text-[13px] font-semibold text-[#f0ba32] mt-1 tracking-wide">
                          {locationName?.split(',')[0] || (data ? data.meta.timezone.split('/')[1]?.replace('_', ' ') : 'Locating...')}
                      </div>
                  </div>

                  <div className="absolute top-[60px] right-[20px] text-right flex flex-col items-end pointer-events-auto">
                      <div className="mb-1 text-[#54b9d0]">
                          {getWeatherIcon((weather?.current_weather?.weathercode ?? -1), "w-8 h-8")}
                      </div>
                      <div className="text-[13px] text-white font-medium tracking-wide">{getWeatherDesc(weather?.current_weather?.weathercode ?? -1)}</div>
                  </div>
              </div>

              {/* Middle of Card */}
              <div className="bg-gradient-to-b from-[#20252a] to-[#12161b] border-x border-[#495561] border-t-0 px-5 pb-6">
                   {/* Flip Clock */}
                   <div className="flex justify-center items-end pt-[2px] mb-4">
                       <div className="flex gap-0.5">
                           <FlipBox>{currentHour.charAt(0)}</FlipBox>
                           <FlipBox>{currentHour.charAt(1)}</FlipBox>
                       </div>
                       <div className="flex gap-0.5 ml-4 pl-0">
                           <FlipBox>{currentMinute.charAt(0)}</FlipBox>
                           <FlipBox>{currentMinute.charAt(1)}</FlipBox>
                       </div>
                       <div className="ml-2 mb-1.5 text-xl font-bold text-[#f0ba32]">
                           {currentAmPm}
                       </div>
                   </div>

                   {/* Date */}
                   <div className="text-center text-[#e0e1e3] text-[13px] uppercase tracking-wider font-semibold mt-6">
                       {format(currentTime, 'EEEE, d MMMM yyyy')}
                   </div>
              </div>

              {/* Bottom Info Bar of Card */}
              <div className="grid grid-cols-4 border border-[#495561] border-t-[#222830] bg-[#12161b] divide-x divide-[#222830] rounded-b-2xl overflow-hidden shadow-2xl relative z-10 w-full ml-0 rtl:mr-0 box-border -mx-[1px]" style={{width: 'calc(100% + 2px)'}}>
                  <BottomInfoBox icon={<Sunrise className="w-[22px] h-[22px] text-[#f0ba32]" />} label="Sunrise" value={data ? formatAMPM(data.timings.Sunrise).toLowerCase() : '--:--'} />
                  <BottomInfoBox icon={<Sunset className="w-[22px] h-[22px] text-[#54b9d0]" />} label="Sunset" value={data ? formatAMPM(data.timings.Sunset).toLowerCase() : '--:--'} />
                  <BottomInfoBox icon={<Moon className="w-[22px] h-[22px] text-[#54b9d0]" />} label="Moon age" value={`${moonInfo.age} days`} />
                  <BottomInfoBox icon={<Moon className="w-[22px] h-[22px] text-[#54b9d0] rotate-[135deg]" />} label="Illumination" value={`${moonInfo.illumination}%`} />
              </div>
          </div>

          {/* Prayers List */}
          <div className="mt-5 bg-gradient-to-b from-[#1b2228] to-[#12161b] rounded-[1.25rem] shadow-[0_10px_20px_rgba(0,0,0,0.6)] border border-[#303841] overflow-hidden divide-y divide-[#1e252e]">
              
              {loading && <p className="text-center text-[#aab2b8] py-8">Loading prayer times...</p>}
              {!loading && !data && !locError && <p className="text-center text-[#aab2b8] py-8">Waiting for location...</p>}
              
              {data && ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayerName) => {
                const time = data.timings[prayerName];
                const isNext = nextPrayer?.name === prayerName;
                
                // Determine icon based on time
                const isNight = prayerName === 'Maghrib' || prayerName === 'Isha';
                const IconComponent = isNight ? Moon : Sun;
                // 'Sunrise' is special, maybe use Sunrise icon
                const RenderIcon = prayerName === 'Sunrise' ? <Sunrise className="w-5 h-5 text-[#f0ba32]" /> : 
                     <IconComponent className={cn("w-5 h-5", isNight ? "text-[#54b9d0]" : "text-[#f0ba32]")} />;
                
                return (
                  <div 
                    key={prayerName}
                    className={cn(
                      "flex items-center justify-between p-[18px] relative transition-all",
                      isNext ? "bg-[#ffffff06]" : ""
                    )}
                  >
                    <div className="flex items-center gap-4 pl-1">
                      {RenderIcon}
                      <span className="text-[17px] tracking-wide text-white font-medium">
                          {prayerName} 
                          {prayerName === 'Fajr' && isNext ? <span className="text-[13px] text-[#aab2b8] font-normal ml-2 tracking-normal">(tomorrow)</span> : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-5 pr-1">
                      <span className="text-[17px] text-white tracking-wide">{formatAMPM(time).toLowerCase()}</span>
                      <button 
                         onClick={() => toggleAlarm(prayerName)}
                         className={cn("transition-colors", alarms[prayerName] ? "text-[#f0ba32]" : "text-[#f0ba32]/40 hover:text-[#f0ba32]/80")}
                      >
                         {alarms[prayerName] ? (
                            <Bell className="w-5 h-5" strokeWidth={2} />
                         ) : (
                            <BellOff className="w-5 h-5" strokeWidth={1.5} />
                         )}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
      </div>
    </div>
  );
}

function BottomInfoBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-3 text-center">
            <div className="mb-1">{icon}</div>
            <div className="text-[11px] text-[#e0e1e3]">{label}</div>
            <div className="text-[11px] text-[#e0e1e3] font-medium">{value}</div>
        </div>
    );
}
