"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Zap, ChevronRight } from "lucide-react";
import { variants } from "@/lib/animations";

const MealCard = dynamic(() => import("@/components/MealCard").then(mod => mod.MealCard), {
  loading: () => <div className="h-32 rounded-3xl bg-white/5 animate-pulse" />
});

interface Meal {
  type: "Desayuno" | "Almuerzo" | "Merienda" | "Cena";
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time?: string;
}

interface MealsSectionProps {
  meals: Meal[];
  isLoading: boolean;
  onAddMeal?: (type: "breakfast" | "lunch" | "snack" | "dinner") => void;
}

export const MealsSection = memo(function MealsSection({ meals, isLoading, onAddMeal }: MealsSectionProps) {
  const MEAL_TYPES = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'] as const;

  return (
    <motion.div
      variants={variants.fadeIn}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h2 className="font-semibold text-lg">Comidas de hoy</h2>
        </div>
        <motion.button
          className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors"
          whileHover={{ x: 3 }}
        >
          Ver todas
          <ChevronRight size={16} />
        </motion.button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </>
        ) : (
          <>
            {MEAL_TYPES.map((mealType) => {
              const meal = meals.find(m => m.type === mealType);
              return (
                <div
                  key={mealType}
                  onClick={() => !meal && onAddMeal?.(mealType.toLowerCase() as any)}
                  className={!meal ? 'cursor-pointer' : ''}
                >
                  <MealCard
                    type={mealType}
                    name={meal?.name || `Sin ${mealType.toLowerCase()}`}
                    calories={meal?.calories || 0}
                    protein={meal?.protein}
                    carbs={meal?.carbs}
                    fat={meal?.fat}
                    time={meal?.time}
                    isEmpty={!meal}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </motion.div>
  );
});
