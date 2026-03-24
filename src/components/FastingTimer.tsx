"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Coffee, Moon, Sun, Play, Pause, RotateCcw } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface FastingTimerProps {
  userId: string;
}

export function FastingTimer({ userId }: FastingTimerProps) {
  const [isFasting, setIsFasting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [targetHours, setTargetHours] = useState(16);
  const { light, success } = useHaptic();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isFasting && startTime) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isFasting, startTime]);

  function startFasting() {
    light();
    setStartTime(new Date());
    setIsFasting(true);
    setElapsedSeconds(0);
    success();
  }

  function stopFasting() {
    light();
    setIsFasting(false);
  }

  function resetFasting() {
    light();
    setIsFasting(false);
    setStartTime(null);
    setElapsedSeconds(0);
  }

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  const progress = Math.min((elapsedSeconds / (targetHours * 3600)) * 100, 100);
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const fastingType = targetHours === 16 ? "16:8" : targetHours === 18 ? "18:6" : targetHours === 20 ? "20:4" : "Custom";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer size={18} className="text-amber-400" />
          <h3 className="font-semibold">Ayuno intermitente</h3>
        </div>
        <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
          {fastingType}
        </span>
      </div>

      <motion.div
        className="relative flex flex-col items-center justify-center p-8 rounded-3xl"
        style={{
          background: isFasting 
            ? "linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)"
            : "rgba(255,255,255,0.02)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Progress ring */}
        <svg className="absolute w-52 h-52 -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          {isFasting && (
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#fastingGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />
          )}
          <defs>
            <linearGradient id="fastingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10 text-center">
          <motion.div
            className="text-5xl font-bold tabular-nums"
            animate={isFasting ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
            <span className="text-2xl text-zinc-500">:{String(seconds).padStart(2, "0")}</span>
          </motion.div>
          
          {!isFasting && (
            <p className="text-sm text-zinc-500 mt-2">Pulsa iniciar para comenzar</p>
          )}
          
          {isFasting && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-green-400">En progreso</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Target selector */}
      {!isFasting && (
        <div className="grid grid-cols-3 gap-2">
          {[16, 18, 20].map((h) => (
            <button
              key={h}
              onClick={() => { light(); setTargetHours(h); }}
              className={`py-3 rounded-xl text-center transition-all ${
                targetHours === h
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                  : "bg-white/5 border border-white/5 text-zinc-400 hover:bg-white/10"
              }`}
            >
              <span className="text-lg font-bold">{h}h</span>
              <p className="text-xs">{h === 16 ? "16:8" : h === 18 ? "18:6" : "20:4"}</p>
            </button>
          ))}
        </div>
      )}

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Moon size={14} className="text-indigo-400" />
            <span className="text-xs text-zinc-500">Inicio</span>
          </div>
          <p className="font-medium">
            {isFasting ? startTime?.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Sun size={14} className="text-yellow-400" />
            <span className="text-xs text-zinc-500">Fin estimado</span>
          </div>
          <p className="font-medium">
            {isFasting && startTime
              ? new Date(startTime.getTime() + targetHours * 3600000).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
              : "--:--"}
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
        <p className="text-xs text-zinc-500 mb-2">Beneficios del ayuno:</p>
        <div className="flex flex-wrap gap-2">
          {["Pérdida de peso", "Autofagia", "Insulina ↓", "Energía ↑"].map((benefit, i) => (
            <span key={i} className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs">
              {benefit}
            </span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isFasting ? (
          <motion.button
            onClick={startFasting}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Play size={18} />
            Iniciar ayuno
          </motion.button>
        ) : (
          <>
            <motion.button
              onClick={stopFasting}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              <Coffee size={18} />
              Terminar
            </motion.button>
            <motion.button
              onClick={resetFasting}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400"
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw size={18} />
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
