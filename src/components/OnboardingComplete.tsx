"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Trophy, ArrowRight, Star, Heart, Zap } from "lucide-react";
import confetti from "canvas-confetti";

interface OnboardingCompleteProps {
  userName?: string;
  dailyCalories?: number;
  onStartTracking?: () => void;
}

export function OnboardingComplete({
  userName,
  dailyCalories,
  onStartTracking,
}: OnboardingCompleteProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti on mount
    const timer = setTimeout(() => {
      setShowConfetti(true);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#22c55e", "#4ade80", "#86efac", "#a855f7", "#ec4899"],
        scalar: 1.2,
        drift: 0.5,
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle", "square"],
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      {/* Success animation */}
      <div className="relative mb-8">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 opacity-30 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <motion.div
          className="relative w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Check size={64} className="text-white" />
          </motion.div>
        </motion.div>

        {/* Orbiting stars */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${50 + (i === 0 ? -40 : i === 1 ? 40 : 0)}%`,
              left: `${50 + (i === 0 ? 0 : i === 1 ? 0 : -40)}%`,
            }}
            animate={{
              rotate: 360,
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity },
            }}
          >
            <Star size={24} className="text-yellow-400" />
          </motion.div>
        ))}
      </div>

      {/* Success message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4 mb-8"
      >
        <motion.h2
          className="text-3xl font-bold"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span className="gradient-text">¡Perfecto!</span>
        </motion.h2>
        
        <p className="text-zinc-400 max-w-xs">
          {userName ? `Hola, ${userName}!` : "¡Bienvenido!"} Tu plan nutricional está listo
        </p>

        {/* Stats preview */}
        {dailyCalories && (
          <motion.div
            className="p-6 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap size={20} className="text-yellow-400" />
              <span className="text-sm text-zinc-400">Tu objetivo diario</span>
            </div>
            <motion.p
              className="text-5xl font-bold gradient-text"
              key={dailyCalories}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {dailyCalories}
            </motion.p>
            <p className="text-zinc-400 mt-1">kcal / día</p>
          </motion.div>
        )}

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: Trophy, label: "Logros", color: "yellow" },
            { icon: Heart, label: "Salud", color: "red" },
            { icon: Sparkles, label: "Planes", color: "green" },
          ].map((feat, i) => (
            <motion.div
              key={feat.label}
              className="p-4 rounded-2xl glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <feat.icon size={24} className={`text-${feat.color}-400 mx-auto mb-2`} />
              <p className="text-xs text-zinc-400">{feat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        onClick={onStartTracking}
        className="w-full max-w-xs py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10 flex items-center gap-2">
          <span>Empezar a seguir</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight size={20} />
          </motion.div>
        </span>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>
    </div>
  );
}
