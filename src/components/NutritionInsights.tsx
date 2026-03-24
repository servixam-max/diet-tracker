"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Insight {
  id: string;
  type: "success" | "warning" | "info" | "suggestion";
  title: string;
  description: string;
  icon: string;
}

interface NutritionInsightsProps {
  userId: string;
}

export function NutritionInsights({ userId }: NutritionInsightsProps) {
  const [insights] = useState<Insight[]>([
    {
      id: "1",
      type: "success",
      title: "Proteína en objetivo",
      description: "Has alcanzado el 85% de tu objetivo de proteína esta semana. ¡Excelente!",
      icon: "💪",
    },
    {
      id: "2",
      type: "warning",
      title: "Bajo en fibra",
      description: "Tu consumo de fibra está bajo. Considera añadir más vegetales y granos integrales.",
      icon: "🥦",
    },
    {
      id: "3",
      type: "info",
      title: "Hidratación óptima",
      description: "Has mejorado tu consumo de agua un 20% respecto a la semana pasada.",
      icon: "💧",
    },
    {
      id: "4",
      type: "suggestion",
      title: "Sugerencia IA",
      description: "Basado en tu historial, podrías beneficiarte de añadir frutos secos como snack.",
      icon: "🥜",
    },
  ]);
  const { light } = useHaptic();

  function getTypeStyles(type: Insight["type"]) {
    switch (type) {
      case "success":
        return { bg: "bg-green-500/10", border: "border-green-500/20", icon: <CheckCircle size={16} className="text-green-400" /> };
      case "warning":
        return { bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: <AlertTriangle size={16} className="text-yellow-400" /> };
      case "info":
        return { bg: "bg-blue-500/10", border: "border-blue-500/20", icon: <TrendingUp size={16} className="text-blue-400" /> };
      case "suggestion":
        return { bg: "bg-purple-500/10", border: "border-purple-500/20", icon: <Sparkles size={16} className="text-purple-400" /> };
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-purple-400" />
          <h3 className="font-semibold">Insights nutricionales</h3>
        </div>
        <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium">
          IA
        </span>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const styles = getTypeStyles(insight.type);
          
          return (
            <motion.div
              key={insight.id}
              className={`p-4 rounded-2xl ${styles.bg} border ${styles.border}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{insight.title}</p>
                    {styles.icon}
                  </div>
                  <p className="text-sm text-zinc-400">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-medium flex items-center justify-center gap-2"
        whileTap={{ scale: 0.98 }}
        onClick={() => light()}
      >
        <Brain size={16} />
        Ver análisis completo
      </motion.button>
    </div>
  );
}
