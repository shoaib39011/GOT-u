import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, Bell, ListTodo } from 'lucide-react';
import { LocalNotifications } from '@capacitor/local-notifications';

export default function Todo({ isPremium, tasks, setTasks }) {
    const [input, setInput] = useState('');
    const [taskDate, setTaskDate] = useState('');
    const [taskTime, setTaskTime] = useState('');

    const addTask = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (!isPremium && tasks.length >= 10) {
            alert("Upgrade to Pro to add more than 10 tasks!");
            return;
        }

        const newTask = {
            id: Date.now(),
            text: input,
            completed: false,
            dueDate: taskDate ? taskDate : null,
            dueTime: taskTime ? taskTime : null,
        };

        setTasks([...tasks, newTask]);

        // Auto-schedule notification if date is provided
        if (taskDate) {
            scheduleTaskNotification(newTask);
        }

        setInput('');
        setTaskDate('');
        setTaskTime('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const scheduleTaskNotification = async (task) => {
        if (!task.dueDate) return;

        try {
            await LocalNotifications.requestPermissions();

            // Construct notification date
            const dateStr = task.dueDate;
            const timeStr = task.dueTime || "09:00"; // Default to 9 AM if no time
            const scheduleDate = new Date(`${dateStr}T${timeStr}`);

            if (scheduleDate <= new Date()) {
                console.warn("Schedule date is in the worked. Skipping notification.");
                return;
            }

            await LocalNotifications.schedule({
                notifications: [
                    {
                        title: "GOT u - Task Reminder",
                        body: task.text,
                        id: task.id,
                        schedule: { at: scheduleDate },
                        sound: null,
                    }
                ]
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="max-w-md mx-auto h-full flex flex-col pt-4">
            <h1 className="text-4xl font-black mb-8 italic tracking-tighter">TASK MASTER</h1>

            <form onSubmit={addTask} className="space-y-4 mb-10">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Add a new challenge..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-primary transition-all text-xl font-medium"
                    />
                </div>

                <div className="flex gap-2">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-widest text-text-dim ml-2">Due Date</label>
                        <input
                            type="date"
                            value={taskDate}
                            onChange={(e) => setTaskDate(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-sm text-white"
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-widest text-text-dim ml-2">Reminder Time</label>
                        <input
                            type="time"
                            value={taskTime}
                            onChange={(e) => setTaskTime(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-sm text-white"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    Add Task
                </button>
            </form>

            <div className="flex-1 space-y-4 overflow-y-auto pb-8 pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`glass-card p-5 flex items-center justify-between group transition-all ${task.completed ? 'opacity-50' : ''}`}
                        >
                            <div
                                className="flex items-center space-x-4 cursor-pointer flex-1"
                                onClick={() => toggleTask(task.id)}
                            >
                                <div className={task.completed ? 'text-primary' : 'text-text-dim'}>
                                    {task.completed ? <CheckCircle2 size={26} fill="currentColor" className="text-black" /> : <Circle size={26} />}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-lg font-semibold transition-all ${task.completed ? 'line-through' : ''}`}>
                                        {task.text}
                                    </span>
                                    {task.dueDate && (
                                        <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider mt-0.5">
                                            <Bell size={10} />
                                            {task.dueDate} {task.dueTime ? `@ ${task.dueTime}` : ''}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="text-white/10 hover:text-red-500 hover:bg-red-500/10 p-3 rounded-xl transition-all"
                            >
                                <Trash2 size={20} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {tasks.length === 0 && (
                    <div className="text-center py-24 opacity-30 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <ListTodo size={32} />
                        </div>
                        <p className="text-lg italic font-medium">Your checklist is clean.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
