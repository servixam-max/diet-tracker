"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface WeightEntry {
  date: string;
  weight: number;
}

interface WeightTrackerProps {
  userId: string;
  targetWeight?: number;
}

export function WeightTracker({ userId, targetWeight = 75 }: WeightTrackerProps) {
  const [entries, setEntries] = useState<WeightEntry[]>(() => [
    { date: "2024-03-01", weight: 82.5 },
    { date: "2024-03-05", weight: 81.8 },
    { date: "2024-03-10", weight: 81.2 },
    { date: "2024-03-15", weight: 80.5 },
    { date: "2024-03-20", weight: 80.1 },
    { date: "2024-03-23", weight: 79.8 },
  ]);
  const [currentWeight, setCurrentWeight] = useState<number | null>(79.8);
  const [showAdd, setShowAdd] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const { light, success } = useHaptic();

  const startWeight = entries[0]?.weight || 0;
  const weightLost = startWeight - (currentWeight || 0);
  const weightToGo = (currentWeight || 0) - targetWeight;
  const progressPct = startWeight > 0 ? ((startWeight - (currentWeight || 0)) / (startWeight - targetWeight)) * 100 : 0;

  const last3Days = entries.slice(-3);
  const avgLoss = last3Days.length >= 2 
    ? (last3Days[last3Days.length-1].weight - last3Days[0].weight) / (last3Days.length - 1) 
    : 0;

  function addEntry() {
    if (!newWeight) return;
    light();
    const entry = { date: new Date().toISOString().split("T")[0], weight: parseFloat(newWeight) };
    const updated = [...entries, entry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setEntries(updated);
    setCurrentWeight(entry.weight);
    setNewWeight("");
    setShowAdd(false);
    success();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale size={18} className="text-blue-400" />
          <h3 className="font-semibold">Peso</h3>
        </div>
        <motion.button
          onClick={() => { light(); setShowAdd(!showAdd); }}
          className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium"
          whileTap={{ scale: 0.95 }}
        >
          + Añadir
        </motion.button>
      </div>

      {/* Current weight display */}
      <motion.div
        className="relative p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 overflow-hidden"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400 mb-1">Peso actual</p>
            <p className="text-4xl font-bold">
              {currentWeight?.toFixed(1) || "--"}
              <span className="text-lg text-zinc-400 ml-1">kg</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400">Objetivo</p>
            <p className="text-xl font-bold text-green-400">{targetWeight} kg</p>
          </div>
        </div>

        {/* Progress to goal */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>{startWeight.toFixed(1)} kg (inicio)</span>
            <span>{targetWeight} kg (meta)</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Add weight form */}
      {showAdd && (
        <motion.div
          className="p-4 rounded-2xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              placeholder="Nuevo peso (kg)"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none"
              onKeyDown={(e) => e.key === "Enter" && addEntry()}
            />
            <motion.button
              onClick={addEntry}
              className="px-6 py-3 rounded-xl bg-blue-500 text-white font-medium"
              whileTap={{ scale: 0.95 }}
            >
              Guardar
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            {weightLost > 0 ? (
              <TrendingDown size={16} className="text-green-400" />
            ) : weightLost < 0 ? (
              <TrendingUp size={16} className="text-red-400" />
            ) : (
              <Minus size={16} className="text-zinc-400" />
            )}
          </div>
          <p className={`text-xl font-bold ${weightLost > 0 ? "text-green-400" : "text-red-400"}`}>
            {weightLost > 0 ? "-" : "+"}{Math.abs(weightLost).toFixed(1)} kg
          </p>
          <p className="text-xs text-zinc-500">perdidos en total</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target size={16} className="text-blue-400" />
          </div>
          <p className={`text-xl font-bold ${weightToGo > 0 ? "text-orange-400" : "text-green-400"}`}>
            {weightToGo > 0 ? Math.abs(weightToGo).toFixed(1) : "🎉"} {weightToGo > 0 && "kg"}
          </p>
          <p className="text-xs text-zinc-500">{weightToGo > 0 ? "para el objetivo" : "objetivo alcanzado"}</p>
        </div>
      </div>

      {/* Mini chart */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-sm text-zinc-400 mb-3">Últimas entradas</p>
        <div className="flex items-end justify-between gap-2 h-16">
          {entries.slice(-7).map((entry, i) => {
            const minW = Math.min(...entries.map((e) => e.weight));
            const maxW = Math.max(...entries.map((e) => e.weight));
            const range = maxW - minW || 1;
            const height = ((maxW - entry.weight) / range) * 100;
            return (
              <motion.div
                key={entry.date}
                className="flex-1 rounded-t bg-gradient-to-t from-blue-500 to-indigo-500"
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(20, height)}%` }}
                transition={{ delay: i * 0.1 }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          <span>{entries[entries.length - 7]?.date.slice(5) || ""}</span>
          <span>{entries[entries.length - 1]?.date.slice(5) || ""}</span>
        </div>
      </div>
    </div>
  );
}
