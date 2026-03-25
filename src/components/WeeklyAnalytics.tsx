"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Flame, Target, Award, Calendar } from "lucide-react";

interface DayData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  target: number;
}

interface WeeklyAnalyticsProps {
  targetCalories: number;
  entries?: DayData[];
}

export function WeeklyAnalytics({ targetCalories, entries = [] }: WeeklyAnalyticsProps) {
  const [data, setData] = useState<DayData[]>([]);
  
  useEffect(() => {
    if (entries.length > 0) {
      setData(entries);
    } else {
      // Generate sample data for last 7 days
      const today = new Date();
      const sample: DayData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayCalories = targetCalories * (0.8 + Math.random() * 0.4);
        sample.push({
          date: date.toISOString().split("T")[0],
          calories: Math.round(dayCalories),
          protein: Math.round(dayCalories * 0.25 / 4), // 25% of calories from protein
          carbs: Math.round(dayCalories * 0.45 / 4), // 45% of calories from carbs
          fat: Math.round(dayCalories * 0.30 / 9), // 30% of calories from fat
          target: targetCalories,
        });
      }
      setData(sample);
    }
  }, [entries, targetCalories]);

  // Calculate stats
  const totalCalories = data.reduce((sum, d) => sum + d.calories, 0);
  const avgCalories = Math.round(totalCalories / (data.length || 1));
  const avgVsTarget = ((avgCalories - targetCalories) / targetCalories * 100).toFixed(1);
  
  const daysOnTarget = data.filter(d => Math.abs(d.calories - d.target) < d.target * 0.1).length;
  const bestDay = data.reduce((best, d) => d.calories > best.calories ? d : best, data[0] || { calories: 0 });
  const worstDay = data.reduce((worst, d) => d.calories < worst.calories ? d : worst, data[0] || { calories: 0 });
  
  const trend = data.length >= 2 
    ? data[data.length - 1].calories - data[data.length - 2].calories 
    : 0;

  const maxCalories = Math.max(...data.map(d => Math.max(d.calories, d.target)));

  const dayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return dayLabels[date.getDay() === 0 ? 6 : date.getDay() - 1];
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calendar size={18} className="text-green-400" />
        <h3 className="font-semibold">Análisis semanal</h3>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          className="p-4 rounded-2xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            {trend >= 0 ? (
              <TrendingUp size={16} className="text-green-400" />
            ) : (
              <TrendingDown size={16} className="text-red-400" />
            )}
            <span className="text-xs text-zinc-400">Media</span>
          </div>
          <p className="text-2xl font-bold">{avgCalories}</p>
          <p className="text-xs text-zinc-500">
            {avgCalories > targetCalories ? "+" : ""}{avgVsTarget}% vs objetivo
          </p>
        </motion.div>

        <motion.div
          className="p-4 rounded-2xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-blue-400" />
            <span className="text-xs text-zinc-400">Días en objetivo</span>
          </div>
          <p className="text-2xl font-bold">{daysOnTarget}/7</p>
          <p className="text-xs text-zinc-500">
            {Math.round(daysOnTarget / 7 * 100)}% adherence
          </p>
        </motion.div>

        <motion.div
          className="p-4 rounded-2xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-yellow-400" />
            <span className="text-xs text-zinc-400">Mejor día</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{bestDay?.calories || 0}</p>
          <p className="text-xs text-zinc-500">kcal consumidas</p>
        </motion.div>

        <motion.div
          className="p-4 rounded-2xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Flame size={16} className="text-orange-400" />
            <span className="text-xs text-zinc-400">Calorías totales</span>
          </div>
          <p className="text-2xl font-bold">{totalCalories.toLocaleString('es-ES')}</p>
          <p className="text-xs text-zinc-500">esta semana</p>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-sm font-medium mb-4">Calorías por día</p>
        
        <div className="h-40 flex items-end justify-between gap-2">
          {data.map((day, i) => {
            const barHeight = (day.calories / maxCalories) * 100;
            const targetHeight = (day.target / maxCalories) * 100;
            const isToday = i === data.length - 1;
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-t-lg relative"
                  style={{ height: `${barHeight}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeight}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div
                    className={`absolute inset-0 rounded-t-lg ${
                      isToday ? "bg-gradient-to-t from-green-500 to-green-400" : "bg-gradient-to-t from-blue-500/60 to-blue-400/40"
                    }`}
                  />
                  {/* Target line */}
                  <div
                    className="absolute w-full h-0.5 bg-red-400/70 -top-0.5"
                    style={{ top: `${targetHeight}%` }}
                  />
                </motion.div>
                <span className={`text-[10px] ${isToday ? "text-green-400 font-medium" : "text-zinc-500"}`}>
                  {getDayLabel(day.date)}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-blue-500/60" />
            <span>Consumidas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-red-400/70" />
            <span>Objetivo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
