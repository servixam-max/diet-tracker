"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Target, TrendingUp, Clock, Award, Zap } from "lucide-react";

interface QuickStatsProps {
  userId: string;
  targetCalories: number;
}

export function QuickStats({ userId, targetCalories }: QuickStatsProps) {
  const [stats, setStats] = useState({
    consumed: 0,
    remaining: targetCalories,
    streak: 0,
    mealsToday: 0,
    avgCalories: 0,
  });

  useEffect(() => {
    // Load today's data
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`daily-${userId}-${today}`);
    if (saved) {
      setStats(JSON.parse(saved));
    } else {
      // Sample data
      const consumed = Math.round(targetCalories * 0.65);
      setStats({
        consumed,
        remaining: targetCalories - consumed,
        streak: 7,
        mealsToday: 3,
        avgCalories: Math.round(targetCalories * 0.9),
      });
    }
  }, [userId, targetCalories]);

  const progress = (stats.consumed / targetCalories) * 100;
  const isOver = stats.consumed > targetCalories;

  const statCards = [
    {
      icon: Flame,
      label: "Consumidas",
      value: stats.consumed,
      unit: "kcal",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      progress: Math.min(progress, 100),
    },
    {
      icon: Target,
      label: "Restantes",
      value: Math.max(stats.remaining, 0),
      unit: "kcal",
      color: isOver ? "text-red-400" : "text-green-400",
      bgColor: isOver ? "bg-red-500/20" : "bg-green-500/20",
      progress: isOver ? 0 : Math.min((stats.remaining / targetCalories) * 100, 100),
    },
    {
      icon: Award,
      label: "Racha",
      value: stats.streak,
      unit: "días",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
    {
      icon: Zap,
      label: "Comidas",
      value: stats.mealsToday,
      unit: "hoy",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main calorie display */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-zinc-400" />
            <span className="text-sm text-zinc-400">Hoy</span>
          </div>
          <span className={`text-sm font-medium ${isOver ? "text-red-400" : "text-green-400"}`}>
            {isOver ? "+" : ""}{stats.consumed - targetCalories} kcal {isOver ? "excedidas" : "restantes"}
          </span>
        </div>

        {/* Circular progress */}
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-white/10"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className={isOver ? "text-red-500" : "text-green-500"}
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - Math.min(progress, 100) / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold">{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-3xl font-bold mb-1">
              <span className={isOver ? "text-red-400" : "text-green-400"}>{stats.consumed}</span>
              <span className="text-lg text-zinc-400">/{targetCalories}</span>
            </div>
            <p className="text-sm text-zinc-400">calorías consumidas</p>
            
            {/* Macro bars */}
            <div className="flex gap-2 mt-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-400">P</span>
                  <span className="text-zinc-500">45g</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-yellow-400">C</span>
                  <span className="text-zinc-500">65g</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-yellow-500"
                    initial={{ width: 0 }}
                    animate={{ width: "60%" }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-red-400">G</span>
                  <span className="text-zinc-500">25g</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: "40%" }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.slice(2).map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="p-4 rounded-2xl bg-white/5 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-2`}>
                <Icon size={20} className={stat.color} />
              </div>
              <p className="text-2xl font-bold">
                {stat.value}
                <span className="text-sm text-zinc-500 ml-1">{stat.unit}</span>
              </p>
              <p className="text-xs text-zinc-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
