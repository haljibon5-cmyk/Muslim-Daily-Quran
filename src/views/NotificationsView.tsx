import React from 'react';
import { Bell, VolumeX, Volume2, Trash2, ArrowLeft } from 'lucide-react';
import { AppNotification } from '../hooks/useAzan';
import { motion } from 'motion/react';

interface NotificationsViewProps {
    notifications: AppNotification[];
    clearNotifications: () => void;
    isAzanPlaying: boolean;
    stopAzan: () => void;
    onBack?: () => void;
}

export default function NotificationsView({ notifications, clearNotifications, isAzanPlaying, stopAzan, onBack }: NotificationsViewProps) {
    return (
        <div className="flex flex-col h-full bg-bg-base relative text-text-main pb-24 overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="pt-12 pb-6 px-6 bg-header-bg shrink-0 text-white rounded-b-[40px] relative shadow-sm">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none rounded-b-[40px]"></div>
                <div className="relative z-10 flex items-center">
                    {onBack && (
                        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors absolute left-0">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    )}
                    <div className="flex flex-1 justify-center">
                        <h1 className="text-xl font-bold font-serif italic text-white flex items-center gap-2">
                            <Bell className="w-5 h-5 text-accent" />
                            Notifications
                        </h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-4">
                {/* Active Azan Alert */}
                {isAzanPlaying && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-accent/20 border border-accent/40 rounded-2xl p-4 flex items-center justify-between shadow-sm backdrop-blur-sm relative overflow-hidden"
                    >
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="bg-accent/20 p-2 rounded-xl text-accent animate-pulse">
                                <Volume2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Azan is playing</h3>
                                <p className="text-xs text-text-main opacity-80">Tap to silence the current call to prayer</p>
                            </div>
                        </div>
                        <button 
                            onClick={stopAzan}
                            className="bg-accent text-white p-2 rounded-xl flex items-center justify-center shrink-0 hover:bg-accent/80 transition shadow-sm relative z-10"
                        >
                            <VolumeX className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                <div className="flex items-center justify-between mb-2 mt-4">
                    <h2 className="font-bold text-sm text-text-muted uppercase tracking-wider">Recent Activity</h2>
                    {notifications.length > 0 && (
                        <button 
                            onClick={clearNotifications}
                            className="text-xs flex items-center gap-1 text-red-500 bg-red-500/10 px-3 py-1 rounded-full font-medium hover:bg-red-500/20 transition"
                        >
                            <Trash2 className="w-3 h-3" />
                            Clear All
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 space-y-3 mt-12">
                        <Bell className="w-12 h-12" />
                        <p className="text-sm">You have no notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif, index) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={notif.id}
                                className="bg-bg-panel border border-border-main p-4 rounded-2xl shadow-sm flex flex-col gap-1"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-sm text-text-main">{notif.title}</h3>
                                    <span className="text-[10px] text-text-muted mt-0.5">
                                        {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-text-muted leading-relaxed">{notif.message}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
