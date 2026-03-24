"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Scale, Calendar } from "lucide-react";

interface WeightEntry {
  date: string;
  weight: number;
}

interface WeightChartProps {
  currentWeight: number;
  targetWeight: number;
  entries?: WeightEntry[];
}

export function WeightChart({ currentWeight, targetWeight, entries = [] }: WeightChartProps) {
  const [chartData, setChartData] = useState<WeightEntry[]>([]);
  
  // Generate sample data if no entries
  useEffect(() => {
    if (entries.length > 0) {
      setChartData(entries);
    } else {
      // Generate last 7 days sample
      const today = new Date();
      const sample = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        sample.push({
          date: date.toISOString().split("T")[0],
          weight: currentWeight + (Math.random() - 0.5) * (i * 0.2),
        });
      }
      setChartData(sample);
    }
  }, [entries, currentWeight]);

  const diff = currentWeight - targetWeight;
  const trend = diff > 0 ? "down" : diff < 0 ? "up" : "same";
  const TrendIcon = trend === "down" ? TrendingDown : trend === "up" ? TrendingUp : Minus;
  const trendColor = trend === "down" ? "text-green-400" : trend === "up" ? "text-red-400" : "text-zinc-400";

  const minWeight = Math.min(...chartData.map(d => d.weight), targetWeight);
  const maxWeight = Math.max(...chartData.map(d => d.weight), currentWeight);
  const range = maxWeight - minWeight || 1;

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scale size={18} className="text-green-400" />
          <span className="font-semibold">Peso</span>
        </div>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon size={16} />
          <span className="text-sm font-medium">
            {Math.abs(diff).toFixed(1)} kg
          </span>
        </div>
      </div>

      {/* Current weight */}
      <div className="text-center mb-4">
        <motion.span
          className="text-4xl font-bold"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {currentWeight.toFixed(1)}
        </motion.span>
        <span className="text-zinc-500 ml-1">kg</span>
      </div>

      {/* Mini chart */}
      <div className="h-16 relative mb-3">
        <div className="absolute inset-0 flex items-end justify-between gap-1">
          {chartData.map((entry, i) => {
            const height = ((entry.weight - minWeight) / range) * 100;
            const isToday = i === chartData.length - 1;
            return (
              <motion.div
                key={entry.date}
                className={`flex-1 rounded-t-sm transition-all ${
                  isToday ? "bg-green-500" : "bg-green-500/40"
                }`}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 10)}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              />
            );
          })}
        </div>
        {/* Target line */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-red-400/50"
          style={{
            bottom: `${((targetWeight - minWeight) / range) * 100}%`,
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>{chartData[0]?.date.slice(5) || "-"}</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-red-400/50 border-t border-dashed border-red-400" />
          <span>Objetivo: {targetWeight} kg</span>
        </div>
        <span>{chartData[chartData.length - 1]?.date.slice(5) || "-"}</span>
      </div>
    </div>
  );
}
