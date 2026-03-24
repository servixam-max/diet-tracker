"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, TrendingUp, Scale, PieChart, Flame } from "lucide-react";

interface MonthlyData {
  date: string;
  weight: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MonthlyTrendsProps {
  userId: string;
  currentWeight: number;
  targetCalories: number;
}

export function MonthlyTrends({ userId, currentWeight, targetCalories }: MonthlyTrendsProps) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [selectedView, setSelectedView] = useState<"weight" | "calories" | "macros">("weight");

  useEffect(() => {
    // Generate sample monthly data (last 30 days)
    const today = new Date();
    const sample: MonthlyData[] = [];
    let baseWeight = currentWeight + 2; // Start slightly higher
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Simulate gradual weight loss
      baseWeight = baseWeight - 0.05 + (Math.random() - 0.5) * 0.3;
      
      const dayCalories = targetCalories * (0.85 + Math.random() * 0.3);
      
      sample.push({
        date: date.toISOString().split("T")[0],
        weight: parseFloat(baseWeight.toFixed(1)),
        calories: Math.round(dayCalories),
        protein: Math.round(dayCalories * 0.25 / 4),
        carbs: Math.round(dayCalories * 0.45 / 4),
        fat: Math.round(dayCalories * 0.30 / 9),
      });
    }
    setData(sample);
  }, [userId, currentWeight, targetCalories]);

  // Calculate trends
  const weightStart = data[0]?.weight || 0;
  const weightEnd = data[data.length - 1]?.weight || 0;
  const weightChange = weightEnd - weightStart;
  
  const avgCalories = Math.round(data.reduce((sum, d) => sum + d.calories, 0) / (data.length || 1));
  const calorieTrend = data.length >= 2 
    ? data[data.length - 1].calories - data[data.length - 2].calories 
    : 0;

  // Macro averages
  const avgProtein = Math.round(data.reduce((sum, d) => sum + d.protein, 0) / (data.length || 1));
  const avgCarbs = Math.round(data.reduce((sum, d) => sum + d.carbs, 0) / (data.length || 1));
  const avgFat = Math.round(data.reduce((sum, d) => sum + d.fat, 0) / (data.length || 1));

  // Get month label
  const getMonthLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()} ${["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"][date.getMonth()]}`;
  };

  // Simplify data for chart (weekly points)
  const weeklyData = data.filter((_, i) => i % 5 === 0 || i === data.length - 1);

  const maxWeight = Math.max(...data.map(d => d.weight));
  const minWeight = Math.min(...data.map(d => d.weight));
  const weightRange = maxWeight - minWeight || 1;

  const maxCalories = Math.max(...data.map(d => d.calories));
  const minCalories = Math.min(...data.map(d => d.calories));
  const calorieRange = maxCalories - minCalories || 1;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LineChart size={18} className="text-purple-400" />
          <h3 className="font-semibold">Tendencias mensuales</h3>
        </div>
        
        {/* View selector */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/5">
          <button
            onClick={() => setSelectedView("weight")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedView === "weight" ? "bg-green-500 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Peso
          </button>
          <button
            onClick={() => setSelectedView("calories")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedView === "calories" ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Kcal
          </button>
          <button
            onClick={() => setSelectedView("macros")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedView === "macros" ? "bg-blue-500 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Macros
          </button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-2">
        <motion.div
          className="p-3 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-1 mb-1">
            <Scale size={14} className="text-green-400" />
            <span className="text-xs text-zinc-400">Peso</span>
          </div>
          <p className="text-lg font-bold">{weightEnd.toFixed(1)}</p>
          <p className={`text-xs ${weightChange < 0 ? "text-green-400" : weightChange > 0 ? "text-red-400" : "text-zinc-400"}`}>
            {weightChange < 0 ? "-" : "+"}{Math.abs(weightChange).toFixed(1)} kg
          </p>
        </motion.div>

        <motion.div
          className="p-3 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-1 mb-1">
            <Flame size={14} className="text-orange-400" />
            <span className="text-xs text-zinc-400">Media kcal</span>
          </div>
          <p className="text-lg font-bold">{avgCalories}</p>
          <p className={`text-xs ${calorieTrend < 0 ? "text-green-400" : "text-red-400"}`}>
            {calorieTrend > 0 ? "+" : ""}{calorieTrend}
          </p>
        </motion.div>

        <motion.div
          className="p-3 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-1 mb-1">
            <PieChart size={14} className="text-blue-400" />
            <span className="text-xs text-zinc-400">Proteína</span>
          </div>
          <p className="text-lg font-bold">{avgProtein}g</p>
          <p className="text-xs text-zinc-500">{Math.round(avgProtein * 4 / avgCalories)}% kcal</p>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-sm font-medium mb-4">
          {selectedView === "weight" ? "Evolución del peso" : selectedView === "calories" ? "Tendencia calórica" : "Distribución de macros"}
        </p>
        
        {selectedView === "weight" && (
          <div className="h-48 relative">
            <div className="absolute inset-0 flex items-end justify-between gap-1">
              {weeklyData.map((point, i) => {
                const height = ((point.weight - minWeight) / weightRange) * 100;
                const isLast = i === weeklyData.length - 1;
                
                return (
                  <div key={point.date} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className="w-full relative"
                      style={{ height: `${Math.max(height, 20)}%` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div
                        className={`absolute bottom-0 w-full rounded-t-lg ${
                          isLast ? "bg-gradient-to-t from-green-500 to-green-400" : "bg-gradient-to-t from-green-500/60 to-green-400/40"
                        }`}
                        style={{ height: "100%" }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-green-400 whitespace-nowrap">
                          {point.weight}
                        </div>
                      </div>
                    </motion.div>
                    <span className="text-[9px] text-zinc-500 rotate-[-45deg] origin-top-left translate-y-2">
                      {getMonthLabel(point.date)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedView === "calories" && (
          <div className="h-48 relative">
            <div className="absolute inset-0 flex items-end justify-between gap-1">
              {weeklyData.map((point, i) => {
                const height = ((point.calories - minCalories) / calorieRange) * 100;
                const isLast = i === weeklyData.length - 1;
                const aboveTarget = point.calories > targetCalories;
                
                return (
                  <div key={point.date} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className="w-full relative"
                      style={{ height: `${Math.max(height, 20)}%` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div
                        className={`absolute bottom-0 w-full rounded-t-lg ${
                          isLast 
                            ? aboveTarget ? "bg-gradient-to-t from-red-500 to-red-400" : "bg-gradient-to-t from-green-500 to-green-400"
                            : aboveTarget ? "bg-gradient-to-t from-red-500/60 to-red-400/40" : "bg-gradient-to-t from-blue-500/60 to-blue-400/40"
                        }`}
                        style={{ height: "100%" }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-zinc-300 whitespace-nowrap">
                          {point.calories}
                        </div>
                      </div>
                    </motion.div>
                    <span className="text-[9px] text-zinc-500 rotate-[-45deg] origin-top-left translate-y-2">
                      {getMonthLabel(point.date)}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Target line */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-orange-400/50"
              style={{
                bottom: `${((targetCalories - minCalories) / calorieRange) * 100}%`,
              }}
            />
          </div>
        )}

        {selectedView === "macros" && (
          <div className="space-y-3">
            {/* Macro distribution pie chart (simple div-based) */}
            <div className="flex items-center justify-center gap-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="12"
                    strokeDasharray={`${(avgProtein * 4 / avgCalories) * 251} 251`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="12"
                    strokeDasharray={`${(avgCarbs * 4 / avgCalories) * 251} 251`}
                    strokeDashoffset={`-${(avgProtein * 4 / avgCalories) * 251}`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeDasharray={`${(avgFat * 9 / avgCalories) * 251} 251`}
                    strokeDashoffset={`-${((avgProtein * 4 + avgCarbs * 4) / avgCalories) * 251}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-zinc-400">Promedio</p>
                  <p className="text-sm font-bold">{avgCalories}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Proteína: {avgProtein}g</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Carbos: {avgCarbs}g</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm">Grasas: {avgFat}g</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        {selectedView !== "macros" && (
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-sm ${selectedView === "weight" ? "bg-green-500/60" : "bg-blue-500/60"}`} />
              <span>{selectedView === "weight" ? "Peso" : "Consumidas"}</span>
            </div>
            {selectedView === "calories" && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 border-t border-dashed border-orange-400" />
                <span>Objetivo</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
