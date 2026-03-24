"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface DayData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface CalorieComparisonProps {
  userId: string;
}

export function CalorieComparison({ userId }: CalorieComparisonProps) {
  const [data] = useState<{
    today: DayData;
    yesterday: DayData;
    average: DayData;
  }>({
    today: { date: "Hoy", calories: 1650, protein: 85, carbs: 180, fat: 65 },
    yesterday: { date: "Ayer", calories: 1820, protein: 92, carbs: 195, fat: 70 },
    average: { date: "Media semanal", calories: 1780, protein: 88, carbs: 185, fat: 68 },
  });
  const { light } = useHaptic();

  const diff = {
    calories: data.today.calories - data.yesterday.calories,
    protein: data.today.protein - data.yesterday.protein,
    carbs: data.today.carbs - data.yesterday.carbs,
    fat: data.today.fat - data.yesterday.fat,
  };

  function getTrendIcon(value: number) {
    if (value > 0) return <TrendingUp size={14} className="text-red-400" />;
    if (value < 0) return <TrendingDown size={14} className="text-green-400" />;
    return <Minus size={14} className="text-zinc-500" />;
  }

  function getTrendColor(value: number) {
    if (value > 0) return "text-red-400";
    if (value < 0) return "text-green-400";
    return "text-zinc-400";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-indigo-400" />
          <h3 className="font-semibold">Comparativa</h3>
        </div>
        <span className="text-xs text-zinc-500">Hoy vs Ayer</span>
      </div>

      {/* Main comparison card */}
      <motion.div
        className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-zinc-400">Calorías de hoy</p>
            <p className="text-3xl font-bold">{data.today.calories}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            diff.calories < 0 ? "bg-green-500/10" : diff.calories > 0 ? "bg-red-500/10" : "bg-zinc-500/10"
          }`}>
            {getTrendIcon(diff.calories)}
            <span className={`text-sm font-medium ${getTrendColor(diff.calories)}`}>
              {diff.calories > 0 ? "+" : ""}{diff.calories}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-500">Proteína</span>
              {getTrendIcon(diff.protein)}
            </div>
            <p className="text-lg font-bold text-blue-400">{data.today.protein}g</p>
            <p className={`text-xs ${getTrendColor(diff.protein)}`}>
              {diff.protein > 0 ? "+" : ""}{diff.protein}g
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-500">Carbos</span>
              {getTrendIcon(diff.carbs)}
            </div>
            <p className="text-lg font-bold text-yellow-400">{data.today.carbs}g</p>
            <p className={`text-xs ${getTrendColor(diff.carbs)}`}>
              {diff.carbs > 0 ? "+" : ""}{diff.carbs}g
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-500">Grasa</span>
              {getTrendIcon(diff.fat)}
            </div>
            <p className="text-lg font-bold text-red-400">{data.today.fat}g</p>
            <p className={`text-xs ${getTrendColor(diff.fat)}`}>
              {diff.fat > 0 ? "+" : ""}{diff.fat}g
            </p>
          </div>
        </div>
      </motion.div>

      {/* Weekly average comparison */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
        <p className="text-xs text-zinc-500 mb-2">Comparado con tu media semanal</p>
        <div className="flex items-center justify-between">
          <span className="text-sm">Tu media: <span className="font-bold">{data.average.calories}</span> kcal</span>
          <span className={`text-sm ${getTrendColor(data.today.calories - data.average.calories)}`}>
            {data.today.calories - data.average.calories > 0 ? "Por encima" : "Por debajo"} del promedio
          </span>
        </div>
      </div>

      {/* Insight */}
      <motion.div
        className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm text-indigo-300">
          💡 {diff.calories < 0 
            ? `¡Bien! Has reducido ${Math.abs(diff.calories)} kcal respecto a ayer.` 
            : diff.calories > 0 
            ? `Has consumido ${diff.calories} kcal más que ayer.` 
            : "Misma ingesta calórica que ayer."}
        </p>
      </motion.div>
    </div>
  );
}
