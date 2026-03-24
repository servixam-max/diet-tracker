"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ChevronRight, Trash2, Clock, Flame } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface MealEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
  time: string;
}

interface MealHistoryProps {
  userId: string;
  limit?: number;
}

export function MealHistory({ userId, limit = 10 }: MealHistoryProps) {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { light } = useHaptic();

  useEffect(() => {
    // Generate sample history
    const sample: MealEntry[] = [
      { id: "1", name: "Desayuno americano", calories: 450, protein: 15, carbs: 45, fat: 22, mealType: "breakfast", date: "2024-03-23", time: "08:30" },
      { id: "2", name: "Ensalada César", calories: 320, protein: 22, carbs: 18, fat: 18, mealType: "lunch", date: "2024-03-23", time: "14:15" },
      { id: "3", name: "Merienda de坚果", calories: 180, protein: 5, carbs: 8, fat: 15, mealType: "snack", date: "2024-03-23", time: "17:00" },
      { id: "4", name: "Salmón con verduras", calories: 520, protein: 42, carbs: 25, fat: 28, mealType: "dinner", date: "2024-03-23", time: "21:00" },
      { id: "5", name: "Yogur con granola", calories: 220, protein: 12, carbs: 30, fat: 6, mealType: "breakfast", date: "2024-03-22", time: "09:00" },
      { id: "6", name: "Pollo a la plancha", calories: 380, protein: 45, carbs: 12, fat: 15, mealType: "lunch", date: "2024-03-22", time: "13:30" },
      { id: "7", name: "Fruta fresca", calories: 85, protein: 1, carbs: 22, fat: 0, mealType: "snack", date: "2024-03-22", time: "16:30" },
      { id: "8", name: "Tortilla de verduras", calories: 340, protein: 18, carbs: 20, fat: 22, mealType: "dinner", date: "2024-03-22", time: "20:45" },
    ];
    setMeals(sample);
  }, [userId]);

  function deleteMeal(id: string) {
    light();
    setMeals(meals.filter((m) => m.id !== id));
  }

  function toggleExpand(id: string) {
    light();
    setExpandedId(expandedId === id ? null : id);
  }

  const mealTypeIcons = {
    breakfast: "🌅",
    lunch: "🍽️",
    dinner: "🌙",
    snack: "🍪",
  };

  const displayedMeals = meals.slice(0, limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={18} className="text-blue-400" />
          <h3 className="font-semibold">Historial de comidas</h3>
        </div>
        <span className="text-xs text-zinc-500">{meals.length} comidas</span>
      </div>

      <div className="space-y-2">
        {displayedMeals.map((meal, index) => (
          <motion.div
            key={meal.id}
            className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <button
              onClick={() => toggleExpand(meal.id)}
              className="w-full p-4 flex items-center gap-3"
            >
              <span className="text-2xl">{mealTypeIcons[meal.mealType]}</span>
              <div className="flex-1 text-left">
                <p className="font-medium">{meal.name}</p>
                <p className="text-xs text-zinc-500">{meal.date} • {meal.time}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-400">{meal.calories}</p>
                <p className="text-xs text-zinc-500">kcal</p>
              </div>
              <motion.div
                animate={{ rotate: expandedId === meal.id ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={18} className="text-zinc-500" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedId === meal.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-2 border-t border-white/5">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 rounded-xl bg-white/5">
                        <p className="text-sm font-bold text-blue-400">{meal.protein}g</p>
                        <p className="text-xs text-zinc-500">Proteína</p>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-white/5">
                        <p className="text-sm font-bold text-yellow-400">{meal.carbs}g</p>
                        <p className="text-xs text-zinc-500">Carbos</p>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-white/5">
                        <p className="text-sm font-bold text-red-400">{meal.fat}g</p>
                        <p className="text-xs text-zinc-500">Grasas</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => deleteMeal(meal.id)}
                      className="w-full py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center justify-center gap-2"
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 size={14} />
                      Eliminar entrada
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {meals.length > limit && (
        <motion.button
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-sm font-medium"
          whileTap={{ scale: 0.98 }}
        >
          Ver más ({meals.length - limit} más)
        </motion.button>
      )}
    </div>
  );
}
