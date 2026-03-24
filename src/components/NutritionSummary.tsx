"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Target, AlertCircle, Check } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface NutritionData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
}

interface NutritionSummaryProps {
  userId: string;
}

export function NutritionSummary({ userId }: NutritionSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const { light } = useHaptic();

  // Goals
  const goals = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
    fiber: 30,
    sodium: 2300,
    sugar: 50,
  };

  // Today's data (mock)
  const today: NutritionData = {
    date: new Date().toISOString(),
    calories: 1650,
    protein: 112,
    carbs: 155,
    fat: 48,
    fiber: 22,
    sodium: 1800,
    sugar: 38,
  };

  // Week data
  const weekData: NutritionData[] = [
    { date: "2024-03-18", calories: 1890, protein: 135, carbs: 190, fat: 62, fiber: 25, sodium: 2100, sugar: 42 },
    { date: "2024-03-19", calories: 2100, protein: 145, carbs: 220, fat: 70, fiber: 28, sodium: 2400, sugar: 48 },
    { date: "2024-03-20", calories: 1750, protein: 120, carbs: 180, fat: 55, fiber: 24, sodium: 1900, sugar: 35 },
    { date: "2024-03-21", calories: 1920, protein: 140, carbs: 195, fat: 65, fiber: 27, sodium: 2200, sugar: 44 },
    { date: "2024-03-22", calories: 1650, protein: 112, carbs: 155, fat: 48, fiber: 22, sodium: 1800, sugar: 38 },
  ];

  function calculateProgress(current: number, goal: number) {
    return Math.min(Math.round((current / goal) * 100), 100);
  }

  function getTrend(data: number[], current: number) {
    if (data.length < 2) return "stable";
    const avg = data.slice(0, -1).reduce((a, b) => a + b, 0) / (data.length - 1);
    const diff = ((current - avg) / avg) * 100;
    if (diff > 5) return "up";
    if (diff < -5) return "down";
    return "stable";
  }

  function getNutrientStatus(current: number, goal: number, name: string) {
    const progress = calculateProgress(current, goal);
    if (progress < 80) return { status: "low", color: "text-yellow-400", bg: "bg-yellow-500/10", icon: AlertCircle, message: `${name} bajo` };
    if (progress > 100) return { status: "high", color: "text-red-400", bg: "bg-red-500/10", icon: AlertCircle, message: `${name} muy alto` };
    return { status: "good", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: Check, message: `${name} bien` };
  }

  const macros = [
    { name: "Calorías", current: today.calories, goal: goals.calories, unit: "kcal", color: "from-orange-500 to-red-500" },
    { name: "Proteína", current: today.protein, goal: goals.protein, unit: "g", color: "from-blue-500 to-cyan-500" },
    { name: "Carbos", current: today.carbs, goal: goals.carbs, unit: "g", color: "from-yellow-500 to-amber-500" },
    { name: "Grasa", current: today.fat, goal: goals.fat, unit: "g", color: "from-red-500 to-pink-500" },
  ];

  const micros = [
    { name: "Fibra", current: today.fiber, goal: goals.fiber, unit: "g", icon: "F" },
    { name: "Sodio", current: today.sodium, goal: goals.sodium, unit: "mg", icon: "Na" },
    { name: "Azúcar", current: today.sugar, goal: goals.sugar, unit: "g", icon: "Az" },
  ];

  const calorieTrend = getTrend(weekData.map(d => d.calories), today.calories);
  const calorieStatus = getNutrientStatus(today.calories, goals.calories, "Calorías");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-blue-400" />
          <h3 className="font-semibold">Resumen nutricional</h3>
        </div>
        <button
          onClick={() => { light(); setExpanded(!expanded); }}
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          {expanded ? "Ocultar" : "Ver detalles"}
        </button>
      </div>

      {/* Main calorie card */}
      <div className={`p-4 rounded-2xl ${calorieStatus.bg} border border-white/10`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-zinc-400">Calorías de hoy</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${calorieStatus.color}`}>
                {today.calories.toLocaleString()}
              </span>
              <span className="text-zinc-500">/ {goals.calories.toLocaleString()} kcal</span>
            </div>
          </div>
          <div className={`p-2 rounded-xl ${
            calorieTrend === "up" ? "bg-orange-500/20" :
            calorieTrend === "down" ? "bg-emerald-500/20" : "bg-zinc-500/20"
          }`}>
            {calorieTrend === "up" ? <TrendingUp size={20} className="text-orange-400" /> :
             calorieTrend === "down" ? <TrendingDown size={20} className="text-emerald-400" /> :
             <Minus size={20} className="text-zinc-400" />}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-black/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${calculateProgress(today.calories, goals.calories)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          {calculateProgress(today.calories, goals.calories)}% del objetivo diario
        </p>
      </div>

      {/* Macros grid */}
      <div className="grid grid-cols-3 gap-2">
        {macros.slice(1).map((macro) => {
          const progress = calculateProgress(macro.current, macro.goal);
          return (
            <motion.div
              key={macro.name}
              className="p-3 rounded-xl bg-white/5 border border-white/10"
              whileTap={{ scale: 0.98 }}
            >
              <p className="text-xs text-zinc-500 mb-1">{macro.name}</p>
              <p className={`text-lg font-bold ${
                progress < 80 ? "text-yellow-400" :
                progress > 100 ? "text-red-400" : "text-emerald-400"
              }`}>
                {macro.current}{macro.unit}
              </p>
              <div className="h-1 bg-black/30 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${macro.color}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded micros view */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="space-y-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <h4 className="text-sm font-medium text-zinc-400">Micronutrientes</h4>
            <div className="grid grid-cols-3 gap-2">
              {micros.map((micro) => {
                const progress = calculateProgress(micro.current, micro.goal);
                return (
                  <div
                    key={micro.name}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-center"
                  >
                    <div className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center text-xs font-bold ${
                      progress < 80 ? "bg-yellow-500/20 text-yellow-400" :
                      progress > 100 ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {micro.icon}
                    </div>
                    <p className="text-xs text-zinc-500">{micro.name}</p>
                    <p className="text-sm font-bold">{micro.current}{micro.unit}</p>
                  </div>
                );
              })}
            </div>

            {/* Status messages */}
            <div className="space-y-2">
              {macros.concat([{ name: "Fibra", current: today.fiber, goal: goals.fiber, unit: "g", color: "" }]).map((nutrient) => {
                const status = getNutrientStatus(nutrient.current, nutrient.goal, nutrient.name);
                return (
                  <div
                    key={nutrient.name}
                    className={`p-3 rounded-xl ${status.bg} border border-white/5 flex items-center gap-3`}
                  >
                    <status.icon size={16} className={status.color} />
                    <span className={`text-sm ${status.color}`}>{status.message}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
