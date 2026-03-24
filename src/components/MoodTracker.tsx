"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SmilePlus, Frown, Meh, Smile, Heart, Brain } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface MoodEntry {
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

interface MoodTrackerProps {
  userId: string;
}

const MOODS = [
  { value: 1, icon: Frown, label: "Fatal", emoji: "😢", color: "text-red-400", bg: "bg-red-500/20" },
  { value: 2, icon: Meh, label: "Regular", emoji: "😐", color: "text-orange-400", bg: "bg-orange-500/20" },
  { value: 3, icon: Smile, label: "Bien", emoji: "🙂", color: "text-yellow-400", bg: "bg-yellow-500/20" },
  { value: 4, icon: Smile, label: "Muy bien", emoji: "😊", color: "text-lime-400", bg: "bg-lime-500/20" },
  { value: 5, icon: Heart, label: "Excelente", emoji: "😍", color: "text-green-400", bg: "bg-green-500/20" },
];

export function MoodTracker({ userId }: MoodTrackerProps) {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [todayMood, setTodayMood] = useState<1 | 2 | 3 | 4 | 5>(3);
  const { light, success } = useHaptic();

  useEffect(() => {
    const saved = localStorage.getItem(`mood-${userId}`);
    if (saved) {
      setEntries(JSON.parse(saved));
    } else {
      // Sample data
      const sample: MoodEntry[] = [];
      for (let i = 6; i >= 1; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        sample.push({
          date: date.toISOString().split("T")[0],
          mood: Math.ceil(Math.random() * 5) as 1 | 2 | 3 | 4 | 5,
        });
      }
      setEntries(sample);
    }
  }, [userId]);

  function saveMood() {
    light();
    const newEntry: MoodEntry = {
      date: new Date().toISOString().split("T")[0],
      mood: todayMood,
    };
    
    const updated = entries.filter((e) => e.date !== newEntry.date);
    updated.push(newEntry);
    updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setEntries(updated);
    localStorage.setItem(`mood-${userId}`, JSON.stringify(updated));
    success();
  }

  const avgMood = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1)
    : "3.0";

  const currentMood = MOODS.find((m) => m.value === todayMood)!;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-pink-400" />
          <h3 className="font-semibold">Estado de ánimo</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span>Media: </span>
          <span className={MOODS[Math.round(Number(avgMood)) - 1].color}>
            {MOODS[Math.round(Number(avgMood)) - 1].emoji} {avgMood}
          </span>
        </div>
      </div>

      {/* Mood selector */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20">
        <p className="text-sm text-zinc-400 mb-3">¿Cómo te sientes hoy?</p>
        
        <div className="grid grid-cols-5 gap-2 mb-4">
          {MOODS.map((mood) => {
            const Icon = mood.icon;
            const isSelected = todayMood === mood.value;
            return (
              <motion.button
                key={mood.value}
                onClick={() => { light(); setTodayMood(mood.value as 1|2|3|4|5); }}
                className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                  isSelected
                    ? `${mood.bg} border-2 border-current ${mood.color}`
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs">{mood.label}</span>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          onClick={saveMood}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium flex items-center justify-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          <SmilePlus size={18} />
          Guardar estado
        </motion.button>
      </div>

      {/* Recent moods */}
      <div className="space-y-2">
        <p className="text-sm text-zinc-400">Esta semana</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {entries.slice(0, 7).map((entry) => {
            const mood = MOODS.find((m) => m.value === entry.mood)!;
            return (
              <div
                key={entry.date}
                className={`flex-shrink-0 p-3 rounded-xl ${mood.bg} text-center min-w-[60px]`}
              >
                <p className="text-lg">{mood.emoji}</p>
                <p className="text-xs text-zinc-400">
                  {new Date(entry.date).toLocaleDateString("es-ES", { weekday: "short" })}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Correlation tip */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-sm text-zinc-400">
          📊 ¿Sabías que dormir bien y comer平衡 puede mejorar tu estado de ánimo? 
          Mantén un registro para ver patrones.
        </p>
      </div>
    </div>
  );
}
