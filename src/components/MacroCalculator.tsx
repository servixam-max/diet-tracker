"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Save, RotateCcw } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface MacroCalculatorProps {
  onSave?: (macros: { protein: number; carbs: number; fat: number; calories: number }) => void;
}

export function MacroCalculator({ onSave }: MacroCalculatorProps) {
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain">("maintain");
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState<"sedentary" | "moderate" | "active">("moderate");
  const [calculated, setCalculated] = useState<{ protein: number; carbs: number; fat: number; calories: number } | null>(null);
  const { light, success } = useHaptic();

  function calculate() {
    light();
    
    // Basic TDEE calculation
    const bmr = weight * 24;
    const activityMultipliers = {
      sedentary: 1.2,
      moderate: 1.55,
      active: 1.9,
    };
    const tdee = bmr * activityMultipliers[activity];
    
    // Adjust based on goal
    const goalAdjustment = {
      lose: 0.8,
      maintain: 1.0,
      gain: 1.15,
    };
    const calories = Math.round(tdee * goalAdjustment[goal]);
    
    // Macro split
    const proteinPerKg = goal === "lose" ? 2.2 : goal === "gain" ? 2.0 : 1.8;
    const protein = Math.round(weight * proteinPerKg);
    const fat = Math.round((calories * 0.25) / 9);
    const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);
    
    setCalculated({ protein, carbs, fat, calories });
    success();
  }

  function reset() {
    light();
    setCalculated(null);
  }

  const activityLabels = {
    sedentary: "Sedentario",
    moderate: "Moderado",
    active: "Activo",
  };

  const goalLabels = {
    lose: "Perder peso",
    maintain: "Mantener",
    gain: "Ganar músculo",
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Calculator size={16} className="text-white" />
        </div>
        <h3 className="font-semibold">Calculadora de macros</h3>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        {/* Goal */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Objetivo</label>
          <div className="grid grid-cols-3 gap-2">
            {(["lose", "maintain", "gain"] as const).map((g) => (
              <button
                key={g}
                onClick={() => { light(); setGoal(g); }}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                  goal === g
                    ? g === "lose"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : g === "maintain"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-white/5 border border-white/10 text-zinc-400"
                }`}
              >
                {goalLabels[g]}
              </button>
            ))}
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Peso (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-500/50 text-white"
            min={30}
            max={200}
          />
        </div>

        {/* Activity */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Nivel de actividad</label>
          <div className="grid grid-cols-3 gap-2">
            {(["sedentary", "moderate", "active"] as const).map((a) => (
              <button
                key={a}
                onClick={() => { light(); setActivity(a); }}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                  activity === a
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-white/5 border border-white/10 text-zinc-400"
                }`}
              >
                {activityLabels[a]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calculate button */}
      <motion.button
        onClick={calculate}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium flex items-center justify-center gap-2"
        whileTap={{ scale: 0.98 }}
      >
        <Calculator size={18} />
        Calcular
      </motion.button>

      {/* Results */}
      {calculated && (
        <motion.div
          className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-4">
            <p className="text-3xl font-bold gradient-text">{calculated.calories}</p>
            <p className="text-sm text-zinc-400">kcal diarias</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-blue-500/10">
              <p className="text-lg font-bold text-blue-400">{calculated.protein}g</p>
              <p className="text-xs text-zinc-400">Proteína</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-yellow-500/10">
              <p className="text-lg font-bold text-yellow-400">{calculated.carbs}g</p>
              <p className="text-xs text-zinc-400">Carbos</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-red-500/10">
              <p className="text-lg font-bold text-red-400">{calculated.fat}g</p>
              <p className="text-xs text-zinc-400">Grasas</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <motion.button
              onClick={reset}
              className="flex-1 py-2 rounded-xl bg-white/5 text-zinc-400 text-sm flex items-center justify-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={16} />
              Reset
            </motion.button>
            {onSave && (
              <motion.button
                onClick={() => { success(); onSave(calculated); }}
                className="flex-1 py-2 rounded-xl bg-green-500/20 text-green-400 text-sm flex items-center justify-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                <Save size={16} />
                Guardar
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
