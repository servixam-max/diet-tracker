"use client";

import { motion } from "framer-motion";
import { Utensils, Plus, Search, Camera, Sparkles } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface EmptyStateProps {
  type: "meals" | "search" | "recipes" | "progress" | "history";
  onAction?: () => void;
}

const EMPTY_STATES = {
  meals: {
    icon: Utensils,
    title: "No hay comidas registradas",
    description: "Comienza añadiendo tu primera comida del día",
    actionLabel: "Añadir comida",
    color: "from-green-500 to-emerald-500",
  },
  search: {
    icon: Search,
    title: "Búsqueda sin resultados",
    description: "Prueba con otros términos o añade el alimento manualmente",
    actionLabel: "Añadir manualmente",
    color: "from-blue-500 to-cyan-500",
  },
  recipes: {
    icon: Sparkles,
    title: "No hay recetas guardadas",
    description: "Explora recetas o crea las tuyas propias",
    actionLabel: "Ver recetas populares",
    color: "from-orange-500 to-red-500",
  },
  progress: {
    icon: Sparkles,
    title: "Sin progreso todavía",
    description: "Registra tus comidas para ver tu evolución",
    actionLabel: "Empezar",
    color: "from-purple-500 to-indigo-500",
  },
  history: {
    icon: Utensils,
    title: "Historial vacío",
    description: "Tu historial de comidas aparecerá aquí",
    actionLabel: "Registrar comida",
    color: "from-yellow-500 to-orange-500",
  },
};

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const config = EMPTY_STATES[type];
  const Icon = config.icon;
  const { light } = useHaptic();

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${config.color} flex items-center justify-center mb-6 shadow-lg`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Icon size={40} className="text-white" />
      </motion.div>

      <h3 className="text-xl font-bold mb-2">{config.title}</h3>
      <p className="text-zinc-400 mb-6 max-w-xs">{config.description}</p>

      {onAction && (
        <motion.button
          onClick={() => {
            light();
            onAction();
          }}
          className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${config.color} text-white font-bold flex items-center gap-2 shadow-lg`}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          {config.actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
