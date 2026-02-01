import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInMinutes, startOfDay } from 'date-fns';

const DEFAULT_QUOTES = [
    "Small steps every day.",
    "Your only limit is you.",
    "Make today count.",
    "Focus on the process, not the outcome.",
    "Believe in the person you're becoming."
];

export default function Home() {
    const [time, setTime] = useState(new Date());
    const [quote, setQuote] = useState("");

    const [showAddQuote, setShowAddQuote] = useState(false);
    const [newQuote, setNewQuote] = useState('');

    useEffect(() => {
        // Clock interval
        const timer = setInterval(() => setTime(new Date()), 1000);

        // Pick a quote
        refreshQuote();

        return () => clearInterval(timer);
    }, []);

    const refreshQuote = () => {
        const localQuotes = JSON.parse(localStorage.getItem('got-u-quotes') || '[]');
        const allQuotes = localQuotes.length > 0 ? localQuotes : DEFAULT_QUOTES;
        setQuote(allQuotes[Math.floor(Math.random() * allQuotes.length)]);
    };

    const addManualQuote = (e) => {
        e.preventDefault();
        if (!newQuote.trim()) return;
        const localQuotes = JSON.parse(localStorage.getItem('got-u-quotes') || '[]');
        localStorage.setItem('got-u-quotes', JSON.stringify([...localQuotes, newQuote.trim()]));
        setNewQuote('');
        setShowAddQuote(false);
        refreshQuote();
    };

    const dayStart = startOfDay(new Date());
    const diffMins = differenceInMinutes(time, dayStart);
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    return (
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[120px] rounded-full -z-10" />

            {/* Quote Background/Wallpaper Effect */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                onClick={() => setShowAddQuote(true)}
                className="absolute inset-0 flex items-center justify-center -z-20 px-4 cursor-pointer"
            >
                <h2 className="text-4xl md:text-6xl font-black italic text-white/10 uppercase tracking-tighter leading-none select-none">
                    {quote}
                </h2>
            </motion.div>

            {/* Animated Time Section */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="space-y-4"
            >
                <div className="flex flex-col items-center">
                    <motion.h1
                        className="text-8xl font-black tracking-tighter font-mono"
                        key={format(time, 'mm')}
                    >
                        {format(time, 'HH:mm')}
                        <span className="text-3xl opacity-50 ml-2 font-light">{format(time, 'ss')}</span>
                    </motion.h1>

                    <div className="mt-2 text-xl font-semibold tracking-[0.2em] uppercase text-primary">
                        {format(time, 'EEEE, MMMM do')}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card px-6 py-4 mt-8 flex flex-col items-center"
                >
                    <span className="text-xs uppercase tracking-widest text-text-dim">Your day started</span>
                    <div className="text-2xl font-bold mt-1">
                        {hrs} hrs {mins} mins ago
                    </div>
                    <div className="text-[10px] text-text-dim mt-2 opacity-50">MANAGE QUOTES BY TAPPING BACKGROUND</div>
                </motion.div>
            </motion.div>

            {/* Manual Quote Modal */}
            <AnimatePresence>
                {showAddQuote && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                    >
                        <div className="glass-card p-8 w-full max-w-sm">
                            <h2 className="text-xl font-bold mb-4">Add Personal Quote</h2>
                            <form onSubmit={addManualQuote}>
                                <textarea
                                    value={newQuote}
                                    onChange={(e) => setNewQuote(e.target.value)}
                                    placeholder="I will conquer today..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-4 focus:outline-none focus:border-primary resize-none h-24"
                                />
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddQuote(false)}
                                        className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 btn-primary"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Quote (Mobile readable) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 max-w-xs"
            >
                <p className="text-lg font-medium italic text-white/70">
                    "{quote}"
                </p>
            </motion.div>
        </div>
    );
}
