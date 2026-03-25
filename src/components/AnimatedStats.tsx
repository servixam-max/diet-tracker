"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown, Minus, Activity, Target, Zap } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  previousValue?: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  trend?: "up" | "down" | "neutral";
  delay?: number;
}

export function AnimatedStatCard({ 
  title, 
  value, 
  previousValue, 
  unit, 
  icon, 
  color,
  trend = "neutral",
  delay = 0 
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      delay: delay,
      ease: [0.34, 1.56, 0.64, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    
    return () => controls.stop();
  }, [value, delay]);
  
  const trendIcon = trend === "up" ? <TrendingUp size={14} /> : 
                   trend === "down" ? <TrendingDown size={14} /> : 
                   <Minus size={14} />;
  
  const trendColor = trend === "up" ? "text-green-400" : 
                     trend === "down" ? "text-red-400" : 
                     "text-zinc-400";

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl p-5 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent"
        animate={{
          opacity: isHovered ? 1 : 0.7,
        }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{
          boxShadow: `inset 0 0 40px ${color}20`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Border */}
      <div className="absolute inset-0 rounded-3xl border border-white/10" />
      <motion.div
        className="absolute inset-0 rounded-3xl border"
        style={{
          borderColor: color,
        }}
        animate={{
          opacity: isHovered ? 0.5 : 0,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <motion.div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? [0, -5, 5, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ color }}>{icon}</div>
          </motion.div>
          
          {previousValue !== undefined && (
            <motion.div 
              className={`flex items-center gap-1 text-xs font-medium ${trendColor} bg-white/5 px-2 py-1 rounded-full`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.5 }}
            >
              {trendIcon}
              <span>{previousValue > 0 ? Math.round(((value - previousValue) / previousValue) * 100) : 0}%</span>
            </motion.div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-zinc-400">{title}</p>
          <div className="flex items-baseline gap-1">
            <motion.span 
              className="text-3xl font-bold text-white"
              key={displayValue}
            >
              {displayValue.toLocaleString('es-ES')}
            </motion.span>
            <span className="text-sm text-zinc-500">{unit}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Circular progress stat
interface CircularStatProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  icon?: React.ReactNode;
  label: string;
}

export function CircularStat({ 
  value, 
  max, 
  size = 100, 
  strokeWidth = 8,
  color = "#22c55e",
  icon,
  label 
}: CircularStatProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;
  
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.34, 1.56, 0.64, 1],
      onUpdate: (latest) => setAnimatedValue(Math.round(latest)),
    });
    
    return () => controls.stop();
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={`statGradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity={0.6} />
            </linearGradient>
          </defs>
          
          {/* Background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#statGradient-${label})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && (
            <div className="mb-1" style={{ color }}>{icon}</div>
          )}
          <span className="text-xl font-bold text-white">{animatedValue}</span>
          <span className="text-xs text-zinc-500">/ {max}</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-zinc-400">{label}</p>
    </div>
  );
}

// Stats grid
export function StatsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {children}
    </div>
  );
}

// Daily summary card
interface DailySummaryProps {
  calories: { current: number; target: number };
  protein: { current: number; target: number };
  carbs: { current: number; target: number };
  fat: { current: number; target: number };
}

export function DailySummary({ calories, protein, carbs, fat }: DailySummaryProps) {
  const macros = [
    { ...calories, label: "Calorías", color: "#22c55e", icon: <Zap size={16} /> },
    { ...protein, label: "Proteína", color: "#3b82f6", icon: <Activity size={16} /> },
    { ...carbs, label: "Carbs", color: "#eab308", icon: <TrendingUp size={16} /> },
    { ...fat, label: "Grasas", color: "#ef4444", icon: <Target size={16} /> },
  ];

  return (
    <motion.div
      className="rounded-3xl p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Activity className="text-green-400" size={20} />
        Resumen del día
      </h3>
      
      <div className="grid grid-cols-2 gap-6">
        {macros.map((macro, index) => (
          <CircularStat
            key={macro.label}
            value={macro.current}
            max={macro.target}
            label={macro.label}
            color={macro.color}
            icon={macro.icon}
          />
        ))}
      </div>
    </motion.div>
  );
}
