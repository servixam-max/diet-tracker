"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Clock, Star, BedDouble } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface SleepData {
  hours: number;
  quality: number;
  bedTime: string;
  wakeTime: string;
  deepSleep: number;
  remSleep: number;
}

interface SleepQualityCardProps {
  userId: string;
}

export function SleepQualityCard({ userId }: SleepQualityCardProps) {
  const [sleepData] = useState<SleepData>({
    hours: 7.5,
    quality: 85,
    bedTime: "23:30",
    wakeTime: "07:00",
    deepSleep: 1.8,
    remSleep: 1.5,
  });
  const { light } = useHaptic();

  function getQualityColor(quality: number) {
    if (quality >= 80) return "text-green-400";
    if (quality >= 60) return "text-yellow-400";
    return "text-red-400";
  }

  function getQualityLabel(quality: number) {
    if (quality >= 80) return "Excelente";
    if (quality >= 60) return "Buena";
    return "Mejorable";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon size={18} className="text-indigo-400" />
          <h3 className="font-semibold">Calidad del sueño</h3>
        </div>
        <span className={`text-sm font-medium ${getQualityColor(sleepData.quality)}`}>
          {getQualityLabel(sleepData.quality)}
        </span>
      </div>

      {/* Main quality card */}
      <motion.div
        className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-4xl font-bold">{sleepData.hours}h</p>
            <p className="text-sm text-zinc-400">de sueño</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="text-2xl font-bold">{sleepData.quality}%</span>
            </div>
            <p className="text-sm text-zinc-400">calidad</p>
          </div>
        </div>

        {/* Sleep timeline */}
        <div className="relative h-8 rounded-lg bg-white/5 overflow-hidden mb-4">
          <div className="absolute inset-y-0 left-0 right-1/4 bg-indigo-500/30" /> {/* Deep sleep */}
          <div className="absolute inset-y-0 left-1/4 right-1/2 bg-purple-500/30" /> {/* REM */}
          <div className="absolute inset-y-0 left-1/2 right-0 bg-blue-500/20" /> {/* Light */}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <BedDouble size={16} className="text-white/60" />
          </div>
        </div>

        {/* Time info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/5 flex items-center gap-2">
            <Moon size={16} className="text-indigo-400" />
            <div>
              <p className="text-xs text-zinc-500">Dormir</p>
              <p className="font-medium">{sleepData.bedTime}</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 flex items-center gap-2">
            <Sun size={16} className="text-yellow-400" />
            <div>
              <p className="text-xs text-zinc-500">Despertar</p>
              <p className="font-medium">{sleepData.wakeTime}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sleep stages */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-xs text-zinc-500 mb-1">Sueño profundo</p>
          <p className="text-lg font-bold text-indigo-400">{sleepData.deepSleep}h</p>
          <p className="text-xs text-zinc-500">24% del total</p>
        </div>
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-xs text-zinc-500 mb-1">Sueño REM</p>
          <p className="text-lg font-bold text-purple-400">{sleepData.remSleep}h</p>
          <p className="text-xs text-zinc-500">20% del total</p>
        </div>
      </div>

      {/* Tip */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
        <p className="text-xs text-zinc-400">
          💡 Tip: Intenta mantener horarios consistentes para mejorar tu calidad de sueño.
        </p>
      </div>
    </div>
  );
}
