"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Trophy, Zap } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  icon: string;
  color: string;
}

interface GoalProgressProps {
  userId: string;
}

export function GoalProgress({ userId }: GoalProgressProps) {
  const [goals] = useState<Goal[]>([
    { id: "1", name: "Calorías", target: 2000, current: 1450, unit: "kcal", icon: "🔥", color: "#f97316" },
    { id: "2", name: "Proteína", target: 150, current: 85, unit: "g", icon: "💪", color: "#3b82f6" },
    { id: "3", name: "Pasos", target: 10000, current: 7200, unit: "", icon: "👟", color: "#22c55e" },
    { id: "4", name: "Agua", target: 8, current: 5, unit: "vasos", icon: "💧", color: "#06b6d4" },
  ]);
  const { light } = useHaptic();

  function getProgressPercent(goal: Goal) {
    return Math.min((goal.current / goal.target) * 100, 100);
  }

  function getStatusColor(goal: Goal) {
    const percent = getProgressPercent(goal);
    if (percent >= 100) return "text-green-400";
    if (percent >= 70) return "text-yellow-400";
    return "text-zinc-400";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-green-400" />
          <h3 className="font-semibold">Objetivos del día</h3>
        </div>
        <span className="text-sm text-zinc-500">Actualizado ahora</span>
      </div>

      <div className="space-y-3">
        {goals.map((goal, index) => {
          const progress = getProgressPercent(goal);
          const isComplete = progress >= 100;
          
          return (
            <motion.div
              key={goal.id}
              className="p-4 rounded-2xl bg-white/5 border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{goal.icon}</span>
                  <span className="font-medium">{goal.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`font-bold ${getStatusColor(goal)}`}>
                    {goal.current}
                  </span>
                  <span className="text-zinc-500">/ {goal.target} {goal.unit}</span>
                </div>
              </div>

              <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: goal.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-zinc-500">
                  {Math.round(progress)}% completado
                </span>
                {isComplete && (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <Trophy size={12} />
                    ¡Objetivo alcanzado!
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-green-500/20">
            <Zap size={18} className="text-green-400" />
          </div>
          <div>
            <p className="font-medium">Resumen del día</p>
            <p className="text-sm text-zinc-400">
              Vas bien, ¡continúa así! 🎯
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
