"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RefreshCw, Loader2, Calendar } from "lucide-react";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type: string;
  emoji: string;
}

interface DayPlan {
  date: string;
  dayName: string;
  meals: Meal[];
  totalCalories: number;
}

interface WeeklyViewProps {
  userId: string;
  targetCalories: number;
}

const mealTypeEmojis: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  snack: "🍂",
  dinner: "🌙"
};

const mealTypeColors: Record<string, string> = {
  breakfast: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  lunch: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
  snack: "from-pink-500/20 to-pink-600/10 border-pink-500/30",
  dinner: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
};

export function WeeklyView({ userId, targetCalories }: WeeklyViewProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchWeekPlan();
  }, [weekOffset]);

  async function fetchWeekPlan() {
    setLoading(true);
    try {
      const response = await fetch(`/api/generate-plan?offset=${weekOffset}`);
      if (response.ok) {
        const data = await response.json();
        if (data.plan) {
          setWeekPlan(data.plan);
        }
      }
    } catch (error) {
      console.error("Error fetching week plan:", error);
    } finally {
      setLoading(false);
    }
  }

  async function generateNewPlan() {
    setGenerating(true);
    try {
      const response = await fetch("/api/generate-plan", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        setWeekPlan(data.plan);
      }
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setGenerating(false);
    }
  }

  function getWeekLabel() {
    if (weekOffset === 0) return "Esta semana";
    if (weekOffset === -1) return "Semana pasada";
    if (weekOffset === 1) return "Próxima semana";
    return `Semana ${weekOffset}`;
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={() => setWeekOffset(w => w - 1)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} className="text-zinc-400" />
        </motion.button>
        
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-green-400" />
          <span className="font-semibold">{getWeekLabel()}</span>
        </div>
        
        <motion.button
          onClick={() => setWeekOffset(w => w + 1)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} className="text-zinc-400" />
        </motion.button>
      </div>

      {/* Generate new plan button */}
      <motion.button
        onClick={generateNewPlan}
        disabled={generating}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30 text-green-400 font-medium flex items-center justify-center gap-2 hover:from-green-500/30 hover:to-emerald-500/20 transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        {generating ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
            <Loader2 size={18} />
          </motion.div>
        ) : (
          <RefreshCw size={18} />
        )}
        {generating ? "Generando..." : "Generar nuevo plan"}
      </motion.button>

      {/* Days list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : weekPlan.length === 0 ? (
        <motion.div
          className="py-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-zinc-400 mb-4">No hay plan para esta semana</p>
          <motion.button
            onClick={generateNewPlan}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold"
            whileTap={{ scale: 0.95 }}
          >
            Generar plan semanal
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {weekPlan.map((day, dayIndex) => {
            const isToday = day.date === today;
            const isPast = day.date < today;
            
            return (
              <motion.div
                key={day.date}
                className={`relative p-4 rounded-2xl border overflow-hidden ${
                  isToday 
                    ? "bg-green-500/10 border-green-500/40" 
                    : isPast 
                      ? "bg-white/5 border-white/10 opacity-60" 
                      : "bg-white/5 border-white/10"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: dayIndex * 0.05 }}
              >
                {/* Day header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${isToday ? "text-green-400" : "text-white"}`}>
                      {day.dayName}
                    </span>
                    {isToday && (
                      <motion.span
                        className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Hoy
                      </motion.span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${isPast ? "text-zinc-500" : "text-orange-400"}`}>
                      {day.totalCalories}
                    </span>
                    <span className="text-xs text-zinc-500 ml-1">/ {targetCalories}</span>
                  </div>
                </div>

                {/* Meals */}
                <div className="grid grid-cols-2 gap-2">
                  {day.meals.map((meal, mealIndex) => (
                    <motion.div
                      key={`${day.date}-${meal.type}`}
                      className={`flex items-center gap-2 p-2 rounded-xl bg-black/20 border ${mealTypeColors[meal.type] || "border-white/10"}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (dayIndex * 4 + mealIndex) * 0.03 }}
                    >
                      <span className="text-lg">{mealTypeEmojis[meal.type] || "🍽️"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/80 truncate">{meal.name}</p>
                        <p className="text-xs text-zinc-500">{meal.calories} kcal</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${isPast ? "bg-zinc-500" : "bg-gradient-to-r from-green-500 to-emerald-500"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((day.totalCalories / targetCalories) * 100, 100)}%` }}
                    transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
