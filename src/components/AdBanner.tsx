import React from 'react';

export default function AdBanner() {
  return (
    <div className="w-full h-[50px] bg-[#f8f9fa] flex flex-col justify-center items-center border-t border-[#e2dde8] text-[#5f6368] overflow-hidden fixed bottom-[72px] left-0 right-0 z-40">
        <a href="https://omg10.com/4/10950604" target="_blank" rel="noopener noreferrer" className="w-full h-full flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase tracking-wider font-semibold mb-0.5 opacity-50">Advertisement</span>
          <div className="text-xs font-bold text-accent">Click to View Special Offer</div>
        </a>
    </div>
  );
}
