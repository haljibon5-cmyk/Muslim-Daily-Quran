import React, { useState } from 'react';
import { CheckCircle, Shield, ShieldCheck, Crown, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Tab } from '../App';

interface SubscriptionViewProps {
    isPremium: boolean;
    onSubscribe: (days: number) => void;
    onBack: (tab: Tab) => void;
}

export default function SubscriptionView({ isPremium, onSubscribe, onBack }: SubscriptionViewProps) {
    const plans = [
        { id: 'weekly', days: 7, name: '7 Days Access', price: '$2.99', desc: 'Perfect for short trips or testing Premium.' },
        { id: 'monthly', days: 30, name: '1 Month Access', price: '$9.99', desc: 'Most popular. Uninterrupted access for a month.', badge: 'POPULAR' },
        { id: 'yearly', days: 365, name: '1 Year Access', price: '$80.00', desc: 'Best value. Save more than 30% annually.' },
    ];

    const [selectedId, setSelectedId] = useState('monthly');
    const [subscribing, setSubscribing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubscribe = async () => {
        setSubscribing(true);
        setErrorMsg(null);
        try {
            const plan = plans.find(p => p.id === selectedId);
            
            const response = await fetch('/api/create-paypal-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: selectedId, days: plan?.days, paymentMethod: 'paypal' })
            });

            try {
                const data = await response.json();
                
                if (data.url) {
                    // Redirect to PayPal Checkout page where they can securely use Card or PayPal
                    window.location.href = data.url;
                } else {
                    setErrorMsg('Error processing payment request: ' + (data.error || 'Unknown error. Make sure PAYPAL_CLIENT_ID is configured in Settings.'));
                    setSubscribing(false);
                }
            } catch (jsonError) {
                 setErrorMsg('Failed to parse backend response. Payment service may be unavailable.');
                 setSubscribing(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setErrorMsg('Failed to connect to checkout server. Please make sure the backend is running.');
            setSubscribing(false);
        }
    };

    if (isPremium) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">
                <div className="w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)]">
                    <ShieldCheck className="w-16 h-16 text-accent" />
                </div>
                <div>
                     <h2 className="text-2xl font-bold text-accent mb-2 font-serif italic text-white flex items-center gap-2 justify-center">
                        <Crown className="w-6 h-6" /> Premium Active
                     </h2>
                     <p className="text-text-muted">You have full access to Muslim Daily without any ads! May Allah bless you.</p>
                </div>
                <button 
                     onClick={() => onBack('home')}
                     className="mt-8 bg-accent text-header-bg px-8 py-3 rounded-full font-bold shadow-lg w-full max-w-xs"
                >
                     Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-header-bg relative text-white pb-24 overflow-y-auto no-scrollbar">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none"></div>
             
             <button 
                 onClick={() => onBack('home')} 
                 className="absolute top-4 left-4 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors flex items-center justify-center backdrop-blur-sm"
                 aria-label="Go back"
             >
                 <ArrowLeft className="w-5 h-5 text-white" />
             </button>

             <div className="pt-12 pb-6 px-6 relative z-10 flex flex-col items-center">
                 <div className="w-20 h-20 bg-accent/20 border border-accent/40 rounded-3xl flex items-center justify-center shadow-lg mb-4 backdrop-blur-sm">
                      <Shield className="w-10 h-10 text-accent" />
                 </div>
                 <h1 className="text-2xl font-bold font-serif italic text-center mb-2 flex items-center gap-2">
                     <Crown className="w-5 h-5 text-accent" />
                     Premium Ad-Free
                 </h1>
                 <p className="text-white/80 text-center text-sm px-4">Remove all ads instantly and support the continuous development of this app.</p>
             </div>

             <div className="p-6 relative z-10 flex flex-col gap-4">
                 {plans.map((plan) => (
                     <div 
                         key={plan.id}
                         onClick={() => setSelectedId(plan.id)}
                         className={`relative rounded-2xl p-5 border-2 cursor-pointer transition-all duration-300 ${selectedId === plan.id ? 'bg-accent/10 border-accent shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'bg-bg-base/10 border-white/10 hover:border-white/30'}`}
                     >
                         {plan.badge && (
                             <div className="absolute -top-3 right-4 bg-accent text-header-bg text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                                 {plan.badge}
                             </div>
                         )}
                         <div className="flex justify-between items-center w-full">
                              <div>
                                   <h3 className="font-bold text-lg">{plan.name}</h3>
                                   <p className="text-white/60 text-xs mt-1 pr-4">{plan.desc}</p>
                              </div>
                              <div className="text-right shrink-0">
                                   <span className="text-2xl font-bold font-mono text-accent">{plan.price}</span>
                              </div>
                         </div>
                         {selectedId === plan.id && (
                             <motion.div layoutId="checkIcon" className="absolute top-1/2 -right-3 -translate-y-1/2 bg-accent rounded-full p-0.5 shadow-lg">
                                 <CheckCircle className="w-5 h-5 text-header-bg" />
                             </motion.div>
                         )}
                     </div>
                 ))}
                 
                 {errorMsg && (
                     <div className="mt-4 p-4 text-sm bg-red-500/20 text-red-100 border border-red-500/50 rounded-2xl">
                         {errorMsg}
                     </div>
                 )}

                 <div className="mt-8 flex flex-col gap-3">
                     <p className="text-sm font-medium text-white/50 text-left px-2 uppercase tracking-wider">Payment Method</p>
                     <div className="grid grid-cols-1 gap-4">
                         <div
                             className={`relative rounded-xl p-4 border-2 transition-all flex flex-col items-center gap-2 justify-center bg-accent/10 border-accent shadow-[0_0_15px_rgba(212,175,55,0.15)] text-accent`}
                         >
                             <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                 <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zM11.5 8.928h1.96c1.15 0 2.1-.2 2.74-.75.64-.54.91-1.39.77-2.31-.19-.94-.78-1.55-1.57-1.78-.71-.21-1.73-.25-2.91-.25H8.761l-1.045 6.643h1.834l.21-1.332c.08-.52.524-.9.105-.9H11.5z" />
                             </svg>
                             <span className="font-semibold text-sm">PayPal</span>
                         </div>
                     </div>
                 </div>

                 <button 
                     onClick={handleSubscribe}
                     disabled={subscribing}
                     className="w-full py-4 mt-6 bg-accent text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                     {subscribing ? (
                         <>
                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                             <span className="text-white">Processing...</span>
                         </>
                     ) : (
                         <span className="text-white">Subscribe Now</span>
                     )}
                 </button>
             </div>
        </div>
    );
}
