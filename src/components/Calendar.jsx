import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-black mb-8">Calendar</h1>

            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy')}</h2>
                    <div className="flex space-x-2">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-lg">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-lg">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="text-center text-xs font-bold text-primary/50">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedDate(day)}
                            className={`
                aspect-square flex items-center justify-center rounded-xl cursor-pointer transition-all text-sm font-medium
                ${!isSameMonth(day, monthStart) ? 'opacity-20' : ''}
                ${isSameDay(day, selectedDate) ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'hover:bg-white/5'}
                ${isSameDay(day, new Date()) && !isSameDay(day, selectedDate) ? 'border border-primary text-primary' : ''}
              `}
                        >
                            {format(day, 'd')}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-text-dim mb-4">Events for {format(selectedDate, 'MMM do')}</h3>
                <div className="glass-card p-6 text-center opacity-50 italic">
                    No events scheduled.
                </div>
            </div>
        </div>
    );
}
