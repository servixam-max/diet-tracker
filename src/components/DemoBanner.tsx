"use client";

import { motion } from "framer-motion";
import { X, Eye } from "lucide-react";

interface DemoBannerProps {
  onDismiss?: () => void;
}

export function DemoBanner({ onDismiss }: DemoBannerProps) {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
    >
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2 text-white text-sm">
          <Eye size={16} />
          <span className="font-medium">Modo Demo</span>
          <span>- Datos de ejemplo, no requiere login</span>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="p-1 rounded hover:bg-white/20">
            <X size={16} className="text-white" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
