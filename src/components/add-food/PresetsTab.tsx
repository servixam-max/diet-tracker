"use client";

import { memo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { FoodResult, PresetMeal } from "./types";

interface PresetsTabProps {
  mealType: string;
  onResult: (result: FoodResult) => void;
}

function PresetsTabComponent({ mealType, onResult }: PresetsTabProps) {
  const [presets, setPresets] = useState<PresetMeal[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPresets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/weekly-meals?type=${mealType}`);
      if (response.ok) {
        const data = await response.json();
        setPresets(data.meals || []);
      }
    } catch (error) {
      console.error("Error fetching presets:", error);
    } finally {
      setLoading(false);
    }
  }, [mealType]);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  const selectPreset = useCallback(
    (preset: PresetMeal) => {
      onResult({
        description: preset.name,
        calories: preset.calories,
        protein_g: preset.protein,
        carbs_g: preset.carbs,
        fat_g: preset.fat,
        meal_type: mealType,
        confidence: 1,
      });
    },
    [mealType, onResult]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
          <Loader2 size={32} className="text-green-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <p className="text-sm text-zinc-400">{presets.length} comidas disponibles</p>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {presets.map((preset, i) => (
          <motion.button
            key={preset.name}
            onClick={() => selectPreset(preset)}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{preset.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{preset.name}</p>
                <p className="text-xs text-zinc-500">
                  P: {preset.protein}g · C: {preset.carbs}g · G: {preset.fat}g
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-orange-400">{preset.calories}</p>
                <p className="text-xs text-zinc-500">kcal</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export const PresetsTab = memo(PresetsTabComponent);
