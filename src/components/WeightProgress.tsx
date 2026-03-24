"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Target, Award } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface WeightEntry {
  date: string;
  weight: number;
}

interface WeightProgressProps {
  userId: string;
  goalWeight?: number;
}

export function WeightProgress({ userId, goalWeight = 70 }: WeightProgressProps) {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const { light } = useHaptic();

  useEffect(() => {
    const saved = localStorage.getItem(`weight-${userId}`);
    if (saved) {
      setEntries(JSON.parse(saved));
    } else {
      // Sample data
      const sample: WeightEntry[] = [];
      const today = new Date();
      let weight = 78;
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        weight += (Math.random() - 0.5) * 0.3;
        sample.push({ date: date.toISOString().split("T")[0], weight: Number(weight.toFixed(1)) });
      }
      setEntries(sample);
    }
  }, [userId]);

  const currentWeight = entries[entries.length - 1]?.weight || 75;
  const startWeight = entries[0]?.weight || 78;
  const totalChange = (currentWeight - startWeight).toFixed(1);
  const toGoal = (currentWeight - goalWeight).toFixed(1);
  const progressPercent = Math.min(100, Math.max(0, ((startWeight - currentWeight) / (startWeight - goalWeight)) * 100));

  const isLosing = Number(totalChange) < 0;

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-xs text-zinc-400 mb-1">Actual</p>
          <p className="text-xl font-bold">{currentWeight} kg</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-xs text-zinc-400 mb-1">Cambio</p>
          <div className="flex items-center justify-center gap-1">
            {isLosing ? <TrendingDown size={16} className="text-green-400" /> : <TrendingUp size={16} className="text-red-400" />}
            <p className={`text-xl font-bold ${isLosing ? "text-green-400" : "text-red-400"}`}>{totalChange} kg</p>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-xs text-zinc-400 mb-1">Meta</p>
          <p className="text-xl font-bold text-purple-400">{goalWeight} kg</p>
        </div>
      </div>

      {/* Progress to goal */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">Progreso hacia meta</span>
          <span className="text-sm font-medium">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/10 overflow-hidden mb-2">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-sm text-zinc-400">
          {Number(toGoal) > 0 ? `${toGoal} kg para llegar a tu meta` : "¡Meta alcanzada! 🎉"}
        </p>
      </div>

      {/* Mini chart */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-sm text-zinc-400 mb-3">Últimos 7 días</p>
        <div className="flex items-end justify-between gap-1 h-20">
          {entries.slice(-7).map((entry, i) => {
            const minW = Math.min(...entries.slice(-7).map((e) => e.weight));
            const maxW = Math.max(...entries.slice(-7).map((e) => e.weight));
            const range = maxW - minW || 1;
            const height = ((entry.weight - minW) / range) * 100;
            return (
              <motion.div
                key={entry.date}
                className="flex-1 rounded-t bg-gradient-to-t from-green-500/60 to-green-400/40"
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(10, 100 - height)}%` }}
                transition={{ delay: i * 0.1 }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          <span>{entries[entries.length - 7]?.weight} kg</span>
          <span>{currentWeight} kg</span>
        </div>
      </div>
    </div>
  );
}
