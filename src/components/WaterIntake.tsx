"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, Plus, Minus, Flame, Target } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface WaterIntakeProps {
  userId: string;
  dailyGoal?: number; // ml
}

export function WaterIntake({ userId, dailyGoal = 2500 }: WaterIntakeProps) {
  const [intake, setIntake] = useState(0);
  const [goal] = useState(dailyGoal);
  const { light, success } = useHaptic();

  useEffect(() => {
    const saved = localStorage.getItem(`water-${userId}`);
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem(`water-date-${userId}`);
    
    if (saved && savedDate === today) {
      setIntake(parseInt(saved));
    } else {
      setIntake(0);
      localStorage.setItem(`water-date-${userId}`, today);
    }
  }, [userId]);

  function addWater(amount: number) {
    light();
    const newIntake = intake + amount;
    setIntake(newIntake);
    localStorage.setItem(`water-${userId}`, newIntake.toString());
    if (newIntake >= goal) success();
  }

  function removeWater(amount: number) {
    light();
    const newIntake = Math.max(0, intake - amount);
    setIntake(newIntake);
    localStorage.setItem(`water-${userId}`, newIntake.toString());
  }

  const percentage = Math.min(100, (intake / goal) * 100);
  const glasses = Math.floor(intake / 250); // 250ml per glass

  const getBottleIcon = () => {
    if (percentage >= 100) return "🥤";
    if (percentage >= 75) return "🍶";
    if (percentage >= 50) return "🫗";
    if (percentage >= 25) return "🧴";
    return "💧";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-blue-400" />
          <h3 className="font-semibold">Hidratación</h3>
        </div>
        <span className="text-sm text-zinc-400">
          {intake} / {goal} ml
        </span>
      </div>

      {/* Main display */}
      <motion.div
        className="relative p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 text-center overflow-hidden"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        {/* Animated background waves */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-blue-500/10"
            animate={{ height: [`${percentage/2}%`, `${(percentage+5)/2}%`, `${percentage/2}%`] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10">
          <motion.span
            className="text-6xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {getBottleIcon()}
          </motion.span>
          
          <p className="text-4xl font-bold mt-2">{intake}<span className="text-lg text-zinc-400 ml-1">ml</span></p>
          
          {/* Progress bar */}
          <div className="mt-4 h-3 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <p className="mt-2 text-sm text-zinc-400">
            {percentage >= 100 ? "🎉 ¡Meta alcanzada!" : `${Math.round(percentage)}% de tu meta`}
          </p>
        </div>
      </motion.div>

      {/* Quick add buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[100, 250, 500, 750].map((amount) => (
          <motion.button
            key={amount}
            onClick={() => addWater(amount)}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center hover:bg-white/10"
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-lg font-bold">+{amount}</p>
            <p className="text-xs text-zinc-500">ml</p>
          </motion.button>
        ))}
      </div>

      {/* Glass counter */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🥛</span>
          <div>
            <p className="font-medium">Vasos de agua</p>
            <p className="text-sm text-zinc-400">{glasses} vasos ({glasses * 250} ml)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => removeWater(250)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <Minus size={18} />
          </motion.button>
          <motion.button
            onClick={() => addWater(250)}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <Plus size={18} />
          </motion.button>
        </div>
      </div>

      {/* Hydration tips */}
      <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
        <p className="text-sm text-zinc-400">
          💡 <span className="text-blue-400">Tip:</span> Bebe un vaso de agua antes de cada comida para mejorar la digestión.
        </p>
      </div>
    </div>
  );
}
