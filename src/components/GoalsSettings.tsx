"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Save, RotateCcw } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface GoalsSettingsProps {
  userId: string;
  initialGoals?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
  onSave?: (goals: any) => void;
}

export function GoalsSettings({ userId, initialGoals, onSave }: GoalsSettingsProps) {
  const [goals, setGoals] = useState(initialGoals || {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
    water: 8,
  });
  const [saved, setSaved] = useState(false);
  const { light, success } = useHaptic();

  function handleSave() {
    light();
    localStorage.setItem(`goals-${userId}`, JSON.stringify(goals));
    onSave?.(goals);
    success();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    light();
    setGoals({
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 65,
      water: 8,
    });
  }

  function updateGoal(key: string, value: number) {
    setGoals((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <Target size={16} className="text-white" />
        </div>
        <h3 className="font-semibold">Objetivos diarios</h3>
      </div>

      {/* Calorias */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm text-zinc-400">Calorías</label>
          <span className="text-sm font-medium">{goals.calories} kcal</span>
        </div>
        <input
          type="range"
          min={1200}
          max={4000}
          step={50}
          value={goals.calories}
          onChange={(e) => updateGoal("calories", Number(e.target.value))}
          className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer accent-green-500"
        />
        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>1200</span>
          <span>4000</span>
        </div>
      </div>

      {/* Proteína */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm text-zinc-400">Proteína</label>
          <span className="text-sm font-medium text-blue-400">{goals.protein}g</span>
        </div>
        <input
          type="range"
          min={50}
          max={300}
          step={10}
          value={goals.protein}
          onChange={(e) => updateGoal("protein", Number(e.target.value))}
          className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Carbohidratos */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm text-zinc-400">Carbohidratos</label>
          <span className="text-sm font-medium text-yellow-400">{goals.carbs}g</span>
        </div>
        <input
          type="range"
          min={50}
          max={500}
          step={10}
          value={goals.carbs}
          onChange={(e) => updateGoal("carbs", Number(e.target.value))}
          className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer accent-yellow-500"
        />
      </div>

      {/* Grasas */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm text-zinc-400">Grasas</label>
          <span className="text-sm font-medium text-red-400">{goals.fat}g</span>
        </div>
        <input
          type="range"
          min={20}
          max={200}
          step={5}
          value={goals.fat}
          onChange={(e) => updateGoal("fat", Number(e.target.value))}
          className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer accent-red-500"
        />
      </div>

      {/* Agua */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm text-zinc-400">Agua (vasos)</label>
          <span className="text-sm font-medium text-cyan-400">{goals.water} vasos</span>
        </div>
        <input
          type="range"
          min={4}
          max={16}
          step={1}
          value={goals.water}
          onChange={(e) => updateGoal("water", Number(e.target.value))}
          className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      {/* Summary */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-sm text-zinc-400 mb-2">Resumen calórico</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Proteína:</span>
            <span className="text-blue-400">{goals.protein * 4} kcal</span>
          </div>
          <div className="flex justify-between">
            <span>Carbohidratos:</span>
            <span className="text-yellow-400">{goals.carbs * 4} kcal</span>
          </div>
          <div className="flex justify-between">
            <span>Grasas:</span>
            <span className="text-red-400">{goals.fat * 9} kcal</span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-1 mt-1">
            <span className="font-medium">Total:</span>
            <span className="font-medium">{(goals.protein * 4) + (goals.carbs * 4) + (goals.fat * 9)} kcal</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          onClick={handleReset}
          className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-medium flex items-center justify-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw size={18} />
          Reset
        </motion.button>
        <motion.button
          onClick={handleSave}
          className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
            saved
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
          }`}
          whileTap={{ scale: 0.98 }}
        >
          <Save size={18} />
          {saved ? "¡Guardado!" : "Guardar"}
        </motion.button>
      </div>
    </div>
  );
}
