"use client";

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Droplets, Plus, Minus, Trophy, Waves, Sparkles } from "lucide-react";
import { triggerHaptic, triggerConfetti } from "@/components/ui/Feedback";

interface WaterTrackerProps {
  dailyGoal?: number;
  userId?: string;
}

export function WaterTracker({ dailyGoal = 8, userId = "default" }: WaterTrackerProps) {
  const [glasses, setGlasses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastAddedTime, setLastAddedTime] = useState<Date | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    const saved = localStorage.getItem(`water-${userId}`);
    if (saved) {
      const data = JSON.parse(saved);
      const lastDate = new Date(data.date);
      const today = new Date();
      
      if (lastDate.toDateString() !== today.toDateString()) {
        if (data.glasses >= data.goal) {
          setStreak((s) => s + 1);
        } else {
          setStreak(0);
        }
        setGlasses(0);
      } else {
        setGlasses(data.glasses || 0);
        setStreak(data.streak || 0);
      }
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(
      `water-${userId}`,
      JSON.stringify({ 
        glasses, 
        goal: dailyGoal, 
        streak, 
        date: new Date().toISOString() 
      })
    );
  }, [glasses, dailyGoal, streak, userId]);

  const addGlass = useCallback(async () => {
    if (glasses < dailyGoal) {
      triggerHaptic("medium");
      setGlasses((g) => g + 1);
      setLastAddedTime(new Date());
      
      await controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.3 }
      });
      
      if (glasses + 1 === dailyGoal) {
        setShowCelebration(true);
        triggerConfetti();
        triggerHaptic("heavy");
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  }, [glasses, dailyGoal, controls]);

  const removeGlass = useCallback(() => {
    if (glasses > 0) {
      triggerHaptic("light");
      setGlasses((g) => g - 1);
    }
  }, [glasses]);

  const progress = Math.min((glasses / dailyGoal) * 100, 100);
  const isGoalMet = glasses >= dailyGoal;

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />
      <div className="absolute inset-0 backdrop-blur-xl" />
      <div className="absolute inset-0 border border-cyan-500/20 rounded-3xl" />
      
      {/* Animated wave background */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-full opacity-20"
        style={{
          background: `linear-gradient(to top, rgba(6, 182, 212, ${progress / 100 * 0.5}) 0%, transparent ${progress}%)`,
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Droplets className="w-6 h-6 text-cyan-400" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-white">Hidratación</h3>
              <p className="text-sm text-zinc-400">Meta: {dailyGoal} vasos</p>
            </div>
          </div>
          
          <AnimatePresence>
            {streak > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30"
              >
                <Trophy className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-400">{streak}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress circle */}
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <filter id="waterGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
              />
              
              {/* Progress */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#waterGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={283}
                animate={{
                  strokeDashoffset: 283 - (283 * progress) / 100,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                filter="url(#waterGlow)"
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                className="text-4xl font-bold text-white"
                key={glasses}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {glasses}
              </motion.span>
              <span className="text-sm text-zinc-400">/ {dailyGoal}</span>
            </div>

            {/* Celebration */}
            <AnimatePresence>
              {showCelebration && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Sparkles className="w-16 h-16 text-yellow-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Glasses grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {Array.from({ length: dailyGoal }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                if (i < glasses) {
                  removeGlass();
                } else if (i === glasses) {
                  addGlass();
                }
              }}
              className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-300 ${
                i < glasses
                  ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30"
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Droplets
                className={`w-5 h-5 ${
                  i < glasses ? "text-white" : "text-zinc-600"
                }`}
              />
            </motion.button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <motion.button
            onClick={removeGlass}
            disabled={glasses === 0}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Minus className="w-6 h-6 text-zinc-400" />
          </motion.button>
          
          <motion.button
            onClick={addGlass}
            disabled={glasses >= dailyGoal}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            Añadir vaso
          </motion.button>
        </div>

        {/* Goal reached message */}
        <AnimatePresence>
          {isGoalMet && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30 text-center"
            >
              <p className="text-green-400 font-semibold flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5" />
                ¡Meta alcanzada! 🎉
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
