"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { showToast, triggerHaptic, triggerConfetti } from "@/components/ui/Feedback";
import { 
  Calendar, ChevronLeft, ChevronRight, Sparkles, ShoppingCart,
  Plus, Check, Clock, Flame, ChefHat, ArrowRight, RefreshCw,
  Target, Utensils
} from "lucide-react";
import Link from "next/link";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type: string;
  emoji: string;
  ingredients?: string[];
}

interface DayPlan {
  date: string;
  dayName: string;
  meals: Meal[];
  totalCalories: number;
}

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const MEAL_TYPES = [
  { id: "breakfast", label: "Desayuno", icon: "🌅", color: "from-orange-400 to-amber-500" },
  { id: "lunch", label: "Almuerzo", icon: "☀️", color: "from-yellow-400 to-orange-500" },
  { id: "snack", label: "Merienda", icon: "🍂", color: "from-pink-400 to-rose-500" },
  { id: "dinner", label: "Cena", icon: "🌙", color: "from-indigo-400 to-purple-500" },
];

export default function WeeklyPlanPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [targetCalories, setTargetCalories] = useState(2000);

  async function fetchPlan() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/generate-plan?offset=${weekOffset}`);
      if (response.ok) {
        const data = await response.json();
        setPlan(data.plan || []);
        setTargetCalories(data.targetCalories || 2000);
      }
    } catch (error) {
      console.error("Error fetching plan:", error);
      showToast("Error al cargar el plan", "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function generateNewPlan() {
    try {
      setIsGenerating(true);
      triggerHaptic("medium");
      
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlan(data.plan || []);
        setTargetCalories(data.targetCalories || 2000);
        triggerConfetti();
        showToast("¡Plan semanal generado!", "success");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      showToast("Error al generar el plan", "error");
    } finally {
      setIsGenerating(false);
    }
  }

  useEffect(() => {
    fetchPlan();
  }, [weekOffset]);

  const currentDayPlan = plan[selectedDay];
  const totalWeekCalories = plan.reduce((sum, day) => sum + day.totalCalories, 0);
  const averageDailyCalories = plan.length > 0 ? Math.round(totalWeekCalories / plan.length) : 0;

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-sm text-zinc-400">Plan Semanal</span>
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              Tu Plan Nutricional
            </h1>
          </div>
          
          <motion.button
            onClick={generateNewPlan}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-green-500/30 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generar Plan
              </>
            )}
          </motion.button>
        </div>

        {/* Week Stats */}
        <GlassCard className="p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{averageDailyCalories}</p>
                <p className="text-xs text-zinc-400">Promedio kcal/día</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{targetCalories}</p>
                <p className="text-xs text-zinc-400">Meta diaria</p>
              </div>
            </div>
            
            <Link href="/shopping">
              <motion.button
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm flex items-center gap-2 hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-4 h-4" />
                Lista de compra
              </motion.button>
            </Link>
          </div>
        </GlassCard>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={() => { triggerHaptic("light"); setWeekOffset(weekOffset - 1); }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <span className="text-sm text-zinc-400">
            {weekOffset === 0 ? "Esta semana" : weekOffset > 0 ? `+${weekOffset} semanas` : `${weekOffset} semanas`}
          </span>
          
          <motion.button
            onClick={() => { triggerHaptic("light"); setWeekOffset(weekOffset + 1); }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Day Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {DAYS.map((day, index) => (
            <motion.button
              key={day}
              onClick={() => { triggerHaptic("light"); setSelectedDay(index); }}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
                selectedDay === index
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                  : "bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {day.slice(0, 3)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Day Plan */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </motion.div>
        ) : currentDayPlan ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Day Header */}
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{currentDayPlan.dayName}</h2>
                  <p className="text-sm text-zinc-400">{currentDayPlan.date}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-400">
                    <Flame className="w-4 h-4" />
                    <span className="font-bold">{currentDayPlan.totalCalories}</span>
                    <span className="text-sm">kcal</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Meals */}
            <div className="space-y-3">
              {MEAL_TYPES.map((mealType, index) => {
                const meal = currentDayPlan.meals.find(m => m.type === mealType.id);
                
                return (
                  <motion.div
                    key={mealType.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard 
                      className={`p-4 ${!meal ? 'opacity-50' : ''}`}
                      spotlight={!!meal}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mealType.color} flex items-center justify-center text-2xl shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {mealType.icon}
                        </motion.div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-zinc-400 uppercase tracking-wider">
                              {mealType.label}
                            </span>
                            {meal && (
                              <span className="text-xs text-zinc-500">
                                {meal.calories} kcal
                              </span>
                            )}
                          </div>
                          
                          {meal ? (
                            <>
                              <p className="font-semibold text-white mb-1">{meal.name}</p>
                              <div className="flex items-center gap-3 text-xs text-zinc-500">
                                <span>💪 {meal.protein}g</span>
                                <span>🌾 {meal.carbs}g</span>
                                <span>🥑 {meal.fat}g</span>
                              </div>
                              
                              <div className="mt-3 flex gap-2">
                                <motion.button
                                  className="flex-1 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium flex items-center justify-center gap-1"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    triggerHaptic("medium");
                                    showToast(`${meal.name} registrado`, "success");
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                  Registrar
                                </motion.button>
                                
                                <Link href={`/recipes`}>
                                  <motion.button
                                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                  </motion.button>
                                </Link>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-center py-4">
                              <span className="text-zinc-500 text-sm">Sin {mealType.label.toLowerCase()} planificado</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-white/5 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-zinc-500" />
            </div>
            <p className="text-zinc-400 mb-4">No hay plan para esta semana</p>
            
            <motion.button
              onClick={generateNewPlan}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5" />
              Generar Plan Semanal
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
