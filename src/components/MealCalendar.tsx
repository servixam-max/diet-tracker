"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Plus, Utensils } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface MealEntry {
  id: string;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  calories: number;
  time: string;
}

interface DayData {
  date: string;
  meals: MealEntry[];
  totalCalories: number;
}

interface MealCalendarProps {
  userId: string;
  onSelectDay?: (date: string) => void;
}

export function MealCalendar({ userId, onSelectDay }: MealCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const { light } = useHaptic();

  // Generate sample data for demo
  const generateMonthData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data: Record<string, DayData> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const meals: MealEntry[] = [];
      
      // Random meals for some days
      if (Math.random() > 0.2) {
        const baseCal = 1500 + Math.floor(Math.random() * 800);
        meals.push(
          { id: "1", meal: "breakfast", name: "Desayuno", calories: Math.floor(baseCal * 0.25), time: "08:30" },
          { id: "2", meal: "lunch", name: "Almuerzo", calories: Math.floor(baseCal * 0.35), time: "14:00" },
          { id: "3", meal: "dinner", name: "Cena", calories: Math.floor(baseCal * 0.3), time: "21:00" }
        );
        if (Math.random() > 0.5) {
          meals.push({ id: "4", meal: "snack", name: "Merienda", calories: Math.floor(baseCal * 0.1), time: "17:30" });
        }
      }

      data[date] = {
        date,
        meals,
        totalCalories: meals.reduce((sum, m) => sum + m.calories, 0),
      };
    }
    return data;
  };

  const monthData = generateMonthData();
  const selectedDay = monthData[selectedDate] || { meals: [], totalCalories: 0 };

  function prevMonth() {
    light();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  }

  function nextMonth() {
    light();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  }

  function selectDate(date: string) {
    light();
    setSelectedDate(date);
    onSelectDay?.(date);
  }

  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startPadding = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-blue-400" />
          <h3 className="font-semibold">Calendario de comidas</h3>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white/10">
          <ChevronLeft size={20} />
        </button>
        <p className="font-medium">
          {currentMonth.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
        </p>
        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/10">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((day, i) => (
          <div key={i} className="text-xs text-zinc-500 font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const month = currentMonth.getMonth() + 1;
          const date = `${currentMonth.getFullYear()}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayData = monthData[date];
          const isSelected = date === selectedDate;
          const isToday = date === new Date().toISOString().split("T")[0];
          const hasData = dayData && dayData.meals.length > 0;

          return (
            <motion.button
              key={day}
              onClick={() => selectDate(date)}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center relative ${
                isSelected
                  ? "bg-green-500 text-white"
                  : isToday
                  ? "bg-white/10 border border-green-500/50"
                  : "hover:bg-white/5"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-sm font-medium">{day}</span>
              {hasData && (
                <div
                  className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                    isSelected ? "bg-white" : "bg-green-400"
                  }`}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected day detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDate}
          className="p-4 rounded-2xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium">
              {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <span className="text-orange-400 font-bold">{selectedDay.totalCalories} kcal</span>
          </div>

          {selectedDay.meals.length > 0 ? (
            <div className="space-y-2">
              {selectedDay.meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {meal.meal === "breakfast" ? "🌅" : meal.meal === "lunch" ? "🍽️" : meal.meal === "dinner" ? "🌙" : "🍪"}
                    </span>
                    <div>
                      <p className="font-medium">{meal.name}</p>
                      <p className="text-xs text-zinc-500">{meal.time}</p>
                    </div>
                  </div>
                  <span className="text-sm text-orange-400">{meal.calories} kcal</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-zinc-500">
              <Utensils size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Sin registros este día</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
