"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Calendar, Flame, Target } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface NutritionStatsProps {
  userId: string;
}

interface DayStat {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  weight?: number;
}

export function NutritionStats({ userId }: NutritionStatsProps) {
  const [weeklyData, setWeeklyData] = useState<DayStat[]>([]);
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const { light } = useHaptic();

  useEffect(() => {
    // Generate sample data
    const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const sample = days.map((day, i) => ({
      date: day,
      calories: 1600 + Math.floor(Math.random() * 600),
      protein: 80 + Math.floor(Math.random() * 40),
      carbs: 150 + Math.floor(Math.random() * 80),
      fat: 55 + Math.floor(Math.random() * 30),
      weight: 78 + Math.random() * 2 - i * 0.2,
    }));
    setWeeklyData(sample);
  }, [userId]);

  const avgCalories = weeklyData.reduce((sum, d) => sum + d.calories, 0) / (weeklyData.length || 1);
  const avgProtein = weeklyData.reduce((sum, d) => sum + d.protein, 0) / (weeklyData.length || 1);
  const avgCarbs = weeklyData.reduce((sum, d) => sum + d.carbs, 0) / (weeklyData.length || 1);
  const avgFat = weeklyData.reduce((sum, d) => sum + d.fat, 0) / (weeklyData.length || 1);

  // Calculate trends (compare last 3 days to previous 4)
  const last3Avg = weeklyData.slice(-3).reduce((sum, d) => sum + d.calories, 0) / 3;
  const prev4Avg = weeklyData.slice(0, 4).reduce((sum, d) => sum + d.calories, 0) / 4;
  const calorieTrend = prev4Avg > 0 ? ((last3Avg - prev4Avg) / prev4Avg) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-green-400" />
          <h3 className="font-semibold">Estadísticas</h3>
        </div>
        
        {/* Period selector */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/5">
          {(["week", "month", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => { light(); setPeriod(p); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                period === p ? "bg-green-500 text-white" : "text-zinc-400"
              }`}
            >
              {p === "week" ? "Semana" : p === "month" ? "Mes" : "Año"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <Flame size={18} className="text-orange-400" />
            {calorieTrend > 0 ? (
              <TrendingUp size={16} className="text-red-400" />
            ) : calorieTrend < 0 ? (
              <TrendingDown size={16} className="text-green-400" />
            ) : (
              <Minus size={16} className="text-zinc-400" />
            )}
          </div>
          <p className="text-2xl font-bold">{Math.round(avgCalories)}</p>
          <p className="text-xs text-zinc-400">kcal/día promedio</p>
          {calorieTrend !== 0 && (
            <p className={`text-xs mt-1 ${calorieTrend > 0 ? "text-red-400" : "text-green-400"}`}>
              {calorieTrend > 0 ? "+" : ""}{calorieTrend.toFixed(1)}% vs anterior
            </p>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <Target size={18} className="text-blue-400" />
            <TrendingUp size={16} className="text-green-400" />
          </div>
          <p className="text-2xl font-bold">{Math.round(avgProtein)}g</p>
          <p className="text-xs text-zinc-400">proteína/día</p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-zinc-400">Calorías por día</p>
          <span className="text-xs text-zinc-500">vs objetivo 2000</span>
        </div>
        
        <div className="flex items-end justify-between gap-2 h-20">
          {weeklyData.map((day, i) => {
            const maxCal = 2500;
            const height = (day.calories / maxCal) * 100;
            const isOver = day.calories > 2000;
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(10, height)}%` }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className={`w-full rounded-t h-full ${
                    isOver ? "bg-gradient-to-t from-red-500 to-orange-500" : "bg-gradient-to-t from-green-500 to-emerald-500"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          {weeklyData.map((d, i) => (
            <span key={i}>{d.date}</span>
          ))}
        </div>
      </div>

      {/* Macro averages */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <p className="text-lg font-bold text-blue-400">{Math.round(avgProtein)}g</p>
          <p className="text-xs text-zinc-500">Proteína</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <p className="text-lg font-bold text-yellow-400">{Math.round(avgCarbs)}g</p>
          <p className="text-xs text-zinc-500">Carbos</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <p className="text-lg font-bold text-red-400">{Math.round(avgFat)}g</p>
          <p className="text-xs text-zinc-500">Grasas</p>
        </div>
      </div>
    </div>
  );
}
