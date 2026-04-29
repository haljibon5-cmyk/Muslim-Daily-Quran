import React from 'react';
import { Compass, Home } from 'lucide-react';
import { cn } from '../lib/utils';

export default function NotFoundView({ onNavigateHome }: { onNavigateHome: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-text-main p-6 text-center">
      <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-6">
        <Compass className="w-12 h-12 text-accent" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-text-muted mb-8 max-w-[280px]">
        We couldn't track down the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <button 
        onClick={onNavigateHome}
        className="flex items-center justify-center gap-2 w-full max-w-[200px] bg-accent text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-accent/30 active:scale-95 transition-all"
      >
        <Home className="w-5 h-5" />
        Return Home
      </button>
    </div>
  );
}
