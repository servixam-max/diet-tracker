"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { Sparkles, User, Scale, Activity, Target, Zap, Utensils, Users, Brain } from "lucide-react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onBack?: () => void;
  canGoBack: boolean;
}

const stepIcons = [
  Sparkles,
  User,
  Scale,
  Activity,
  Target,
  Zap,
  Utensils,
  Users,
  Brain,
];

export function OnboardingProgress({
  currentStep,
  totalSteps,
  stepLabels,
  onBack,
  canGoBack,
}: OnboardingProgressProps) {
  const progress = (currentStep / totalSteps) * 100;
  const CurrentIcon = stepIcons[currentStep - 1] || Sparkles;

  return (
    <div className="space-y-4">
      {/* Header with step indicator and back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            key={currentStep}
          >
            <CurrentIcon className="text-white" />
          </motion.div>
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider">
              Paso {currentStep} de {totalSteps}
            </p>
            <p className="font-semibold">{stepLabels[currentStep - 1] || "Step"}</p>
          </div>
        </div>

        {canGoBack && onBack && (
          <motion.button
            onClick={onBack}
            className="p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Volver al paso anterior"
          >
            <ArrowLeft size={20} className="text-zinc-400" />
          </motion.button>
        )}
      </div>

      {/* Animated progress bar with glow */}
      <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step dots with active animation */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <motion.div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i + 1 === currentStep
                ? "w-8 bg-gradient-to-r from-green-400 to-emerald-500"
                : i + 1 < currentStep
                ? "w-2 bg-green-500"
                : "w-2 bg-white/20"
            }`}
            animate={i + 1 === currentStep ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
