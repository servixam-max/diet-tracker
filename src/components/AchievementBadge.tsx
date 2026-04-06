"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Trophy, Star } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "streak" | "nutrition" | "exercise" | "water" | "social" | "milestone";
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

interface AchievementBadgeProps {
  userId: string;
}

const ALL_ACHIEVEMENTS: Omit<Achievement, "progress" | "unlocked" | "unlockedAt">[] = [
  { id: "1", name: "Primer paso", description: "Registra tu primera comida", icon: "👣", category: "nutrition", requirement: 1 },
  { id: "2", name: "Semana perfecta", description: "7 días consecutivos registrando", icon: "🔥", category: "streak", requirement: 7 },
  { id: "3", name: "Racha de un mes", description: "30 días consecutivos", icon: "💎", category: "streak", requirement: 30 },
  { id: "4", name: "Hidratado", description: "Bebe 2L de agua durante 5 días", icon: "💧", category: "water", requirement: 5 },
  { id: "5", name: "Maratoniano", description: "Ejercitate 300 minutos en una semana", icon: "🏃", category: "exercise", requirement: 300 },
  { id: "6", name: "Proteína power", description: "Alcanza tu meta de proteína 10 veces", icon: "💪", category: "nutrition", requirement: 10 },
  { id: "7", name: "Goal crusher", description: "Alcanza todos tus objetivos diarios", icon: "🎯", category: "milestone", requirement: 30 },
  { id: "8", name: "Early bird", description: "Registra tu desayuno antes de las 9am", icon: "🌅", category: "nutrition", requirement: 1 },
  { id: "9", name: "Noche de perros", description: "Duerme 8+ horas durante 7 días", icon: "🐕", category: "milestone", requirement: 7 },
  { id: "10", name: "Social butterfly", description: "Comparte tu progreso 5 veces", icon: "🦋", category: "social", requirement: 5 },
];

export function AchievementBadge({ userId }: AchievementBadgeProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = typeof window !== "undefined" 
      ? localStorage.getItem(`achievements-${userId}`) 
      : null;
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize with some progress
    const initial = ALL_ACHIEVEMENTS.map((a) => ({
      ...a,
      progress: Math.floor(Math.random() * a.requirement),
      unlocked: false,
    }));
    // Unlock some for demo
    initial[0].progress = 1;
    initial[0].unlocked = true;
    initial[1].progress = 5;
    return initial;
  });
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const { light } = useHaptic();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`achievements-${userId}`, JSON.stringify(achievements));
    }
  }, [achievements, userId]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  function openAchievement(achievement: Achievement) {
    light();
    setSelectedAchievement(achievement);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-yellow-400" />
          <h3 className="font-semibold">Logros</h3>
        </div>
        <span className="text-sm text-zinc-400">
          {unlockedCount} / {totalCount}
        </span>
      </div>

      {/* Progress summary */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Trophy size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-bold">{unlockedCount} logros desbloqueados</p>
            <p className="text-sm text-zinc-400">
              {totalCount - unlockedCount} más para completar
            </p>
            <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements grid */}
      <div className="grid grid-cols-4 gap-2">
        {achievements.map((achievement) => (
          <motion.button
            key={achievement.id}
            onClick={() => openAchievement(achievement)}
            className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all ${
              achievement.unlocked
                ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/30"
                : "bg-white/5 border border-white/10 opacity-50"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <span className={`text-2xl ${achievement.unlocked ? "" : "grayscale"}`}>
              {achievement.icon}
            </span>
            {achievement.unlocked && (
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center -mt-1">
                <Star size={10} className="text-white" />
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
            <div className="absolute inset-0 bg-black/80" />
            <motion.div
              className="relative w-full max-w-sm p-6 rounded-3xl bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] border border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`text-6xl mb-4 ${selectedAchievement.unlocked ? "" : "grayscale opacity-50"}`}>
                {selectedAchievement.icon}
              </div>
              <h3 className="text-xl font-bold mb-1">{selectedAchievement.name}</h3>
              <p className="text-zinc-400 mb-4">{selectedAchievement.description}</p>

              {selectedAchievement.unlocked ? (
                <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
                  <p className="text-green-400 font-medium flex items-center gap-2">
                    <Award size={18} />
                    ¡Desbloqueado! 🎉
                  </p>
                  {selectedAchievement.unlockedAt && (
                    <p className="text-sm text-zinc-400 mt-1">
                      {new Date(selectedAchievement.unlockedAt).toLocaleDateString("es-ES")}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progreso</span>
                    <span>{selectedAchievement.progress} / {selectedAchievement.requirement}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedAchievement.progress / selectedAchievement.requirement) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
