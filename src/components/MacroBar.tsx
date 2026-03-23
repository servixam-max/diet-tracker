"use client";

import { motion } from "framer-motion";

interface MacroBarProps {
  protein: number;
  proteinTarget: number;
  carbs: number;
  carbsTarget: number;
  fat: number;
  fatTarget: number;
}

export function MacroBar({ protein, proteinTarget, carbs, carbsTarget, fat, fatTarget }: MacroBarProps) {
  const proteinPct = Math.min((protein / proteinTarget) * 100, 100);
  const carbsPct = Math.min((carbs / carbsTarget) * 100, 100);
  const fatPct = Math.min((fat / fatTarget) * 100, 100);

  return (
    <div className="space-y-3">
      {/* Protein */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-blue-400 font-medium">Proteínas</span>
          <span className="text-zinc-500">{protein}g / {proteinTarget}g</span>
        </div>
        <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}
            initial={{ width: 0 }}
            animate={{ width: `${proteinPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
        </div>
      </div>

      {/* Carbs */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-yellow-400 font-medium">Carbohidratos</span>
          <span className="text-zinc-500">{carbs}g / {carbsTarget}g</span>
        </div>
        <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #eab308, #facc15)' }}
            initial={{ width: 0 }}
            animate={{ width: `${carbsPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>

      {/* Fat */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-red-400 font-medium">Grasas</span>
          <span className="text-zinc-500">{fat}g / {fatTarget}g</span>
        </div>
        <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #ef4444, #f87171)' }}
            initial={{ width: 0 }}
            animate={{ width: `${fatPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
