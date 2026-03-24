"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface WeekDaySelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function WeekDaySelector({ selectedDate, onDateChange }: WeekDaySelectorProps) {
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    return weekDays.map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i + mondayOffset);
      return {
        day: weekDays[i],
        date: date.getDate(),
        dateStr: date.toISOString().split('T')[0],
        isToday: date.toISOString().split('T')[0] === (selectedDate || today.toISOString().split('T')[0]),
      };
    });
  };

  const weekDates = getWeekDates();

  return (
    <motion.div
      className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      role="tablist"
      aria-label="Selector de día de la semana"
    >
      {weekDates.map((item) => {
        const isSelected = item.dateStr === selectedDate;
        
        return (
          <motion.button
            key={item.day}
            onClick={() => onDateChange(item.dateStr)}
            role="tab"
            aria-selected={isSelected}
            aria-label={`Seleccionar ${item.day} ${item.date}`}
            className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-all ${
              isSelected 
                ? 'bg-gradient-to-b from-green-500/30 to-emerald-500/20 border border-green-500/40' 
                : 'bg-white/5 border border-transparent'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <span className={`text-xs ${isSelected ? 'text-green-400' : 'text-zinc-500'}`}>
              {item.day}
            </span>
            <span className={`text-lg font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
              {item.date}
            </span>
            {item.isToday && (
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1"
                layoutId="todayDot"
                style={{ boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)' }}
                aria-label="Hoy"
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
