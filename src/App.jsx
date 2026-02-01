import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ListTodo, Home, Crown, Settings } from 'lucide-react';
import HomeView from './components/Home';
import TodoView from './components/Todo';
import CalendarView from './components/Calendar';

function App() {
    const [activeTab, setActiveTab] = useState('home');
    const isPremium = true; // All features unlocked

    // Load premium status
    useEffect(() => {
        // This effect is no longer needed as isPremium is always true
        // const saved = localStorage.getItem('got-u-premium');
        // if (saved === 'true') setIsPremium(true);
    }, []);

    const tabs = [
        { id: 'todo', icon: ListTodo, label: 'Tasks' },
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'calendar', icon: Calendar, label: 'Events' },
    ];

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-black text-white">
            {/* Main Content Areas */}
            <main className="flex-1 overflow-y-auto relative pb-20">
                <AnimatePresence mode="wait">
                    {activeTab === 'home' && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <HomeView />
                        </motion.div>
                    )}
                    {activeTab === 'todo' && (
                        <motion.div
                            key="todo"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="p-6"
                        >
                            <TodoView isPremium={isPremium} />
                        </motion.div>
                    )}
                    {activeTab === 'calendar' && (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-6"
                        >
                            <CalendarView />
                        </motion.div>
                    )}
                    {activeTab === 'premium' && (
                        <motion.div
                            key="premium"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="p-6"
                        >
                            <PremiumView setPremium={setIsPremium} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Modern Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-3xl border-t border-white/10 flex justify-around items-center px-4 z-50">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-text-dim'
                                }`}
                        >
                            <div className={`p-2 rounded-xl ${isActive ? 'bg-primary/20' : ''}`}>
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="nav-dot"
                                    className="w-1 h-1 rounded-full bg-primary"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

export default App;
