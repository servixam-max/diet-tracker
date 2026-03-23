"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { CalorieRing } from "@/components/CalorieRing";
import { MacroBar } from "@/components/MacroBar";
import { MealCard } from "@/components/MealCard";
import { Calendar, RefreshCw, Sparkles, Plus, ChevronRight } from "lucide-react";

interface DailyPlan {
  dayOfWeek: number;
  date: string;
  meals: {
    type: "Desayuno" | "Almuerzo" | "Merienda" | "Cena";
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  }[];
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [todayPlan, setTodayPlan] = useState<DailyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - replace with real Supabase data later
  const mockPlan: DailyPlan = {
    dayOfWeek: new Date().getDay(),
    date: new Date().toISOString().split("T")[0],
    meals: [
      { type: "Desayuno", name: "Avena con frutas del bosque", calories: 380, protein: 15, carbs: 55, fat: 12 },
      { type: "Almuerzo", name: "Pollo a la plancha con ensalada", calories: 520, protein: 45, carbs: 25, fat: 28 },
      { type: "Merienda", name: "Yogur griego con frutos secos", calories: 180, protein: 12, carbs: 15, fat: 9 },
      { type: "Cena", name: "Salmón al horno con verduras", calories: 450, protein: 38, carbs: 20, fat: 26 },
    ],
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setTodayPlan(mockPlan);
      setIsLoading(false);
    }, 800);
  }, []);

  async function handleRefresh() {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsRefreshing(false);
  }

  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1;

  // Calculate totals
  const totalCalories = todayPlan?.meals.reduce((acc, m) => acc + m.calories, 0) || 0;
  const totalProtein = todayPlan?.meals.reduce((acc, m) => acc + (m.protein || 0), 0) || 0;
  const totalCarbs = todayPlan?.meals.reduce((acc, m) => acc + (m.carbs || 0), 0) || 0;
  const totalFat = todayPlan?.meals.reduce((acc, m) => acc + (m.fat || 0), 0) || 0;

  const targetCalories = 2000;
  const targetProtein = 120;
  const targetCarbs = 200;
  const targetFat = 65;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <motion.header 
        className="relative px-5 pt-6 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={20} className="text-white" />
            </motion.div>
            <div>
              <p className="text-sm text-zinc-400">Buenos días,</p>
              <h1 className="text-xl font-bold">{user?.name || "Usuario"}</h1>
            </div>
          </div>
          
          <motion.button
            onClick={handleRefresh}
            className="p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
          >
            <RefreshCw size={18} className="text-zinc-400" />
          </motion.button>
        </div>

        {/* Date chip */}
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mt-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Calendar size={14} className="text-green-400" />
          <span className="text-sm text-zinc-300">
            {days[dayIndex]}, {new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
          </span>
        </motion.div>
      </motion.header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
        {/* Calorie Ring Section */}
        <motion.div 
          className="flex justify-center py-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <CalorieRing current={totalCalories} target={targetCalories} />
        </motion.div>

        {/* Week overview */}
        <motion.div 
          className="flex justify-center gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {days.map((day, i) => (
            <motion.div
              key={day}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-medium transition-all ${
                i === dayIndex 
                  ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30" 
                  : "bg-white/5 text-zinc-500"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {day}
            </motion.div>
          ))}
        </motion.div>

        {/* Macros */}
        <motion.div 
          className="mb-6 p-4 rounded-2xl glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-300">Macros de hoy</h2>
            <span className="text-xs text-zinc-500">
              {totalProtein + totalCarbs + totalFat}g / {targetProtein + targetCarbs + targetFat}g
            </span>
          </div>
          <MacroBar 
            protein={totalProtein} proteinTarget={targetProtein}
            carbs={totalCarbs} carbsTarget={targetCarbs}
            fat={totalFat} fatTarget={targetFat}
          />
        </motion.div>

        {/* Meals */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300">Comidas de hoy</h2>
            <button className="flex items-center gap-1 text-xs text-green-400 font-medium">
              <span>Ver plan completo</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <AnimatePresence mode="popLayout">
            {isLoading ? (
              // Loading skeletons
              <>
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="h-28 rounded-2xl skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </>
            ) : (
              todayPlan?.meals.map((meal, i) => (
                <motion.div
                  key={`${meal.type}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <MealCard {...meal} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Quick actions */}
        <motion.div 
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={20} className="text-green-400" />
            <span className="font-medium text-green-400">Generar Plan</span>
          </motion.button>
          
          <motion.button
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles size={20} className="text-purple-400" />
            <span className="font-medium text-zinc-300">IA Analyzer</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
