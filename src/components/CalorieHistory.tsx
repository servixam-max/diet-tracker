"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Flame, Calendar } from "lucide-react";

interface DailyCalorie {
  date: string;
  calories: number;
  target: number;
}

interface CalorieHistoryProps {
  userId: string;
  targetCalories: number;
}

export function CalorieHistory({ userId, targetCalories }: CalorieHistoryProps) {
  const [data, setData] = useState<DailyCalorie[]>([]);
  const [viewMode, setViewMode] = useState<"7day" | "30day">("7day");

  useEffect(() => {
    // Generate sample data
    const today = new Date();
    const days = viewMode === "7day" ? 7 : 30;
    const sample: DailyCalorie[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Generate realistic calorie data with some variation
      const variance = Math.random() * 400 - 200; // +/- 200 calories
      const calories = targetCalories + variance;
      
      sample.push({
        date: date.toISOString().split("T")[0],
        calories: Math.round(calories),
        target: targetCalories,
      });
    }
    setData(sample);
  }, [userId, targetCalories, viewMode]);

  // Calculate stats
  const totalCalories = data.reduce((sum, d) => sum + d.calories, 0);
  const avgCalories = Math.round(totalCalories / (data.length || 1));
  const daysOnTarget = data.filter(d => Math.abs(d.calories - d.target) < d.target * 0.1).length;
  const adherenceRate = Math.round((daysOnTarget / data.length) * 100);
  
  const trend = data.length >= 2 
    ? data[data.length - 1].calories - data[0].calories 
    : 0;
  const trendDirection = trend > 0 ? "up" : trend < 0 ? "down" : "same";

  const maxCalories = Math.max(...data.map(d => Math.max(d.calories, d.target)));

  // Get day label
  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    return `${dayNames[date.getDay()]} ${date.getDate()}`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-orange-400" />
          <h3 className="font-semibold">Historial calórico</h3>
        </div>
        
        {/* View toggle */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/5">
          <button
            onClick={() => setViewMode("7day")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewMode === "7day" ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            7 días
          </button>
          <button
            onClick={() => setViewMode("30day")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewMode === "30day" ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            30 días
          </button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-2">
        <motion.div
          className="p-3 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-1 mb-1">
            <Flame size={14} className="text-orange-400" />
            <span className="text-xs text-zinc-400">Media</span>
          </div>
          <p className="text-lg font-bold">{avgCalories}</p>
          <p className="text-xs text-zinc-500">kcal/día</p>
        </motion.div>

        <motion.div
          className="p-3 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-1 mb-1">
            <Calendar size={14} className="text-green-400" />
            <span className="text-xs text-zinc-400">En objetivo</span>
          </div>
          <p className="text-lg font-bold">{daysOnTarget}</p>
          <p className="text-xs text-zinc-500">de {data.length} días</p>
        </motion.div>

        <motion.div
          className="p-3 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-1 mb-1">
            {trendDirection === "down" ? (
              <TrendingDown size={14} className="text-green-400" />
            ) : trendDirection === "up" ? (
              <TrendingUp size={14} className="text-red-400" />
            ) : (
              <Calendar size={14} className="text-zinc-400" />
            )}
            <span className="text-xs text-zinc-400">Tendencia</span>
          </div>
          <p className={`text-lg font-bold ${trendDirection === "down" ? "text-green-400" : trendDirection === "up" ? "text-red-400" : ""}`}>
            {Math.abs(trend)}
          </p>
          <p className="text-xs text-zinc-500">kcal {trend > 0 ? "más" : trend < 0 ? "menos" : "igual"}</p>
        </motion.div>
      </div>

      {/* Bar chart */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-sm font-medium mb-4">
          {viewMode === "7day" ? "Calorías diarias (7 días)" : "Calorías diarias (30 días)"}
        </p>
        
        <div className="h-48 relative">
          <div className="absolute inset-0 flex items-end justify-between gap-1">
            {data.map((day, i) => {
              const barHeight = (day.calories / maxCalories) * 100;
              const targetHeight = (day.target / maxCalories) * 100;
              const isToday = i === data.length - 1;
              const aboveTarget = day.calories > day.target;
              
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full relative"
                    style={{ height: `${Math.max(barHeight, 10)}%` }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${Math.max(barHeight, 10)}%`, opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <div
                      className={`absolute bottom-0 w-full rounded-t-md ${
                        isToday
                          ? aboveTarget ? "bg-gradient-to-t from-red-500 to-red-400" : "bg-gradient-to-t from-green-500 to-green-400"
                          : aboveTarget ? "bg-gradient-to-t from-orange-500/70 to-orange-400/50" : "bg-gradient-to-t from-blue-500/70 to-blue-400/50"
                      }`}
                      style={{ height: "100%" }}
                    >
                      {/* Calorie value on top of bar */}
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-medium text-zinc-300 whitespace-nowrap">
                        {day.calories}
                      </div>
                    </div>
                    
                    {/* Target line overlay */}
                    <div
                      className="absolute w-full h-0.5 bg-red-400/70"
                      style={{ bottom: `${targetHeight}%` }}
                    />
                  </motion.div>
                  
                  {/* Day label - only show every few days for 30-day view */}
                  <span className={`text-[8px] ${isToday ? "text-orange-400 font-medium" : "text-zinc-500"} ${
                    viewMode === "30day" && i % 5 !== 0 && i !== data.length - 1 ? "invisible" : ""
                  }`}>
                    {getDayLabel(day.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-blue-500/70" />
            <span>En objetivo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-orange-500/70" />
            <span>Excedido</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-red-400/70" />
            <span>Meta diaria</span>
          </div>
        </div>
      </div>

      {/* Adherence indicator */}
      <div className={`p-4 rounded-2xl border ${
        adherenceRate >= 80 ? "bg-green-500/10 border-green-500/30" :
        adherenceRate >= 60 ? "bg-yellow-500/10 border-yellow-500/30" :
        "bg-red-500/10 border-red-500/30"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${
              adherenceRate >= 80 ? "text-green-400" :
              adherenceRate >= 60 ? "text-yellow-400" :
              "text-red-400"
            }`}>
              {adherenceRate >= 80 ? "¡Excelente adherencia!" :
               adherenceRate >= 60 ? "Buen trabajo" :
               "Se puede mejorar"}
            </p>
            <p className="text-sm text-zinc-400">
              {adherenceRate}% de días en objetivo calórico
            </p>
          </div>
          <div className="text-3xl">
            {adherenceRate >= 80 ? "🎯" : adherenceRate >= 60 ? "💪" : "📈"}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              adherenceRate >= 80 ? "bg-green-500" :
              adherenceRate >= 60 ? "bg-yellow-500" :
              "bg-red-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${adherenceRate}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}
