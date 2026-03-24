"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, MessageCircle, Copy, Check } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface SocialShareProps {
  userId: string;
  stats: {
    calories: number;
    protein: number;
    streak: number;
    water: number;
  };
}

export function SocialShare({ userId, stats }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { light, success } = useHaptic();

  const shareText = `🔥 Hoy llevé ${stats.calories} kcal y ${stats.protein}g de proteína!\n💧 ${stats.water} vasos de agua\n🎯 ${stats.streak} días de racha\n\n#DietTracker #FitnessGoals`;

  async function copyToClipboard() {
    light();
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    success();
    setTimeout(() => setCopied(false), 2000);
  }

  function shareToTwitter() {
    light();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  }

  function shareToWhatsApp() {
    light();
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 size={18} className="text-cyan-400" />
          <h3 className="font-semibold">Compartir progreso</h3>
        </div>
      </div>

      <motion.div
        className="relative p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative space-y-3">
          <p className="text-lg font-bold">Mi resumen de hoy 📊</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-orange-400">{stats.calories}</p>
              <p className="text-xs text-zinc-500">Calorías</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-blue-400">{stats.protein}g</p>
              <p className="text-xs text-zinc-500">Proteína</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-cyan-400">{stats.water}</p>
              <p className="text-xs text-zinc-500">Vasos de agua</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-green-400">{stats.streak}🔥</p>
              <p className="text-xs text-zinc-500">Racha</p>
            </div>
          </div>

          <p className="text-xs text-zinc-500 mt-2">Diet Tracker App</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-2">
        <motion.button
          onClick={copyToClipboard}
          className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-1"
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <>
              <Check size={20} className="text-green-400" />
              <span className="text-xs text-green-400">Copiado</span>
            </>
          ) : (
            <>
              <Copy size={20} className="text-zinc-400" />
              <span className="text-xs text-zinc-400">Copiar</span>
            </>
          )}
        </motion.button>

        <motion.button
          onClick={shareToTwitter}
          className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-1"
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
          </svg>
          <span className="text-xs text-zinc-400">Twitter</span>
        </motion.button>

        <motion.button
          onClick={shareToWhatsApp}
          className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-1"
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={20} className="text-green-400" />
          <span className="text-xs text-zinc-400">WhatsApp</span>
        </motion.button>
      </div>
    </div>
  );
}
