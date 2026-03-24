"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AIChatCoach } from "@/components/AIChatCoach";
import { Bot, Sparkles } from "lucide-react";

export default function CoachPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f18] to-[#0a0a0f]">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          className="p-6 pb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-4">
            <Sparkles size={14} />
            Nuevo: AI Coach
          </div>
          <h1 className="text-2xl font-bold mb-2">Tu Coach Nutricional con IA</h1>
          <p className="text-zinc-400 text-sm">
            Chatea con IA para analizar tu ingesta, obtener recetas y consejos personalizados
          </p>
        </motion.div>

        {/* Chat interface */}
        <motion.div
          className="mx-4 mb-4 rounded-3xl bg-[#12121a] border border-white/10 overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ height: "calc(100vh - 200px)" }}
        >
          <AIChatCoach />
        </motion.div>
      </div>
    </div>
  );
}
