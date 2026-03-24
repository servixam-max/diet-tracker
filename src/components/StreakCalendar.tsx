"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface StreakCalendarProps {
  userId: string;
}

export function StreakCalendar({ userId }: StreakCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());
  const { light } = useHaptic();

  useEffect(() => {
    // Load completed days from localStorage
    const saved = localStorage.getItem(`streak-${userId}`);
    if (saved) {
      setCompletedDays(new Set(JSON.parse(saved)));
    } else {
      // Sample data - last 10 days
      const sample = new Set<string>();
      const today = new Date();
      for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        if (Math.random() > 0.3) { // 70% chance of completion
          sample.add(date.toISOString().split("T")[0]);
        }
      }
      setCompletedDays(sample);
    }
  }, [userId]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday = 0
  const daysInMonth = lastDay.getDate();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  function prevMonth() {
    light();
    setCurrentMonth(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    light();
    setCurrentMonth(new Date(year, month + 1, 1));
  }

  // Calculate streak
  let currentStreak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    if (completedDays.has(dateStr)) {
      currentStreak++;
    } else if (i > 0) {
      break;
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-orange-400" />
          <h3 className="font-semibold">Racha</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-400">{currentStreak}</span>
          <span className="text-sm text-zinc-400">días</span>
        </div>
      </div>

      {/* Streak indicator */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">Racha actual</p>
            <p className="text-3xl font-bold text-orange-400">{currentStreak} 🔥</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400">Mejor racha</p>
            <p className="text-xl font-bold">{Math.max(currentStreak, 12)}</p>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white/10">
            <ChevronLeft size={20} className="text-zinc-400" />
          </button>
          <span className="font-medium">{monthNames[month]} {year}</span>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/10">
            <ChevronRight size={20} className="text-zinc-400" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs text-zinc-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the 1st */}
          {Array.from({ length: startingDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split("T")[0];
            const isCompleted = completedDays.has(dateStr);
            const isToday = dateStr === new Date().toISOString().split("T")[0];
            const isFuture = date > new Date();

            return (
              <motion.div
                key={day}
                className={`aspect-square rounded-xl flex items-center justify-center text-sm relative ${
                  isFuture
                    ? "text-zinc-600"
                    : isCompleted
                    ? "bg-green-500/20 text-green-400"
                    : "bg-white/5 text-zinc-400"
                } ${isToday ? "ring-2 ring-green-500" : ""}`}
                whileTap={{ scale: 0.9 }}
              >
                {day}
                {isCompleted && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-green-500/20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Flame size={12} className="absolute top-0.5 right-0.5 text-orange-400" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500/20" />
            <span>Completado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-white/5" />
            <span>Sin registrar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
