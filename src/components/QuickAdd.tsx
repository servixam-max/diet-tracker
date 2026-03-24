"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, Plus, Check, Loader2 } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface QuickMeal {
  label: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
  type: string;
}

const quickMeals: QuickMeal[] = [
  { label: "Desayuno ligero", calories: 250, protein: 10, carbs: 35, fat: 8, emoji: "🥣", type: "breakfast" },
  { label: "Desayuno completo", calories: 450, protein: 25, carbs: 45, fat: 18, emoji: "🍳", type: "breakfast" },
  { label: "Almuerzo rápido", calories: 500, protein: 35, carbs: 50, fat: 15, emoji: "🍗", type: "lunch" },
  { label: "Ensalada", calories: 350, protein: 20, carbs: 25, fat: 20, emoji: "🥗", type: "lunch" },
  { label: "Snack fruta", calories: 120, protein: 2, carbs: 28, fat: 1, emoji: "🍎", type: "snack" },
  { label: "Snack frutos", calories: 200, protein: 5, carbs: 15, fat: 15, emoji: "🥜", type: "snack" },
  { label: "Cena ligera", calories: 400, protein: 35, carbs: 30, fat: 15, emoji: "🥦", type: "dinner" },
  { label: "Cena completa", calories: 550, protein: 40, carbs: 45, fat: 25, emoji: "🐟", type: "dinner" },
];

interface QuickAddProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (meal: QuickMeal) => Promise<void>;
  mealType?: string;
}

export function QuickAdd({ isOpen, onClose, onAdd, mealType }: QuickAddProps) {
  const [adding, setAdding] = useState<string | null>(null);
  const { success, light } = useHaptic();

  const filtered = mealType 
    ? quickMeals.filter(m => m.type === mealType)
    : quickMeals;

  async function handleAdd(meal: QuickMeal) {
    light();
    setAdding(meal.label);
    try {
      await onAdd(meal);
      success();
      onClose();
    } finally {
      setAdding(null);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-lg bg-[#0a0a0f] border-t border-white/10 rounded-t-3xl p-5 pb-8 max-h-[70vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full" />

            {/* Header */}
            <div className="flex items-center justify-between mt-4 mb-4">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-green-400" />
                <h2 className="text-lg font-bold">Añadir rápido</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X size={18} className="text-zinc-400" />
              </button>
            </div>

            {/* Quick meals grid */}
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((meal, i) => (
                <motion.button
                  key={meal.label}
                  onClick={() => handleAdd(meal)}
                  disabled={adding !== null}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-green-500/30 transition-colors relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Glow effect when adding */}
                  {adding === meal.label && (
                    <motion.div
                      className="absolute inset-0 bg-green-500/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{meal.emoji}</span>
                      <span className="text-lg font-bold text-orange-400">{meal.calories}</span>
                    </div>
                    <p className="text-sm text-white/80 font-medium mb-1">{meal.label}</p>
                    <p className="text-xs text-zinc-500">
                      P: {meal.protein}g · C: {meal.carbs}g · G: {meal.fat}g
                    </p>
                  </div>

                  {adding === meal.label && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Loader2 size={24} className="text-green-400" />
                      </motion.div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            <p className="text-center text-xs text-zinc-500 mt-4">
              Desliza a la izquierda en una comida para eliminarla
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
