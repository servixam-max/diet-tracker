"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Camera, Barcode, Clock, ChefHat, Droplets, Dumbbell, Moon, Apple, Utensils } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface QuickAction {
  id: string;
  name: string;
  icon: string;
  color: string;
  action: () => void;
}

interface QuickActionsProps {
  onAddFood?: () => void;
  onScanBarcode?: () => void;
  onTakePhoto?: () => void;
  onLogWater?: () => void;
  onLogExercise?: () => void;
}

export function QuickActions({ onAddFood, onScanBarcode, onTakePhoto, onLogWater, onLogExercise }: QuickActionsProps) {
  const { light } = useHaptic();
  const [showAll, setShowAll] = useState(false);

  const primaryActions: QuickAction[] = [
    { id: "food", name: "Comida", icon: "🍽️", color: "from-green-500 to-emerald-600", action: () => { light(); onAddFood?.(); } },
    { id: "barcode", name: "Código", icon: "📱", color: "from-blue-500 to-cyan-600", action: () => { light(); onScanBarcode?.(); } },
    { id: "photo", name: "Foto", icon: "📸", color: "from-purple-500 to-violet-600", action: () => { light(); onTakePhoto?.(); } },
  ];

  const secondaryActions: QuickAction[] = [
    { id: "water", name: "Agua", icon: "💧", color: "from-cyan-500 to-blue-600", action: () => { light(); onLogWater?.(); } },
    { id: "exercise", name: "Ejercicio", icon: "🏋️", color: "from-orange-500 to-red-600", action: () => { light(); onLogExercise?.(); } },
    { id: "recipe", name: "Receta", icon: "👨‍🍳", color: "from-amber-500 to-orange-600", action: () => { light(); } },
    { id: "fast", name: "Ayuno", icon: "⏰", color: "from-indigo-500 to-purple-600", action: () => { light(); } },
    { id: "snack", name: "Snack", icon: "🍎", color: "from-red-500 to-pink-600", action: () => { light(); } },
    { id: "meal", name: "Comida", icon: "🥗", color: "from-lime-500 to-green-600", action: () => { light(); } },
  ];

  const allActions = [...primaryActions, ...secondaryActions];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Acciones rápidas</h3>
        <button
          onClick={() => { light(); setShowAll(!showAll); }}
          className="text-sm text-green-400 hover:text-green-300 transition-colors"
        >
          {showAll ? "Ver menos" : "Ver más"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(showAll ? allActions : primaryActions).map((action, index) => (
          <motion.button
            key={action.id}
            onClick={action.action}
            className={`p-4 rounded-2xl bg-gradient-to-br ${action.color} text-white font-medium flex flex-col items-center justify-center gap-2 shadow-lg`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-sm">{action.name}</span>
          </motion.button>
        ))}
      </div>

      {!showAll && (
        <motion.div
          className="p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-center text-zinc-400">
            💡 Toca "Ver más" para acceder a todas las acciones
          </p>
        </motion.div>
      )}
    </div>
  );
}
