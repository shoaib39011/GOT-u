import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, Circle } from 'lucide-react';

export default function Calendar({ tasks }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Filter tasks for the selected date
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    const dayTasks = tasks.filter(task => task.dueDate === selectedDateStr);

    return (
        <div className="max-w-md mx-auto h-full flex flex-col">
            <h1 className="text-4xl font-black mb-8 italic tracking-tighter">SCHEDULE</h1>

            <div className="glass-card p-6 mb-8 shadow-2xl shadow-primary/10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black uppercase tracking-widest text-white">{format(currentMonth, 'MMMM yyyy')}</h2>
                    <div className="flex space-x-2">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="text-center text-[10px] font-bold text-primary/40 uppercase tracking-widest">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, idx) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const hasTasks = tasks.some(t => t.dueDate === dateStr);

                        return (
                            <div
                                key={idx}
                                onClick={() => setSelectedDate(day)}
                                className={`
                                    aspect-square flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all text-sm relative
                                    ${!isSameMonth(day, monthStart) ? 'opacity-10' : ''}
                                    ${isSameDay(day, selectedDate) ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30 z-10' : 'hover:bg-white/5'}
                                    ${isSameDay(day, new Date()) && !isSameDay(day, selectedDate) ? 'border border-primary/50 text-primary' : ''}
                                `}
                            >
                                <span className="font-bold">{format(day, 'd')}</span>
                                {hasTasks && !isSameDay(day, selectedDate) && (
                                    <div className="w-1 h-1 rounded-full bg-primary absolute bottom-1.5" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-20">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs uppercase tracking-[0.3em] font-black text-text-dim">
                        Day Schedule • {format(selectedDate, 'MMM do')}
                    </h3>
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-primary border border-white/5">
                        {dayTasks.length} {dayTasks.length === 1 ? 'EVENT' : 'EVENTS'}
                    </span>
                </div>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {dayTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card p-4 flex items-center gap-4 group"
                            >
                                <div className={task.completed ? 'text-primary opacity-50' : 'text-primary'}>
                                    <Clock size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-bold truncate ${task.completed ? 'line-through opacity-40' : ''}`}>
                                        {task.text}
                                    </h4>
                                    <p className="text-[10px] uppercase tracking-widest text-text-dim mt-0.5">
                                        {task.dueTime || 'All Day'}
                                    </p>
                                </div>
                                {task.completed ? <CheckCircle2 size={18} className="text-primary/50" /> : <div className="w-4 h-4 rounded-full border border-white/10" />}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {dayTasks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 glass-card border-dashed"
                        >
                            <p className="text-sm italic text-text-dim opacity-50 font-medium tracking-wide">No events for this date.</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
