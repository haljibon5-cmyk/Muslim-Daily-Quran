import React, { useState } from 'react';
import { Calculator, DollarSign, Coins, TrendingUp, ArrowLeft } from 'lucide-react';

export default function ZakatView({ onBack }: { onBack?: () => void }) {
    const [cash, setCash] = useState<string>('');
    const [gold, setGold] = useState<string>('');
    const [silver, setSilver] = useState<string>('');
    const [debts, setDebts] = useState<string>('');

    const calculateZakat = () => {
        const totalAssets = (parseFloat(cash) || 0) + (parseFloat(gold) || 0) + (parseFloat(silver) || 0);
        const totalLiabilities = parseFloat(debts) || 0;
        const netWorth = totalAssets - totalLiabilities;
        
        if (netWorth > 0) {
            return (netWorth * 0.025).toFixed(2);
        }
        return '0.00';
    };

    return (
        <div className="flex flex-col h-full bg-bg-base text-text-main relative">
            <div className="pt-12 pb-6 px-6 bg-header-bg text-white sticky top-0 z-10 border-b border-border-main">
                <div className="flex items-center gap-3 mb-2">
                    {onBack && (
                        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    )}
                    <h1 className="text-4xl font-serif italic m-0">Zakat Calculator</h1>
                </div>
                <p className="text-sm text-white/70">Calculate your 2.5% obligatory charity easily.</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 space-y-6">
                
                <div className="bg-bg-panel p-5 rounded-2xl border border-border-main shadow-sm">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        Eligible Assets
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1">Cash & Bank Balance</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input 
                                    type="number" 
                                    placeholder="0.00"
                                    value={cash}
                                    onChange={(e) => setCash(e.target.value)}
                                    className="w-full bg-bg-base border border-border-main rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-accent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1">Gold Value</label>
                            <div className="relative">
                                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                <input 
                                    type="number" 
                                    placeholder="0.00"
                                    value={gold}
                                    onChange={(e) => setGold(e.target.value)}
                                    className="w-full bg-bg-base border border-border-main rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-accent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1">Silver Value</label>
                            <div className="relative">
                                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="number" 
                                    placeholder="0.00"
                                    value={silver}
                                    onChange={(e) => setSilver(e.target.value)}
                                    className="w-full bg-bg-base border border-border-main rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-accent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-panel p-5 rounded-2xl border border-border-main shadow-sm">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-red-500 transform rotate-180" />
                        Liabilities (Deductible)
                    </h2>
                    
                    <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">Short term debts to pay</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input 
                                type="number" 
                                placeholder="0.00"
                                value={debts}
                                onChange={(e) => setDebts(e.target.value)}
                                className="w-full bg-bg-base border border-border-main rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-red-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-header-bg p-6 rounded-2xl shadow-lg border border-border-main text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium opacity-80 mb-1">Total Zakat Payable</p>
                            <p className="text-3xl font-bold italic tracking-tight">
                                <span className="text-accent text-xl mr-1">$</span>
                                {calculateZakat()}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Calculator className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
