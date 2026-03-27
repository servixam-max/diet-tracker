"use client";

import { memo } from "react";
import { motion } from "framer-motion";

interface MacrosSummaryProps {
  protein: number;
  carbs: number;
  fat: number;
}

export const MacrosSummary = memo(function MacrosSummary({ protein, carbs, fat }: MacrosSummaryProps) {
  const macros = [
    { label: 'Proteína', value: protein, color: 'text-blue-400', icon: '💪' },
    { label: 'Carbs', value: carbs, color: 'text-yellow-400', icon: '🌾' },
    { label: 'Grasas', value: fat, color: 'text-red-400', icon: '🥑' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {macros.map((macro, i) => (
        <motion.div 
          key={macro.label}
          className="text-center p-3 rounded-2xl bg-white/5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
        >
          <span className="text-lg">{macro.icon}</span>
          <p className={`text-lg font-bold ${macro.color}`}>{macro.value}g</p>
          <p className="text-xs text-zinc-500">{macro.label}</p>
        </motion.div>
      ))}
    </div>
  );
});
