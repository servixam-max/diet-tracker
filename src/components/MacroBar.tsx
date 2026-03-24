"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

interface MacroBarProps {
  protein: number;
  proteinTarget: number;
  carbs: number;
  carbsTarget: number;
  fat: number;
  fatTarget: number;
}

function MacroBarComponent({ protein, proteinTarget, carbs, carbsTarget, fat, fatTarget }: MacroBarProps) {
  const reduceMotion = useReducedMotion();

  const { proteinPct, carbsPct, fatPct } = useMemo(() => ({
    proteinPct: Math.min((protein / proteinTarget) * 100, 100),
    carbsPct: Math.min((carbs / carbsTarget) * 100, 100),
    fatPct: Math.min((fat / fatTarget) * 100, 100),
  }), [protein, proteinTarget, carbs, carbsTarget, fat, fatTarget]);

  const duration = reduceMotion ? 0 : 0.8;

  return (
    <div className="space-y-3" role="progressbar" aria-label="Distribución de macronutrientes">
      {/* Protein */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-blue-400 font-medium">Proteínas</span>
          <span className="text-zinc-400">{protein}g / {proteinTarget}g</span>
        </div>
        <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}
            initial={{ width: 0 }}
            animate={{ width: `${proteinPct}%` }}
            transition={{ duration, ease: "easeOut", delay: 0.1 }}
            aria-valuenow={protein}
            aria-valuemin={0}
            aria-valuemax={proteinTarget}
          />
        </div>
      </div>

      {/* Carbs */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-yellow-400 font-medium">Carbohidratos</span>
          <span className="text-zinc-400">{carbs}g / {carbsTarget}g</span>
        </div>
        <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #eab308, #facc15)' }}
            initial={{ width: 0 }}
            animate={{ width: `${carbsPct}%` }}
            transition={{ duration, ease: "easeOut", delay: 0.2 }}
            aria-valuenow={carbs}
            aria-valuemin={0}
            aria-valuemax={carbsTarget}
          />
        </div>
      </div>

      {/* Fat */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-red-400 font-medium">Grasas</span>
          <span className="text-zinc-400">{fat}g / {fatTarget}g</span>
        </div>
        <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #ef4444, #f87171)' }}
            initial={{ width: 0 }}
            animate={{ width: `${fatPct}%` }}
            transition={{ duration, ease: "easeOut", delay: 0.3 }}
            aria-valuenow={fat}
            aria-valuemin={0}
            aria-valuemax={fatTarget}
          />
        </div>
      </div>
    </div>
  );
}

export const MacroBar = memo(MacroBarComponent);
