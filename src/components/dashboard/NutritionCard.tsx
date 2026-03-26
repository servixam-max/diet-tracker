"use client";

import { motion } from "framer-motion";
import { Flame, Plus } from "lucide-react";

interface NutritionCardProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  targetCalories: number;
  progress: number;
  onAddFood: () => void;
  isLoading?: boolean;
}

export function NutritionCard({ 
  calories, 
  protein, 
  carbs, 
  fat, 
  targetCalories, 
  progress,
  onAddFood,
  isLoading 
}: NutritionCardProps) {
  if (isLoading) {
    return (
      <div 
        className="relative overflow-hidden rounded-3xl p-6 bg-white/5 border border-white/10"
        data-testid="nutrition-card-skeleton"
      >
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/10" />
            <div className="h-4 w-24 bg-white/10 rounded" />
          </div>
          <div className="h-12 w-32 bg-white/10 rounded" />
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 w-20 bg-white/10 rounded-xl" />
            ))}
          </div>
          <div className="h-14 w-full bg-white/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  const isOverTarget = progress > 100;

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl p-6"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent" />
      <div className="absolute inset-0 border border-green-500/20 rounded-3xl" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame size={20} className="text-orange-400" />
            </motion.div>
            <span className="text-sm text-zinc-400">Calorías de hoy</span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-bold">{calories}</span>
            <span className="text-lg text-zinc-500">/ {targetCalories}</span>
          </div>

          <div className="flex gap-4">
            {[
              { label: 'Proteínas', value: protein, color: 'text-blue-400', bg: 'bg-blue-500/20' },
              { label: 'Carbos', value: carbs, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
              { label: 'Grasas', value: fat, color: 'text-red-400', bg: 'bg-red-500/20' },
            ].map((macro) => (
              <div key={macro.label} className={`${macro.bg} px-3 py-1.5 rounded-xl`}>
                <p className={`text-sm font-bold ${macro.color}`}>{macro.value}g</p>
                <p className="text-xs text-zinc-400">{macro.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress ring */}
        <div className="relative ml-4">
          <svg className="transform -rotate-90" width={110} height={110}>
            <circle
              cx="55"
              cy="55"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="10"
            />
            <motion.circle
              cx="55"
              cy="55"
              r="45"
              fill="none"
              stroke={isOverTarget ? "#ef4444" : "#22c55e"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 45}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 - (progress / 100) * 2 * Math.PI * 45 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 6px ${isOverTarget ? "#ef4444" : "#22c55e"})` }}
              data-testid="progress-ring"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <motion.button
        onClick={onAddFood}
        className="w-full mt-5 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg shadow-green-500/30 relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Añadir nueva comida"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        />
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Plus size={22} />
          Añadir comida
        </span>
      </motion.button>
    </motion.div>
  );
}
