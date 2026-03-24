"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Plus, Check, X, Clock } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface MealSlot {
  id: string;
  mealType: "breakfast" | "lunch" | "snack" | "dinner";
  time: string;
  planned?: {
    name: string;
    calories: number;
    emoji: string;
  };
}

interface MealPlannerProps {
  onGeneratePlan?: () => void;
}

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const MEAL_TYPES = [
  { id: "breakfast", label: "Desayuno", icon: "🌅", defaultTime: "08:30" },
  { id: "lunch", label: "Almuerzo", icon: "☀️", defaultTime: "13:30" },
  { id: "snack", label: "Merienda", icon: "🍂", defaultTime: "17:30" },
  { id: "dinner", label: "Cena", icon: "🌙", defaultTime: "21:00" },
];

export function MealPlanner({ onGeneratePlan }: MealPlannerProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { light, success } = useHaptic();

  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();

  // Sample meal plan data
  const samplePlan: Record<string, Record<string, any>> = {
    monday: {
      breakfast: { name: "Avena con frutas", calories: 350, emoji: "🥣" },
      lunch: { name: "Pollo a la plancha", calories: 450, emoji: "🍗" },
      snack: { name: "Yogur griego", calories: 150, emoji: "🥛" },
      dinner: { name: "Salmón al horno", calories: 400, emoji: "🐟" },
    },
    tuesday: {
      breakfast: { name: "Tostadas integrales", calories: 280, emoji: "🍞" },
      lunch: { name: "Ensalada César", calories: 380, emoji: "🥗" },
      snack: { name: "Frutos secos", calories: 180, emoji: "🥜" },
      dinner: { name: "Paella Valenciana", calories: 520, emoji: "🍚" },
    },
  };

  const getDayKey = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  };

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-purple-400" />
          <h3 className="font-semibold">Planificador</h3>
        </div>
        <button
          onClick={onGeneratePlan}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium"
          
        >
          Generar
        </button>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { light(); setWeekOffset(weekOffset - 1); }}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10"
        >
          <ChevronLeft size={20} className="text-zinc-400" />
        </button>
        <div className="text-center">
          <p className="font-medium">
            {weekDates[0].toLocaleDateString("es-ES", { month: "long", day: "numeric" })} -{" "}
            {weekDates[6].toLocaleDateString("es-ES", { month: "long", day: "numeric" })}
          </p>
        </div>
        <button
          onClick={() => { light(); setWeekOffset(weekOffset + 1); }}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10"
        >
          <ChevronRight size={20} className="text-zinc-400" />
        </button>
      </div>

      {/* Week grid */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-[600px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="p-2" />
            {weekDates.map((date, i) => (
              <div
                key={i}
                className={`p-2 text-center rounded-xl ${
                  isToday(date) ? "bg-green-500/20 border border-green-500/30" : ""
                }`}
              >
                <p className={`text-xs ${isToday(date) ? "text-green-400" : "text-zinc-500"}`}>
                  {DAYS[i]}
                </p>
                <p className={`font-bold ${isToday(date) ? "text-green-400" : ""}`}>
                  {formatDate(date)}
                </p>
              </div>
            ))}
          </div>

          {/* Meal rows */}
          {MEAL_TYPES.map((meal) => (
            <div key={meal.id} className="grid grid-cols-8 gap-2 mb-2">
              <div className="flex items-center gap-2 p-2">
                <span>{meal.icon}</span>
                <span className="text-sm text-zinc-400">{meal.label}</span>
              </div>
              {weekDates.map((date, dayIndex) => {
                const dayKey = getDayKey(date);
                const mealData = samplePlan[dayKey]?.[meal.id];
                
                return (
                  <motion.button
                    key={dayIndex}
                    onClick={() => {
                      light();
                      setSelectedSlot(`${dayKey}-${meal.id}`);
                    }}
                    className={`p-2 rounded-xl border transition-colors min-h-[60px] flex flex-col items-center justify-center ${
                      mealData
                        ? "bg-white/5 border-white/10 hover:border-green-500/30"
                        : "bg-white/5 border-white/10 border-dashed hover:border-white/20"
                    }`}
                    
                  >
                    {mealData ? (
                      <>
                        <span className="text-xl">{mealData.emoji}</span>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{mealData.calories} kcal</p>
                      </>
                    ) : (
                      <Plus size={16} className="text-zinc-600" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selected slot modal */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSlot(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative w-full max-w-md mx-4 mb-8 p-6 rounded-3xl bg-gradient-to-br from-[#0a0a0f] to-[#12121a] border border-white/10"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
            >
              <button
                onClick={() => setSelectedSlot(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-lg font-bold mb-4">Añadir comida</h3>
              
              <div className="space-y-3">
                <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🍳</span>
                    <div>
                      <p className="font-medium">Desayuno rápido</p>
                      <p className="text-sm text-zinc-500">350 kcal</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🥗</span>
                    <div>
                      <p className="font-medium">Ensalada verde</p>
                      <p className="text-sm text-zinc-500">250 kcal</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🍗</span>
                    <div>
                      <p className="font-medium">Proteína + verduras</p>
                      <p className="text-sm text-zinc-500">400 kcal</p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
