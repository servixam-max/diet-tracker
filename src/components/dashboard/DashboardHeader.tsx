"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";
import { variants } from "@/lib/animations";

interface DashboardHeaderProps {
  name: string | undefined;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const DashboardHeader = memo(function DashboardHeader({ name, isRefreshing, onRefresh }: DashboardHeaderProps) {
  const { light } = useHaptic();

  return (
    <motion.div 
      variants={variants.fadeIn}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-between mb-6"
    >
      <div>
        <motion.h1 
          className="text-2xl font-bold gradient-text"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          ¡Hola, {name || 'Usuario'}! 👋
        </motion.h1>
        <p className="text-zinc-400 text-sm">
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      <motion.button
        onClick={onRefresh}
        className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05, rotate: 180 }}
        whileTap={{ scale: 0.95 }}
        animate={isRefreshing ? { rotate: 360 } : {}}
        transition={{ duration: 0.5 }}
      >
        <RefreshCw size={20} className="text-zinc-400" />
      </motion.button>
    </motion.div>
  );
});
