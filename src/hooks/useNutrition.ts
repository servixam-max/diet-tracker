"use client";

import { useState, useEffect, useCallback } from "react";
import { calculateBMR, calculateTDEE, calculateDailyCalories, distributeMacros, type Gender, type ActivityLevel, type Goal, type Speed } from "@/lib/nutrition/calculations";

interface UseNutritionOptions {
  age?: number;
  gender?: Gender;
  weight?: number;
  height?: number;
  activityLevel?: ActivityLevel;
  goal?: Goal;
  speed?: Speed;
}

export function useNutrition(options: UseNutritionOptions = {}) {
  const [bmr, setBMR] = useState<number | null>(null);
  const [tdee, setTDEE] = useState<number | null>(null);
  const [macros, setMacros] = useState<{ protein_g: number; carbs_g: number; fat_g: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!options.age || !options.gender || !options.weight || !options.height) {
        throw new Error("Faltan datos para calcular");
      }

      const bmrResult = calculateBMR(options.weight, options.height, options.age, options.gender);
      setBMR(bmrResult);

      const tdeeResult = calculateTDEE(bmrResult, options.activityLevel || 'sedentary');
      setTDEE(tdeeResult);

      const targetCalories = calculateDailyCalories(tdeeResult, options.goal || 'maintain', options.speed || 'medium');
      const macroResult = distributeMacros(targetCalories, options.goal || 'maintain', options.weight);
      setMacros(macroResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error calculando nutrición");
    } finally {
      setLoading(false);
    }
  }, [options.age, options.gender, options.weight, options.height, options.activityLevel, options.goal, options.speed]);

  useEffect(() => {
    if (options.age && options.gender && options.weight && options.height) {
      calculate();
    }
  }, [calculate, options.age, options.gender, options.weight, options.height]);

  return {
    bmr,
    tdee,
    macros,
    loading,
    error,
    calculate,
  };
}
