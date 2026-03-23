"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Flame, ChevronDown, Camera, Barcode, Plus } from "lucide-react";

interface MealCardProps {
  type: "Desayuno" | "Almuerzo" | "Merienda" | "Cena";
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  imageUrl?: string;
}

const mealIcons = {
  Desayuno: "🌅",
  Almuerzo: "☀️",
  Merienda: "🍪",
  Cena: "🌙",
};

const mealColors = {
  Desayuno: "from-orange-500/20 to-orange-600/10",
  Almuerzo: "from-yellow-500/20 to-yellow-600/10",
  Merienda: "from-pink-500/20 to-pink-600/10",
  Cena: "from-indigo-500/20 to-indigo-600/10",
};

export function MealCard({ type, name, calories, protein, carbs, fat }: MealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${mealColors[type]} opacity-50`} />
      <div className="absolute inset-0 backdrop-blur-xl" />
      
      {/* Border glow */}
      <div className="absolute inset-0 border border-white/10 rounded-2xl" />
      
      {/* Content */}
      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.span 
              className="text-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {mealIcons[type]}
            </motion.span>
            <div>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">{type}</p>
              <p className="font-semibold text-white">{name}</p>
            </div>
          </div>
          
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Flame size={18} className="text-orange-400" />
            </motion.div>
          </motion.button>
        </div>

        {/* Calories badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30">
            <span className="text-sm font-bold text-green-400">{calories} kcal</span>
          </div>
          {protein && carbs && fat && (
            <div className="flex gap-2 text-xs text-zinc-400">
              <span className="text-blue-400">P: {protein}g</span>
              <span className="text-yellow-400">C: {carbs}g</span>
              <span className="text-red-400">G: {fat}g</span>
            </div>
          )}
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* Macro mini bars */}
              {protein && carbs && fat && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="space-y-1">
                    <div className="h-1 bg-blue-500/30 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((protein / 50) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-blue-400">{protein}g P</p>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 bg-yellow-500/30 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-yellow-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((carbs / 80) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-yellow-400">{carbs}g C</p>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 bg-red-500/30 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-red-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((fat / 30) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-red-400">{fat}g G</p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-4 gap-2">
                <ActionButton icon={<Camera size={16} />} label="Foto IA" color="text-purple-400" />
                <ActionButton icon={<Barcode size={16} />} label="Escanear" color="text-cyan-400" />
                <ActionButton icon={<Plus size={16} />} label="Manual" color="text-orange-400" />
                <ActionButton icon={<ChevronDown size={16} />} label="Cambiar" color="text-zinc-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ActionButton({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <motion.button
      className={`flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors ${color}`}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </motion.button>
  );
}
