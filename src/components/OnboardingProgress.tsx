"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, User, Target, Utensils, Scale, Activity } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepChange?: (step: number) => void;
}

const STEPS = [
  { icon: User, title: "Tu perfil", description: "Datos básicos" },
  { icon: Activity, title: "Tu objetivo", description: "Meta de peso" },
  { icon: Utensils, title: "Preferencias", description: "Comidas y restricciones" },
  { icon: Scale, title: "Listo", description: "Comenzar" },
];

export function OnboardingProgress({ currentStep, totalSteps, onStepChange }: OnboardingProgressProps) {
  const { light } = useHaptic();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <motion.button
              key={index}
              onClick={() => {
                if (index <= currentStep) {
                  light();
                  onStepChange?.(index);
                }
              }}
              className={`flex flex-col items-center ${
                index <= currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-colors ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/30"
                    : "bg-white/10 text-zinc-500"
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isCompleted ? <Check size={20} /> : <Icon size={20} />}
              </motion.div>
              <p className={`text-xs font-medium ${isActive ? "text-green-400" : "text-zinc-500"}`}>
                {step.title}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step counter */}
      <div className="text-center">
        <span className="text-sm text-zinc-400">
          Paso {currentStep + 1} de {totalSteps}
        </span>
      </div>
    </div>
  );
}
