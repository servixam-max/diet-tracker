"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Zap, Shield, Gift } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
  weeklyLogs: boolean[];
}

interface StreakCounterProps {
  userId: string;
}

export function StreakCounter({ userId }: StreakCounterProps) {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBonus, setShowBonus] = useState(false);
  const { light, success } = useHaptic();

  useEffect(() => {
    async function fetchStreak() {
      try {
        // In real app: fetch from Supabase user_streaks table
        // For demo: return zeros
        const response = await fetch('/api/streak');
        if (response.ok) {
          const data = await response.json();
          setStreak(data);
        } else {
          // Demo mode - show zeros
          setStreak({
            currentStreak: 0,
            longestStreak: 0,
            lastLogDate: null,
            weeklyLogs: [false, false, false, false, false, false, false],
          });
        }
      } catch (error) {
        console.error('Error fetching streak:', error);
        // Demo mode - show zeros
        setStreak({
          currentStreak: 0,
          longestStreak: 0,
          lastLogDate: null,
          weeklyLogs: [false, false, false, false, false, false, false],
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchStreak();
  }, [userId]);

  if (isLoading || !streak) {
    return (
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
        <div className="h-6 w-24 bg-white/10 rounded animate-pulse mb-4" />
        <div className="h-12 w-32 bg-white/10 rounded animate-pulse" />
      </div>
    );
  }

  const isStreakActive = streak.currentStreak > 0;
  const weeklyProgress = streak.weeklyLogs.filter(Boolean).length;

  function claimBonus() {
    light();
    setShowBonus(false);
    success();
    // In real app: award bonus XP or rewards
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={18} className={isStreakActive ? "text-orange-400" : "text-zinc-500"} />
          <h3 className="font-semibold">Racha</h3>
        </div>
        {streak.currentStreak >= 7 && (
          <span className="px-2 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold">
            🔥 ¡En llamas!
          </span>
        )}
      </div>

      {/* Main streak display */}
      <motion.div
        className={`relative p-6 rounded-3xl overflow-hidden ${
          isStreakActive
            ? "bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30"
            : "bg-white/5 border border-white/10"
        }`}
        animate={isStreakActive ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative flex items-center justify-between">
          <div className="text-center">
            <motion.div
              className="text-5xl mb-2"
              animate={isStreakActive ? { rotate: [-5, 5, -5] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              🔥
            </motion.div>
            <p className="text-4xl font-bold">{streak.currentStreak}</p>
            <p className="text-sm text-zinc-400">días seguidos</p>
          </div>

          <div className="text-center">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-2xl font-bold">{streak.longestStreak}</p>
            <p className="text-sm text-zinc-400">récord</p>
          </div>
        </div>
      </motion.div>

      {/* This week progress */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-zinc-400">Esta semana</p>
          <span className="text-sm font-medium">{weeklyProgress}/7 días</span>
        </div>
        <div className="flex gap-1">
          {["L", "M", "X", "J", "V", "S", "D"].map((day, i) => (
            <div key={i} className="flex-1 text-center">
              <div
                className={`w-full aspect-square rounded-lg flex items-center justify-center mb-1 ${
                  streak.weeklyLogs[i]
                    ? "bg-gradient-to-br from-green-500 to-emerald-500"
                    : "bg-white/10"
                }`}
              >
                {streak.weeklyLogs[i] && "✓"}
              </div>
              <span className="text-xs text-zinc-500">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Streak milestones */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Próximos objetivos</p>
        {[
          { days: 14, reward: "🎁 Bonus pack", progress: streak.currentStreak / 14 },
          { days: 30, reward: "👑 Legend badge", progress: streak.currentStreak / 30 },
          { days: 100, reward: "💎 VIP status", progress: streak.currentStreak / 100 },
        ].map((milestone) => (
          <div key={milestone.days} className="p-3 rounded-xl bg-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">🔥 {milestone.days} días</span>
              <span className="text-xs text-zinc-500">{milestone.reward}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, milestone.progress * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Streak save (for premium feature) */}
      {streak.currentStreak >= 7 && !showBonus && (
        <motion.button
          onClick={() => { light(); setShowBonus(true); }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          <Gift size={18} />
          Reclamar recompensa de racha
        </motion.button>
      )}

      {/* Bonus modal */}
      {showBonus && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowBonus(false)}
        >
          <div className="absolute inset-0 bg-black/80" />
          <motion.div
            className="relative p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 border border-white/20 max-w-sm w-full text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🎁
            </motion.div>
            <h3 className="text-xl font-bold mb-2">¡Racha de 7 días!</h3>
            <p className="text-zinc-300 mb-4">
              Has mantenido tu racha durante una semana. ¡Aquí tienes tu recompensa!
            </p>
            <div className="p-3 rounded-xl bg-white/10 mb-4">
              <p className="text-2xl font-bold">+100 XP</p>
              <p className="text-sm text-zinc-400">Puntos de experiencia</p>
            </div>
            <motion.button
              onClick={claimBonus}
              className="w-full py-3 rounded-xl bg-white text-purple-700 font-bold"
              whileTap={{ scale: 0.95 }}
            >
              Reclamar
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
