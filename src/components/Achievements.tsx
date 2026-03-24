"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, X, Star, Trophy, Flame, Target, Zap, Check } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

interface AchievementsProps {
  userId: string;
}

const ALL_ACHIEVEMENTS: Omit<Achievement, "unlocked" | "unlockedAt" | "progress">[] = [
  { id: "first_log", name: "Primer paso", description: "Registra tu primera comida", icon: "🍽️", xp: 10 },
  { id: "week_streak", name: "Racha semanal", description: "7 días consecutivos", icon: "🔥", xp: 50 },
  { id: "month_streak", name: "Dedicación", description: "30 días consecutivos", icon: "🏆", xp: 200 },
  { id: "healthy_week", name: "Semana healthy", description: "Cumple tu objetivo 5 días", icon: "🥗", xp: 75 },
  { id: "calorie_master", name: "Maestro calórico", description: "10 días bajo objetivo", icon: "⚡", xp: 100 },
  { id: "protein_king", name: "Rey de la proteína", description: "150g+ proteína un día", icon: "💪", xp: 60 },
  { id: "water_logger", name: "Hidratado", description: "Registra 8 vasos de agua", icon: "💧", xp: 30 },
  { id: "early_bird", name: "Madrugador", description: "Registra antes de las 8am", icon: "🌅", xp: 25 },
  { id: "night_owl", name: "Noctámbulo", description: "Registra después de las 10pm", icon: "🦉", xp: 25 },
  { id: "variety_seeker", name: "Variedad", description: "10 alimentos distintos", icon: "🎨", xp: 40 },
  { id: "social_share", name: "Social", description: "Comparte tu progreso", icon: "📱", xp: 20 },
  { id: "perfectionist", name: "Perfeccionista", description: "100% macros un día", icon: "✨", xp: 80 },
];

export function Achievements({ userId }: AchievementsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showUnlock, setShowUnlock] = useState<Achievement | null>(null);
  const { success } = useHaptic();

  useEffect(() => {
    // Load saved achievements
    const saved = localStorage.getItem(`achievements-${userId}`);
    if (saved) {
      setAchievements(JSON.parse(saved));
    } else {
      // Initialize with all achievements as locked
      setAchievements(ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })));
    }
  }, [userId]);

  function unlockAchievement(id: string) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      const updated = achievements.map(a =>
        a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
      );
      setAchievements(updated);
      localStorage.setItem(`achievements-${userId}`, JSON.stringify(updated));
      setShowUnlock(achievement);
      success();
      setTimeout(() => setShowUnlock(null), 3000);
    }
  }

  function updateProgress(id: string, progress: number) {
    const updated = achievements.map(a =>
      a.id === id ? { ...a, progress } : a
    );
    setAchievements(updated);
    localStorage.setItem(`achievements-${userId}`, JSON.stringify(updated));
    
    // Check if target reached
    const achievement = updated.find(a => a.id === id);
    if (achievement && achievement.target && progress >= achievement.target) {
      unlockAchievement(id);
    }
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXp = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-yellow-400" />
          <h3 className="font-semibold">Logros</h3>
        </div>
        <div className="text-sm text-zinc-400">
          {unlockedCount}/{achievements.length} • {totalXp} XP
        </div>
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-4 gap-2">
        {achievements.map((achievement, i) => (
          <motion.button
            key={achievement.id}
            onClick={() => setSelectedAchievement(achievement)}
            className={`relative p-3 rounded-2xl border transition-colors ${
              achievement.unlocked
                ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-yellow-500/30"
                : "bg-white/5 border-white/10 opacity-50"
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-2xl mb-1">{achievement.icon}</div>
            {achievement.unlocked && (
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
                <Check size={10} className="text-black" />
              </div>
            )}
            {!achievement.unlocked && achievement.progress !== undefined && (
              <div className="absolute bottom-1 left-1 right-1 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${(achievement.progress / (achievement.target || 1)) * 100}%` }}
                />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Achievement detail modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              className="relative w-full max-w-sm p-6 rounded-3xl bg-gradient-to-br from-[#0a0a0f] to-[#12121a] border border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className={`w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center text-5xl ${
                selectedAchievement.unlocked
                  ? "bg-gradient-to-br from-yellow-500/30 to-orange-500/20 border border-yellow-500/30"
                  : "bg-white/5 border border-white/10"
              }`}>
                {selectedAchievement.icon}
              </div>

              <h3 className="text-xl font-bold text-center mb-1">{selectedAchievement.name}</h3>
              <p className="text-zinc-400 text-center text-sm mb-4">
                {selectedAchievement.description}
              </p>

              <div className="flex items-center justify-center gap-2 text-sm">
                <Star size={16} className="text-yellow-400" />
                <span className="text-yellow-400 font-medium">{selectedAchievement.xp} XP</span>
              </div>

              {selectedAchievement.unlocked ? (
                <div className="mt-4 text-center">
                  <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                    ✓ Desbloqueado
                  </span>
                </div>
              ) : selectedAchievement.progress !== undefined ? (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-zinc-400 mb-2">
                    <span>Progreso</span>
                    <span>{selectedAchievement.progress}/{selectedAchievement.target}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
                      style={{ width: `${(selectedAchievement.progress / (selectedAchievement.target || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlock notification */}
      <AnimatePresence>
        {showUnlock && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100]"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <div className="px-6 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-xl flex items-center gap-3">
              <Trophy size={24} />
              <div>
                <p className="font-bold">¡Logro desbloqueado!</p>
                <p className="text-sm opacity-90">{showUnlock.name} +{showUnlock.xp} XP</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
