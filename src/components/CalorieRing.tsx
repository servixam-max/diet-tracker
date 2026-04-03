"use client";

import { motion } from "framer-motion";
import { memo } from "react";

interface CalorieRingProps {
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
}

export const CalorieRing = memo(function CalorieRing({ current, target, size = 180, strokeWidth = 12 }: CalorieRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(current / target, 1);
  const offset = circumference - progress * circumference;

  const percentage = Math.round((current / target) * 100);
  const isOver = current > target;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="circular-progress">
        <defs>
          <linearGradient id="caloriesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isOver ? "#ef4444" : "#22c55e"} />
            <stop offset="100%" stopColor={isOver ? "#f87171" : "#4ade80"} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#caloriesGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          filter="url(#glow)"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute flex flex-col items-center">
        <motion.span 
          className={`text-3xl font-bold ${isOver ? 'text-red-400' : 'gradient-text'}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {current.toLocaleString('es-ES')}
        </motion.span>
        <motion.span 
          className="text-xs text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          de {target.toLocaleString('es-ES')} kcal
        </motion.span>
        <motion.span 
          className={`text-xs font-medium mt-1 ${isOver ? 'text-red-400' : 'text-green-400'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  );
});

CalorieRing.displayName = 'CalorieRing';
