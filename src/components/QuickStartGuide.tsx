"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check, Play, Target, Flame, Droplets, Award } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface QuickStartGuideProps {
  onComplete?: () => void;
}

const STEPS = [
  {
    icon: Play,
    title: "Registra tus comidas",
    description: "Usa el botón + para añadir lo que comes. Puedes usar la cámara, código de barras, o escribir manualmente.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Target,
    title: "Fija tus objetivos",
    description: "Define cuántas calorías y macronutrientes quieres consumir cada día.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Droplets,
    title: "Mantente hidratado",
    description: "Registro cuántos vasos de agua bebes al día. Tu objetivo: 8 vasos.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Flame,
    title: "Construye tu racha",
    description: "Registra todas tus comidas para mantener tu racha de días consecutivos.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Award,
    title: "Desbloquea logros",
    description: "Completa objetivos para ganar XP y desbloquear logros especiales.",
    color: "from-yellow-500 to-orange-500",
  },
];

export function QuickStartGuide({ onComplete }: QuickStartGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { light, success } = useHaptic();

  function handleNext() {
    light();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  }

  function handleComplete() {
    success();
    localStorage.setItem("quickstart-completed", "true");
    setCompleted(true);
    setTimeout(() => {
      onComplete?.();
    }, 1500);
  }

  function handleSkip() {
    localStorage.setItem("quickstart-completed", "true");
    onComplete?.();
  }

  if (completed) {
    return (
      <motion.div
        className="fixed inset-0 z-[100] bg-[#0a0a0f]/95 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
          >
            <Check size={48} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">¡Listo para empezar!</h2>
          <p className="text-zinc-400">Tu viaje hacia una vida más saludable comienza ahora.</p>
        </motion.div>
      </motion.div>
    );
  }

  const step = STEPS[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0a0a0f]/95 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-sm">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-zinc-400 mb-2">
            <span>Paso {currentStep + 1} de {STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="text-center mb-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <motion.div
              className={`w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Icon size={40} className="text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
            <p className="text-zinc-400">{step.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="px-4 py-3 rounded-xl text-zinc-400 text-sm"
          >
            Saltar
          </button>
          <motion.button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            {currentStep === STEPS.length - 1 ? "Empezar" : "Siguiente"}
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
