"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MealCard } from "@/components/MealCard";
import { EmptyState } from "@/components/EmptyState";
import { Sparkles } from "lucide-react";

interface Meal {
  type: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
  time?: string;
}

interface MealListProps {
  meals: Meal[];
  isLoading?: boolean;
  onAddMeal?: () => void;
}

export function MealList({ meals, isLoading, onAddMeal }: MealListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-white/5 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!meals || meals.length === 0) {
    return (
      <EmptyState 
        type="meals" 
        onAction={onAddMeal}
      />
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <motion.h2
        className="text-lg font-semibold mb-4 flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Sparkles size={20} className="text-yellow-400" />
        Comidas de hoy
      </motion.h2>

      <AnimatePresence>
        {meals.map((meal, index) => (
          <motion.div
            key={`${meal.type}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <MealCard
              type={meal.type as "Desayuno" | "Almuerzo" | "Merienda" | "Cena"}
              name={meal.name}
              calories={meal.calories}
              protein={meal.protein}
              carbs={meal.carbs}
              fat={meal.fat}
              isEmpty={false}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
