import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Shield, Sparkles } from 'lucide-react';

export default function Premium({ setPremium }) {
    const handleUpgrade = () => {
        // Simulated payment logic
        if (confirm("Proceed to pay ₹50 for Lifetime Pro access?")) {
            localStorage.setItem('got-u-premium', 'true');
            setPremium(true);
            alert("Welcome to GOT u Pro! 🎉");
        }
    };

    const perks = [
        { icon: Zap, text: "Unlimited Tasks & Events" },
        { icon: Sparkles, text: "Custom Quote Management" },
        { icon: Shield, text: "Advanced Notifications" },
        { icon: Crown, text: "Exclusive Premium Themes" }
    ];

    return (
        <div className="max-w-md mx-auto py-4">
            <div className="text-center mb-12">
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="inline-block p-4 bg-primary/20 rounded-3xl mb-4"
                >
                    <Crown size={48} className="text-primary" />
                </motion.div>
                <h1 className="text-4xl font-black mb-2">Go Pro.</h1>
                <p className="text-text-dim">Upgrade your productivity forever.</p>
            </div>

            <div className="glass-card overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4">
                    <span className="bg-primary text-[10px] font-black uppercase px-2 py-1 rounded-full">BEST VALUE</span>
                </div>

                <div className="p-8">
                    <div className="flex items-baseline space-x-2 mb-8">
                        <span className="text-5xl font-black">₹50</span>
                        <span className="text-text-dim font-medium">/ lifetime</span>
                    </div>

                    <div className="space-y-6 mb-10">
                        {perks.map((perk, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="p-2 bg-white/5 rounded-lg text-primary">
                                    <perk.icon size={20} />
                                </div>
                                <span className="font-medium">{perk.text}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleUpgrade}
                        className="w-full btn-primary text-xl py-5 shadow-xl shadow-primary/20 hover:shadow-primary/40"
                    >
                        Upgrade Now
                    </button>

                    <p className="text-center text-[10px] text-text-dim mt-6 uppercase tracking-widest font-bold">
                        ONE-TIME PAYMENT • NO SUBSCRIPTION
                    </p>
                </div>
            </div>
        </div>
    );
}
