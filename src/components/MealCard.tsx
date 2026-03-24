"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Flame, ChevronDown, Camera, Barcode, Plus, Sparkles, Clock, TrendingUp, Trash2, Pencil } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface MealCardProps {
  type: "Desayuno" | "Almuerzo" | "Merienda" | "Cena";
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  time?: string;
  imageUrl?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const mealIcons = {
  Desayuno: "🌅",
  Almuerzo: "☀️",
  Merienda: "🍪",
  Cena: "🌙",
};

const mealGradients = {
  Desayuno: "from-orange-400/30 via-orange-500/20 to-amber-600/10",
  Almuerzo: "from-yellow-400/30 via-yellow-500/20 to-orange-600/10",
  Merienda: "from-pink-400/30 via-pink-500/20 to-rose-600/10",
  Cena: "from-indigo-400/30 via-indigo-500/20 to-purple-600/10",
};

const mealGlowColors = {
  Desayuno: "rgba(251, 146, 60, 0.3)",
  Almuerzo: "rgba(250, 204, 21, 0.3)",
  Merienda: "rgba(244, 114, 182, 0.3)",
  Cena: "rgba(129, 140, 248, 0.3)",
};

export function MealCard({ type, name, calories, protein = 0, carbs = 0, fat = 0, time, isLoading, isEmpty, onAdd, onEdit, onDelete }: MealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { light, medium, warning } = useHaptic();

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-3xl p-5 bg-white/5 border border-white/10">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-24 bg-white/10 rounded" />
              <div className="h-5 w-40 bg-white/10 rounded" />
            </div>
          </div>
          <div className="h-8 w-28 bg-white/10 rounded-full" />
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <motion.div 
        className="relative overflow-hidden rounded-3xl p-6 bg-white/5 border border-white/10 border-dashed cursor-pointer group"
        whileHover={{ scale: 1.02, borderColor: "rgba(34, 197, 94, 0.3)" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => { light(); onAdd?.(); }}
      >
        <div className="flex flex-col items-center justify-center py-6 text-zinc-400 group-hover:text-green-400 transition-colors">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-3 group-hover:bg-green-500/20 transition-colors"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <Plus className="w-6 h-6" />
          </motion.div>
          <span className="text-sm font-medium">Añadir {type.toLowerCase()}</span>
          <span className="text-xs text-zinc-500 mt-1">Toca para registrar</span>
        </div>
      </motion.div>
    );
  }

  const macros = [
    { label: "Proteína", value: protein, color: "bg-blue-400", icon: "💪" },
    { label: "Carbs", value: carbs, color: "bg-yellow-400", icon: "🌾" },
    { label: "Grasas", value: fat, color: "bg-red-400", icon: "🥑" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Swipe actions background */}
      <div className="absolute inset-0 flex">
        {/* Edit action (right swipe - blue) */}
        <motion.div 
          className="flex-1 bg-blue-500/20 flex items-center justify-start pl-6"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="flex items-center gap-2 text-blue-400 font-medium"
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); medium(); onEdit?.(); }}
          >
            <Pencil size={20} />
            Editar
          </motion.button>
        </motion.div>
        
        {/* Delete action (left swipe - red) */}
        <motion.div 
          className="flex-1 bg-red-500/20 flex items-center justify-end pr-6"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="flex items-center gap-2 text-red-400 font-medium"
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); warning(); onDelete?.(); }}
          >
            Eliminar
            <Trash2 size={20} />
          </motion.button>
        </motion.div>
      </div>

      {/* Main card content */}
      <motion.div
        layout
        className="relative overflow-hidden rounded-3xl cursor-pointer bg-gradient-to-br"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => { light(); setExpanded(!expanded); }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        whileDrag={{ scale: 1.02 }}
        onDragEnd={(e, info) => {
          if (info.offset.x > 100) {
            medium();
            onEdit?.();
          } else if (info.offset.x < -100) {
            warning();
            onDelete?.();
          }
        }}
      >
        {/* Animated gradient background */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${mealGradients[type]}`}
          animate={{ opacity: isHovered ? 0.8 : 0.5 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Glass overlay */}
        <div className="absolute inset-0 backdrop-blur-xl bg-white/5" />
        
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{ boxShadow: `inset 0 0 30px ${mealGlowColors[type]}` }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Border with gradient */}
        <div className="absolute inset-0 rounded-3xl border border-white/10" />
        <motion.div
          className="absolute inset-0 rounded-3xl border"
          style={{ borderImage: `linear-gradient(135deg, ${mealGlowColors[type]}, transparent) 1` }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
        
        {/* Content */}
        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-3xl shadow-lg"
                animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? [0, -5, 5, 0] : 0 }}
                transition={{ duration: 0.3 }}
              >
                {mealIcons[type]}
              </motion.div>
              <div>
                <motion.p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1" layoutId={`meal-type-${type}`}>
                  {type}
                </motion.p>
                <motion.p className="font-semibold text-white text-lg leading-tight" layoutId={`meal-name-${type}`}>
                  {name}
                </motion.p>
                {time && (
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                    <Clock size={12} />
                    <span>{time}</span>
                  </div>
                )}
              </div>
            </div>
            
            <motion.button
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={20} className="text-zinc-400" />
            </motion.button>
          </div>
          
          {/* Calories badge */}
          <div className="flex items-center gap-3">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <Flame size={16} className="text-orange-400" />
              <span className="font-bold text-white">{calories}</span>
              <span className="text-xs text-zinc-400">kcal</span>
            </motion.div>
            
            {protein > 30 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs text-blue-400 flex items-center gap-1"
              >
                <Sparkles size={12} />
                Alto en proteína
              </motion.div>
            )}
          </div>
          
          {/* Expanded content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <p className="text-sm text-zinc-400 mb-3 flex items-center gap-2">
                  <TrendingUp size={14} />
                  Macronutrientes
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {macros.map((macro, index) => (
                    <motion.div
                      key={macro.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{macro.icon}</span>
                        <span className="text-xs text-zinc-400">{macro.label}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-white">{macro.value}g</span>
                      </div>
                      <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${macro.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((macro.value / 100) * 100, 100)}%` }}
                          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Meal card grid with stagger animation
export function MealCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      className="grid gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
