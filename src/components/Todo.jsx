import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, Bell } from 'lucide-react';
import { LocalNotifications } from '@capacitor/local-notifications';

export default function Todo({ isPremium }) {
    const [tasks, setTasks] = useState(() => {
        try {
            const saved = localStorage.getItem('got-u-tasks');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Error parsing tasks from localStorage", e);
            return [];
        }
    });
    const [input, setInput] = useState('');

    useEffect(() => {
        localStorage.setItem('got-u-tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Feature limitation for non-premium (just as an example)
        if (!isPremium && tasks.length >= 10) {
            alert("Upgrade to Pro to add more than 10 tasks!");
            return;
        }

        setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
        setInput('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const scheduleReminder = async (task) => {
        try {
            await LocalNotifications.requestPermissions();
            await LocalNotifications.schedule({
                notifications: [
                    {
                        title: "GOT u - Task Reminder",
                        body: task.text,
                        id: task.id,
                        schedule: { at: new Date(Date.now() + 1000 * 60 * 60) }, // Remind in 1 hour
                        sound: null,
                        attachments: null,
                        actionTypeId: "",
                        extra: null,
                    }
                ]
            });
            alert("Reminder scheduled for 1 hour from now!");
        } catch (e) {
            console.error(e);
            alert("Reminders only work on mobile devices.");
        }
    };

    return (
        <div className="max-w-md mx-auto h-full flex flex-col">
            <h1 className="text-3xl font-black mb-8">Tasks</h1>

            <form onSubmit={addTask} className="relative mb-8">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What's next?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary transition-all text-lg"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-primary px-4 rounded-xl hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus size={24} />
                </button>
            </form>

            <div className="flex-1 space-y-3 overflow-y-auto pb-8 pr-2">
                <AnimatePresence initial={false}>
                    {tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card p-4 flex items-center justify-between group"
                        >
                            <div
                                className="flex items-center space-x-4 cursor-pointer flex-1"
                                onClick={() => toggleTask(task.id)}
                            >
                                <div className={task.completed ? 'text-primary' : 'text-text-dim'}>
                                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                </div>
                                <span className={`text-lg transition-all ${task.completed ? 'line-through opacity-40' : ''}`}>
                                    {task.text}
                                </span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => scheduleReminder(task)}
                                    className="text-text-dim hover:text-primary transition-colors p-2"
                                >
                                    <Bell size={20} />
                                </button>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="text-white/10 group-hover:text-red-500 transition-colors p-2"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {tasks.length === 0 && (
                    <div className="text-center py-20 opacity-20">
                        <p className="text-xl italic">No tasks yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
