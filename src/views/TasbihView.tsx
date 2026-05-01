import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, RotateCcw, ArrowLeft } from 'lucide-react';
import { saveLastTasbih, updateDailyProgress } from '../lib/db';
import { auth } from '../lib/firebase';

export default function TasbihView({ onBack }: { onBack?: () => void }) {
    const [count, setCount] = useState(0);
    const [target, setTarget] = useState(33);
    
    // Use refs to store the latest value for the cleanup function
    const countRef = useRef(count);
    const targetRef = useRef(target);

    // Save count to local storage
    useEffect(() => {
        const saved = localStorage.getItem('tasbihCount');
        const savedTarget = localStorage.getItem('tasbihTarget');
        if (saved) {
            const parsedCount = parseInt(saved, 10);
            setCount(parsedCount);
            countRef.current = parsedCount;
        }
        if (savedTarget) {
            const parsedTarget = parseInt(savedTarget, 10);
            setTarget(parsedTarget);
            targetRef.current = parsedTarget;
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tasbihCount', count.toString());
        localStorage.setItem('tasbihTarget', target.toString());
        countRef.current = count;
        targetRef.current = target;
    }, [count, target]);

    useEffect(() => {
        return () => {
            if (auth.currentUser && countRef.current > 0) {
                 saveLastTasbih(targetRef.current, countRef.current, 'Regular Dhikr');
            }
        };
    }, []);

    const handleTap = () => {
        const newCount = count + 1;
        setCount(newCount);
        
        if (newCount > 0 && newCount % target === 0) {
            updateDailyProgress('tasbih', 34, true).catch(console.error); 
        }

        // Haptic feedback if supported
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            if (newCount % target === 0) {
                window.navigator.vibrate([100, 50, 100]); // longer vibration
            } else {
                window.navigator.vibrate(50); // short tick
            }
        }
    };

    const resetCount = () => {
        setCount(0);
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(200);
        }
    };

    const cycleTarget = () => {
        if (target === 33) setTarget(99);
        else if (target === 99) setTarget(100);
        else setTarget(33);
        setCount(0); // Optional: reset count when changing target
    };

    const progress = Math.min((count / target) * 100, 100);

    return (
        <div className="flex flex-col h-full bg-bg-base relative">
            <div className="pt-12 pb-6 px-6 bg-header-bg text-white sticky top-0 z-10 rounded-b-[30px] shadow-md flex items-center justify-center relative">
                {onBack && (
                    <button onClick={onBack} className="absolute left-6 p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                )}
                <h1 className="text-2xl font-serif italic text-white">Tasbih</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative gap-12">
                
                {/* Target cycle button */}
                <button 
                  onClick={cycleTarget}
                  className="bg-bg-panel px-6 py-2 rounded-full shadow-sm border border-border-main text-text-muted text-sm font-bold flex items-center gap-2 hover:bg-bg-panel-hover transition-colors"
                >
                    Target: <span className="text-accent">{target}</span>
                </button>

                {/* Big Tasbih Button */}
                <div className="relative">
                    {/* Ripple Background Effect */}
                    <div className="absolute inset-0 bg-accent/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                    
                    <button 
                        onClick={handleTap}
                        className="w-64 h-64 rounded-full bg-bg-panel shadow-2xl border-4 border-bg-base flex flex-col items-center justify-center relative z-10 active:scale-95 transition-transform group"
                    >
                        {/* Progress ring around the edge */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="48" className="stroke-bg-base" strokeWidth="2" fill="none" />
                            <circle 
                                cx="50" cy="50" r="48" 
                                className="stroke-accent transition-all duration-300" 
                                strokeWidth="4" 
                                fill="none" 
                                strokeDasharray="301.59" 
                                strokeDashoffset={301.59 - (progress / 100) * 301.59} 
                                strokeLinecap="round" 
                            />
                        </svg>

                        <span className="text-7xl font-bold text-text-main tabular-nums tracking-tighter">
                            {count}
                        </span>
                        <span className="text-sm font-medium text-text-muted mt-2 uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                            Tap
                        </span>
                    </button>
                    
                    {/* Shadow rim */}
                    <div className="absolute -inset-4 rounded-full border border-border-main/50 pointer-events-none"></div>
                </div>

                {/* Reset Button */}
                <button 
                    onClick={resetCount}
                    className="flex flex-col items-center gap-2 text-text-muted hover:text-red-500 transition-colors p-4"
                >
                    <div className="w-12 h-12 rounded-full bg-bg-panel flex items-center justify-center shadow-lg border border-border-main">
                        <RotateCcw className="w-5 h-5" />
                    </div>
                </button>

            </div>
        </div>
    )
}
