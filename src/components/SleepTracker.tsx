"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Clock, TrendingUp, Zap } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface SleepData {
  date: string;
  hours: number;
  quality: 1 | 2 | 3 | 4 | 5;
  deepSleep: number;
  startTime: string;
  endTime: string;
}

interface SleepTrackerProps {
  userId: string;
}

export function SleepTracker({ userId }: SleepTrackerProps) {
  const [weeklySleep, setWeeklySleep] = useState<SleepData[]>([]);
  const [lastNight, setLastNight] = useState<SleepData | null>(null);
  const [showLog, setShowLog] = useState(false);
  const [logData, setLogData] = useState({ hours: 7.5, quality: 4 as 1|2|3|4|5, deepSleep: 2 });
  const { light, success } = useHaptic();

  useEffect(() => {
    const saved = localStorage.getItem(`sleep-${userId}`);
    if (saved) {
      const data = JSON.parse(saved);
      setWeeklySleep(data.weekly || []);
      setLastNight(data.lastNight || null);
    } else {
      // Sample data
      const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      const sample = days.map((day, i) => ({
        date: day,
        hours: 6 + Math.random() * 3,
        quality: (Math.floor(Math.random() * 5) + 1) as 1|2|3|4|5,
        deepSleep: 1 + Math.random() * 2,
        startTime: "23:00",
        endTime: "07:00",
      }));
      setWeeklySleep(sample);
      setLastNight(sample[sample.length - 1]);
    }
  }, [userId]);

  function saveLog() {
    light();
    const today = new Date();
    const newEntry: SleepData = {
      date: today.toLocaleDateString("es-ES", { weekday: "short" }),
      hours: logData.hours,
      quality: logData.quality,
      deepSleep: logData.deepSleep,
      startTime: "23:00",
      endTime: `${Math.floor(7 + logData.hours)}:${String(Math.round((logData.hours % 1) * 60)).padStart(2, "0")}`,
    };
    
    const updated = [...weeklySleep.slice(1), newEntry];
    setWeeklySleep(updated);
    setLastNight(newEntry);
    localStorage.setItem(`sleep-${userId}`, JSON.stringify({ weekly: updated, lastNight: newEntry }));
    setShowLog(false);
    success();
  }

  const avgSleep = weeklySleep.length > 0
    ? weeklySleep.reduce((sum, d) => sum + d.hours, 0) / weeklySleep.length
    : 0;
  
  const avgQuality = weeklySleep.length > 0
    ? weeklySleep.reduce((sum, d) => sum + d.quality, 0) / weeklySleep.length
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon size={18} className="text-indigo-400" />
          <h3 className="font-semibold">Sueño</h3>
        </div>
        <motion.button
          onClick={() => { light(); setShowLog(!showLog); }}
          className="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-400 text-sm font-medium"
          whileTap={{ scale: 0.95 }}
        >
          Registrar
        </motion.button>
      </div>

      {/* Last night summary */}
      {lastNight && (
        <motion.div
          className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-zinc-400 mb-2">Anoche dormiste</p>
          <div className="flex items-center gap-4">
            <span className="text-4xl">😴</span>
            <div>
              <p className="text-3xl font-bold">{lastNight.hours.toFixed(1)}<span className="text-lg text-zinc-400">h</span></p>
              <div className="flex gap-1 mt-1">
                {[1,2,3,4,5].map((star) => (
                  <span key={star} className={star <= lastNight.quality ? "text-yellow-400" : "text-zinc-600"}>★</span>
                ))}
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-zinc-400">Sueño profundo</p>
              <p className="font-bold text-indigo-400">{lastNight.deepSleep.toFixed(1)}h</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Log form */}
      {showLog && (
        <motion.div
          className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-zinc-400">¿Cuántas horas dormiste?</p>
          <input
            type="range"
            min="3"
            max="10"
            step="0.5"
            value={logData.hours}
            onChange={(e) => setLogData({ ...logData, hours: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="text-center text-2xl font-bold">{logData.hours}h</div>

          <p className="text-sm text-zinc-400">¿Cómo te sentiste al despertar?</p>
          <div className="flex gap-2">
            {([1,2,3,4,5] as const).map((q) => (
              <button
                key={q}
                onClick={() => { light(); setLogData({ ...logData, quality: q }); }}
                className={`flex-1 py-2 rounded-xl text-2xl ${
                  logData.quality === q ? "bg-indigo-500/30" : "bg-white/5"
                }`}
              >
                {q === 1 ? "😫" : q === 2 ? "😕" : q === 3 ? "😐" : q === 4 ? "😊" : "🤩"}
              </button>
            ))}
          </div>

          <motion.button
            onClick={saveLog}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold"
            whileTap={{ scale: 0.98 }}
          >
            Guardar
          </motion.button>
        </motion.div>
      )}

      {/* Weekly stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
          <Clock size={20} className="mx-auto mb-2 text-indigo-400" />
          <p className="text-xl font-bold">{avgSleep.toFixed(1)}h</p>
          <p className="text-xs text-zinc-500">Promedio semanal</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
          <TrendingUp size={20} className="mx-auto mb-2 text-green-400" />
          <p className="text-xl font-bold">{avgQuality.toFixed(1)} ★</p>
          <p className="text-xs text-zinc-500">Calidad promedio</p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-sm text-zinc-400 mb-3">Horas de sueño esta semana</p>
        <div className="flex items-end justify-between gap-1 h-16">
          {weeklySleep.map((day, i) => {
            const maxHours = 10;
            const height = (day.hours / maxHours) * 100;
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-indigo-500 to-purple-500"
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(10, height)}%` }}
                transition={{ delay: i * 0.1 }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          {weeklySleep.map((d, i) => (
            <span key={i}>{d.date}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
