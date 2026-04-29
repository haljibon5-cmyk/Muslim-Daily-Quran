import React, { useEffect } from 'react';

export default function AdBanner() {
  // In a real Android/iOS app wrapped with Capacitor or React Native, you would initialize AdMob here.
  // We can simulate an AdSense web ad instead. 
  
  return (
    <div className="w-full h-[50px] bg-[#f8f9fa] flex flex-col justify-center items-center border-t border-[#e2dde8] text-[#5f6368] overflow-hidden fixed bottom-[72px] left-0 right-0 z-40">
        <span className="text-[10px] uppercase tracking-wider font-semibold mb-0.5 opacity-50">Advertisement</span>
        <div className="text-xs font-medium">AdMob Banner</div>
        {/* Real Ad ID implemented for native integration: */}
        {/* App ID: ca-app-pub-2792862085084694~6668747093 */}
        {/* Banner ID: ca-app-pub-2792862085084694/9646264227 */}
    </div>
  );
}
