"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Flame, Clock } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface MealEntry {
  id: string;
  type: "Desayuno" | "Almuerzo" | "Merienda" | "Cena";
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  image?: string;
}

interface DayData {
  date: Date;
  meals: MealEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface FoodDiaryProps {
  userId: string;
}

export function FoodDiary({ userId }: FoodDiaryProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const { light } = useHaptic();

  // Generate mock data for the current week
  function generateWeekData(): DayData[] {
    const data: DayData[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + 1 + i);
      
      const meals: MealEntry[] = [
        { id: "1", type: "Desayuno", name: "Avena con frutas", calories: 320, protein: 12, carbs: 52, fat: 8, time: "08:30" },
        { id: "2", type: "Almuerzo", name: "Ensalada César", calories: 450, protein: 35, carbs: 18, fat: 28, time: "14:00" },
        { id: "3", type: "Merienda", name: "Yogur con granola", calories: 180, protein: 10, carbs: 25, fat: 6, time: "17:30" },
        { id: "4", type: "Cena", name: "Salmón con verduras", calories: 480, protein: 40, carbs: 15, fat: 28, time: "21:00" },
      ];
      
      const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
      const totalProtein = meals.reduce((acc, m) => acc + m.protein, 0);
      const totalCarbs = meals.reduce((acc, m) => acc + m.carbs, 0);
      const totalFat = meals.reduce((acc, m) => acc + m.fat, 0);
      
      data.push({ date, meals, totalCalories, totalProtein, totalCarbs, totalFat });
    }
    
    return data;
  }

  const weekData = generateWeekData();
  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  function goToPreviousWeek() {
    light();
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  }

  function goToNextWeek() {
    light();
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  }

  function isToday(date: Date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  function selectDay(day: DayData) {
    light();
    setSelectedDay(selectedDay?.date.toDateString() === day.date.toDateString() ? null : day);
  }

  const avgCalories = Math.round(weekData.reduce((acc, d) => acc + d.totalCalories, 0) / 7);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-emerald-400" />
          <h3 className="font-semibold">Diario alimenticio</h3>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={goToPreviousWeek} className="p-1.5 rounded-lg hover:bg-white/10">
            <ChevronLeft size={18} className="text-zinc-400" />
          </button>
          <span className="text-sm text-zinc-400 min-w-[100px] text-center">
            {currentDate.toLocaleDateString("es-ES", { month: "short", year: "numeric" })}
          </span>
          <button onClick={goToNextWeek} className="p-1.5 rounded-lg hover:bg-white/10">
            <ChevronRight size={18} className="text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Week summary */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">Media semanal</p>
            <p className="text-xl font-bold text-emerald-400">{avgCalories} kcal/día</p>
          </div>
          <Flame size={20} className="text-orange-400" />
        </div>
      </div>

      {/* Days list */}
      <div className="space-y-2">
        {weekData.map((day, index) => {
          const isSelected = selectedDay?.date.toDateString() === day.date.toDateString();
          const dayName = weekDays[day.date.getDay() === 0 ? 6 : day.date.getDay() - 1];
          
          return (
            <div key={index}>
              <motion.button
                onClick={() => selectDay(day)}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${
                  isSelected
                    ? "bg-emerald-500/10 border border-emerald-500/30"
                    : "bg-white/5 border border-transparent hover:bg-white/10"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${
                  isToday(day.date) ? "bg-emerald-500/20" : "bg-white/5"
                }`}>
                  <span className={`text-xs ${isToday(day.date) ? "text-emerald-400" : "text-zinc-500"}`}>
                    {dayName}
                  </span>
                  <span className={`text-lg font-bold ${isToday(day.date) ? "text-emerald-400" : ""}`}>
                    {day.date.getDate()}
                  </span>
                </div>
                
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{day.meals.length} comidas</span>
                    {isToday(day.date) && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">Hoy</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span>{day.totalCalories} kcal</span>
                    <span>{day.totalProtein}g P</span>
                    <span>{day.totalCarbs}g C</span>
                    <span>{day.totalFat}g G</span>
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: isSelected ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={18} className="text-zinc-500" />
                </motion.div>
              </motion.button>

              {/* Expanded day view */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    className="mt-2 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {day.meals.map((meal) => (
                      <div key={meal.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center">
                          <Clock size={16} className="text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-400">{meal.time}</span>
                            <span className="font-medium text-sm">{meal.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <span>{meal.calories} kcal</span>
                            <span>{meal.protein}P</span>
                            <span>{meal.carbs}C</span>
                            <span>{meal.fat}G</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Day totals */}
                    <div className="pt-2 border-t border-white/10 grid grid-cols-4 gap-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-orange-400">{day.totalCalories}</p>
                        <p className="text-xs text-zinc-500">kcal</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-400">{day.totalProtein}g</p>
                        <p className="text-xs text-zinc-500">Proteína</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-yellow-400">{day.totalCarbs}g</p>
                        <p className="text-xs text-zinc-500">Carbos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-400">{day.totalFat}g</p>
                        <p className="text-xs text-zinc-500">Grasa</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
