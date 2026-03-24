"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Check, Sparkles } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface TourStep {
  target: string;
  title: string;
  description: string;
  icon: string;
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip?: () => void;
}

export function OnboardingTour({ steps, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { light, success } = useHaptic();

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem("onboarding-tour-completed");
    if (!hasSeenTour) {
      setIsVisible(true);
    }
  }, []);

  function handleNext() {
    light();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  }

  function handlePrev() {
    light();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleComplete() {
    success();
    localStorage.setItem("onboarding-tour-completed", "true");
    setIsVisible(false);
    onComplete();
  }

  function handleSkip() {
    onSkip?.();
    handleComplete();
  }

  if (!isVisible) return null;

  const current = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Tooltip Card */}
        <motion.div
          className="relative w-full max-w-md mx-4 mb-8 p-6 rounded-3xl bg-gradient-to-br from-[#0a0a0f] to-[#12121a] border border-white/10 shadow-2xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 flex items-center justify-center text-4xl">
            {current.icon}
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-center mb-2">{current.title}</h3>
          <p className="text-zinc-400 text-center mb-6">{current.description}</p>

          {/* Step indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep
                    ? "w-6 bg-green-500"
                    : i < currentStep
                    ? "bg-green-500"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <motion.button
                onClick={handlePrev}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-medium flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
              >
                <ChevronLeft size={20} />
                Anterior
              </motion.button>
            )}
            
            <motion.button
              onClick={handleNext}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                currentStep === steps.length - 1
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  : "bg-white/10 text-white border border-white/20"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Check size={20} />
                  Finalizar
                </>
              ) : (
                <>
                  Siguiente
                  <ChevronRight size={20} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
