"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronRight, Sparkles, X, CheckCircle2 } from "lucide-react";
import { triggerHaptic } from "@/components/ui/Feedback";

interface Tip {
  id: string;
  category: "nutrition" | "exercise" | "sleep" | "motivation";
  title: string;
  description: string;
  emoji: string;
}

const TIPS: Tip[] = [
  { id: "1", category: "nutrition", title: "Proteína en cada comida", description: "Distribuye tu ingesta de proteína a lo largo del día para maximizar la síntesis muscular.", emoji: "💪" },
  { id: "2", category: "nutrition", title: "Hidratación constante", description: "Bebe al menos 8 vasos de agua al día. La deshidratación puede confundirse con hambre.", emoji: "💧" },
  { id: "3", category: "nutrition", title: "Fibra es tu amiga", description: "Incluye verduras en cada comida. La fibra mejora la digestión y mantiene la saciedad.", emoji: "🥦" },
  { id: "4", category: "exercise", title: "Camina más", description: "30 minutos de caminata al día pueden marcar la diferencia. Usa las escaleras en vez del ascensor.", emoji: "🚶" },
  { id: "5", category: "sleep", title: "Duerme 7-8 horas", description: "El sueño insuficiente afecta las hormonas del hambre. Intenta acostarte a la misma hora cada día.", emoji: "😴" },
  { id: "6", category: "motivation", title: "Celebra pequeños logros", description: "Cada comida registrada es un paso hacia tu meta. Reconoce tu esfuerzo, por pequeño que sea.", emoji: "🎉" },
  { id: "7", category: "nutrition", title: "Cuida las porciones", description: "Usa platos más pequeños. Es un truco simple pero efectivo para controlar las calorías.", emoji: "🍽️" },
  { id: "8", category: "motivation", title: "Racha = motivación", description: "Mantén tu racha de días consecutivos. La consistencia supera a la perfección.", emoji: "🔥" },
  { id: "9", category: "exercise", title: "Ejercicio breve funciona", description: "3 sesiones de 10 minutos son igual de efectivas que una de 30. Lo importante es moverse.", emoji: "⏱️" },
  { id: "10", category: "sleep", title: "Evita pantallas antes de dormir", description: "La luz azul suprime la melatonina. Apaga dispositivos 1 hora antes de acostarte.", emoji: "📵" },
];

const categoryConfig = {
  nutrition: {
    label: "Nutrición",
    gradient: "from-green-500/20 via-emerald-500/10 to-transparent",
    border: "border-green-500/30",
    icon: "🥗",
    glow: "rgba(34, 197, 94, 0.3)",
  },
  exercise: {
    label: "Ejercicio",
    gradient: "from-orange-500/20 via-red-500/10 to-transparent",
    border: "border-orange-500/30",
    icon: "🏃",
    glow: "rgba(249, 115, 22, 0.3)",
  },
  sleep: {
    label: "Sueño",
    gradient: "from-indigo-500/20 via-purple-500/10 to-transparent",
    border: "border-indigo-500/30",
    icon: "🌙",
    glow: "rgba(99, 102, 241, 0.3)",
  },
  motivation: {
    label: "Motivación",
    gradient: "from-yellow-500/20 via-amber-500/10 to-transparent",
    border: "border-yellow-500/30",
    icon: "⭐",
    glow: "rgba(234, 179, 8, 0.3)",
  },
};

interface DailyTipsProps {
  userId?: string;
}

export function DailyTips({ userId = "default" }: DailyTipsProps) {
  const [tipIndex, setTipIndex] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const today = new Date().getDate();
    const saved = localStorage.getItem(`tip-index-${userId}`);
    const savedDate = localStorage.getItem(`tip-date-${userId}`);
    
    if (savedDate !== today.toString()) {
      setTipIndex(today % TIPS.length);
      localStorage.setItem(`tip-date-${userId}`, today.toString());
    } else if (saved) {
      setTipIndex(parseInt(saved));
    }
  }, [userId]);

  const currentTip = TIPS[tipIndex];
  const config = categoryConfig[currentTip.category];

  function nextTip() {
    triggerHaptic("light");
    setDirection(1);
    setTipIndex((prev) => (prev + 1) % TIPS.length);
    localStorage.setItem(`tip-index-${userId}`, ((tipIndex + 1) % TIPS.length).toString());
  }

  function dismissTip() {
    triggerHaptic("medium");
    setDismissed([...dismissed, currentTip.id]);
  }

  if (dismissed.includes(currentTip.id)) return null;

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`}
        animate={{ opacity: isHovered ? 1 : 0.7 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/5" />
      
      {/* Border */}
      <div className={`absolute inset-0 rounded-3xl border ${config.border}`} />
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{ boxShadow: `inset 0 0 30px ${config.glow}` }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative p-5">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentTip.id}
            custom={direction}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Lightbulb size={18} className="text-yellow-400" />
                </motion.div>
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Consejo del día
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <motion.button
                  onClick={nextTip}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={18} className="text-zinc-400" />
                </motion.button>
                <motion.button
                  onClick={dismissTip}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} className="text-zinc-500" />
                </motion.button>
              </div>
            </div>

            {/* Tip content */}
            <div className="flex items-start gap-4">
              <motion.div
                className="text-4xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {currentTip.emoji}
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-zinc-300">
                    {config.icon} {config.label}
                  </span>
                </div>
                
                <h4 className="font-semibold text-lg mb-1">{currentTip.title}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{currentTip.description}</p>
              </div>
            </div>

            {/* Action button */}
            <motion.button
              className="mt-4 w-full py-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                triggerHaptic("light");
                // Mark as read or take action
              }}
            >
              <CheckCircle2 size={16} className="text-green-400" />
              Entendido, ¡gracias!
            </motion.button>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {TIPS.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === tipIndex ? "w-6 bg-white" : "w-1.5 bg-white/20"
              }`}
              animate={i === tipIndex ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
