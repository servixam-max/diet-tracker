"use client";

import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHaptic } from "@/hooks/useHaptic";
import { Plus, Zap, Clock, ChevronRight, X } from "lucide-react";
import type { FoodResult } from "./add-food/types";

interface QuickAddProps {
  mealType: string;
  onAddFood: (result: FoodResult) => void;
  userId?: string;
}

interface QuickPreset {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
}

const defaultPresets: QuickPreset[] = [
  { id: "1", name: "Yogur con granola", calories: 180, protein: 10, carbs: 25, fat: 5, emoji: "🍶" },
  { id: "2", name: "Manzana", calories: 95, protein: 0, carbs: 25, fat: 0, emoji: "🍎" },
  { id: "3", name: "Huevo cocido", calories: 78, protein: 6, carbs: 1, fat: 5, emoji: "🥚" },
  { id: "4", name: "Plátano", calories: 105, protein: 1, carbs: 27, fat: 0, emoji: "🍌" },
  { id: "5", name: "Puñado de almendras", calories: 165, protein: 6, carbs: 6, fat: 14, emoji: "🥜" },
  { id: "6", name: "Tostada con aguacate", calories: 220, protein: 5, carbs: 23, fat: 12, emoji: "🥑" },
];

function QuickAddComponent({ mealType, onAddFood, userId }: QuickAddProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { light, medium } = useHaptic();

  const handleSelect = useCallback((preset: QuickPreset) => {
    light();
    const result: FoodResult = {
      description: preset.name,
      calories: preset.calories,
      protein_g: preset.protein,
      carbs_g: preset.carbs,
      fat_g: preset.fat,
      meal_type: mealType,
      confidence: 1,
    };
    onAddFood(result);
    setIsOpen(false);
  }, [mealType, onAddFood, light]);

  return (
    <>
      <motion.button
        onClick={() => { medium(); setIsOpen(true); }}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium"
        whileTap={{ scale: 0.95 }}
      >
        <Plus size={18} />
        Añadir rápido
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
            <motion.div
              className="relative w-full max-w-lg bg-[#0a0a0f] rounded-t-3xl p-5 pb-8"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Añadir rápidamente</h3>
                <button onClick={() => setIsOpen(false)} className="p-2">
                  <X size={20} className="text-zinc-400" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {defaultPresets.map((preset) => (
                  <motion.button
                    key={preset.id}
                    onClick={() => handleSelect(preset)}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2"
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl">{preset.emoji}</span>
                    <span className="text-xs text-center">{preset.name}</span>
                    <span className="text-xs text-zinc-500">{preset.calories} kcal</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export const QuickAdd = memo(QuickAddComponent);
