import React, { useEffect, useState, useCallback } from 'react';
import { Compass, AlertTriangle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

const MECCA_LAT = 21.422487;
const MECCA_LNG = 39.826206;

function calculateQiblaBearing(userLat: number, userLng: number) {
  const toRad = (deg: number) => deg * Math.PI / 180;
  const toDeg = (rad: number) => rad * 180 / Math.PI;

  const lat1 = toRad(userLat);
  const lng1 = toRad(userLng);
  const lat2 = toRad(MECCA_LAT);
  const lng2 = toRad(MECCA_LNG);

  const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);

  let bearing = toDeg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;

  return bearing;
}

export default function QiblaView({ location, onBack }: { location: { lat: number, lng: number } | null, onBack?: () => void }) {
  const [heading, setHeading] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const qiblaBearing = location ? calculateQiblaBearing(location.lat, location.lng) : null;

  const handleOrientation = useCallback((event: any) => {
    let alpha = event.alpha;
    // iOS uses webkitCompassHeading for absolute direction
    if (event.webkitCompassHeading !== undefined) {
      alpha = event.webkitCompassHeading;
    } 
    // Absolute device orientation on Android Chrome
    else if (event.absolute === true || event.type === 'deviceorientationabsolute') {
      // standard alpha is CCW from true north. We want CW heading.
      // E.g., if alpha is 90 (West), heading is 270.
      alpha = 360 - alpha;
    } else {
      // Relative orientation. Not ideal, but we try.
      alpha = 360 - alpha;
    }
    
    if (alpha !== null && alpha !== undefined && !isNaN(alpha)) {
      setHeading(Math.floor(alpha));
    }
  }, []);

  const requestPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setPermissionGranted(false);
        }
      } catch (error) {
        console.error(error);
        setPermissionGranted(false);
      }
    } else {
      setPermissionGranted(true);
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    }
  };

  useEffect(() => {
    // Check if it works without requesting permission (Android)
    if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
         // Some Android browsers support absolute
         window.addEventListener('deviceorientationabsolute', handleOrientation, true);
         // Fallback for others
         window.addEventListener('deviceorientation', handleOrientation, true);
         return () => {
             window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
             window.removeEventListener('deviceorientation', handleOrientation, true);
         };
    }
  }, [handleOrientation]);

  // Clean up
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
    }
  }, [handleOrientation]);

  // Calculate compass rotation and Qibla rotation relative to it
  // Compass plate rotates to keep North up visually relative to device
  const compassRotation = heading ? -heading : 0;
  // Qibla pointer strictly points to Mecca.
  const pointerRotation = (heading !== null && qiblaBearing !== null) ? (qiblaBearing - heading) : 0;

    return (
        <div className="flex flex-col h-full bg-bg-base">
            <div className="pt-12 pb-6 px-6 bg-header-bg border-b border-border-main mb-6 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-6 h-6 text-white" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-4xl font-serif text-white italic m-0">Qibla Finder</h1>
                        <p className="text-white/80 text-sm mt-1 tracking-wide">Point your phone to Mecca</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-6 flex flex-col items-center pt-2 pb-24 text-center">
        {!location && (
          <div className="bg-accent/10 border border-accent/20 text-accent p-4 rounded-xl flex items-start gap-3 w-full mb-8">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium text-left">Location is required to calculate the Qibla direction.</p>
          </div>
        )}

        {permissionGranted === null && typeof (DeviceOrientationEvent as any).requestPermission === 'function' && (
           <button 
             onClick={requestPermission}
             className="bg-accent text-[#0A0C0B] font-bold tracking-widest uppercase text-xs py-3 px-6 rounded-xl shadow-lg shadow-[#D4AF37]/10 active:bg-yellow-600 transition w-full max-w-[200px] mb-8"
           >
             Calibrate Compass
           </button>
        )}

        <div className="relative w-72 h-72 rounded-full border border-border-main shadow-2xl shadow-[#D4AF37]/5 bg-gradient-to-br from-[#161B18] to-[#0D110F] flex items-center justify-center overflow-hidden ring-8 ring-[#161B18]">
             
             {/* The Compass Plate */}
             <motion.div 
               className="absolute inset-0 w-full h-full select-none pointer-events-none"
               animate={{ rotate: compassRotation }}
               transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
             >
                <div className="w-full h-full rounded-full border-[12px] border-zinc-400 bg-[#352D5C] relative flex items-center justify-center">
                    {/* Tick marks and numbers */}
                    {[...Array(18)].map((_, i) => {
                        const deg = i * 20;
                        return (
                          <div key={i} className="absolute inset-0 w-full h-full flex flex-col items-center pt-2" style={{ transform: `rotate(${deg}deg)` }}>
                              <div className="text-[10px] text-white/80 font-mono" style={{ transform: `rotate(${-deg}deg)` }}>
                                  {deg}
                              </div>
                              <div className="w-0.5 h-1.5 bg-white/60 mt-1"></div>
                          </div>
                        );
                    })}
                    {/* Tick marks for every 10 deg without number */}
                    {[...Array(36)].map((_, i) => {
                        if (i % 2 === 0) return null;
                        const deg = i * 10;
                        return (
                          <div key={`tick-${i}`} className="absolute inset-0 w-full h-full flex flex-col items-center pt-6" style={{ transform: `rotate(${deg}deg)` }}>
                              <div className="w-[1px] h-1 bg-white/40"></div>
                          </div>
                        );
                    })}
                    
                    {/* Cardinal Directions */}
                    <div className="absolute top-[12%] left-1/2 -translate-x-1/2 font-extrabold text-white text-3xl font-sans">N</div>
                    <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 rotate-180 font-extrabold text-white text-3xl font-sans">S</div>
                    <div className="absolute right-[12%] top-1/2 -translate-y-1/2 rotate-90 font-extrabold text-white text-3xl font-sans">E</div>
                    <div className="absolute left-[12%] top-1/2 -translate-y-1/2 -rotate-90 font-extrabold text-white text-3xl font-sans">W</div>
                </div>
             </motion.div>

             {/* The Kaaba Pointer */}
             {qiblaBearing !== null && (
               <motion.div 
                 className="absolute inset-0 w-full h-full pointer-events-none flex flex-col items-center justify-start object-contain py-[15%]"
                 animate={{ rotate: pointerRotation }}
                 transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                >
                  <div className="flex flex-col items-center justify-end h-full w-full relative">
                     {/* The Compass Needle */}
                     <svg viewBox="0 0 24 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-32 absolute top-[30%]">
                         <path d="M12 0 L20 20 L16 30 L16 60 L20 70 L12 100 L4 70 L8 60 L8 30 L4 20 Z" fill="#D2C7A8" stroke="#352D5C" strokeWidth="1"/>
                         <path d="M12 0 L20 20 L16 30 L16 60 L20 70 L12 100" fill="rgba(0,0,0,0.15)"/> {/* Shading half of needle */}
                     </svg>
                     
                     {/* The Kaaba Icon at the tip */}
                     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[3.5rem] h-[3.5rem] absolute top-[18%] -mt-4 drop-shadow-md z-10">
                         {/* Kaaba Top Face */}
                         <path d="M12 2 L20 6 L12 10 L4 6 Z" fill="#222" stroke="#FCD34D" strokeWidth="0.5" />
                         {/* Kaaba Left Face */}
                         <path d="M4 6 L12 10 L12 20 L4 16 Z" fill="#111" stroke="none" />
                         {/* Kaaba Right Face */}
                         <path d="M12 10 L20 6 L20 16 L12 20 Z" fill="#000" stroke="none" />
                         {/* Gold Band Left */}
                         <path d="M4 8.5 L12 12.5 L12 14 L4 10 Z" fill="#FCD34D" stroke="none" />
                         {/* Gold Band Right */}
                         <path d="M12 12.5 L20 8.5 L20 10 L12 14 Z" fill="#FCD34D" stroke="none" />
                         {/* Additional Gold Details / Door area */}
                         <path d="M14 14 L16 13 L16 19 L14 20 Z" fill="#111" stroke="#FCD34D" strokeWidth="0.5" />
                     </svg>
                  </div>
               </motion.div>
             )}

             {/* Center Pin */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#D2C7A8] shadow-sm z-20 border-[3px] border-[#352D5C]"></div>
        </div>

        {qiblaBearing !== null && (
          <div className="mt-6 bg-bg-panel px-8 py-5 rounded-3xl border border-border-main flex gap-12 shadow-sm">
            <div className="text-center">
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1">Qibla</p>
                <div className="text-3xl font-mono font-bold text-accent">{Math.round(qiblaBearing)}<span className="text-sm">°</span></div>
            </div>
            <div className="text-center">
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1">Heading</p>
                <div className="text-3xl font-mono font-bold text-text-main">{heading !== null ? Math.round(heading) : '--'}<span className="text-sm">°</span></div>
            </div>
          </div>
        )}

        {(heading !== null && qiblaBearing !== null && Math.abs(pointerRotation % 360) < 5) && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-accent/10 text-accent text-sm font-bold tracking-widest uppercase px-4 py-2 rounded-xl flex items-center gap-2 border border-accent/20"
            >
                <Compass className="w-4 h-4" />
                You are facing the Qibla
            </motion.div>
        )}
      </div>
    </div>
  );
}
