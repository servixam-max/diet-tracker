"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Save, Plus, Trash2, ChevronDown } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Goal {
  id: string;
  type: "weight" | "calories" | "protein" | "exercise" | "water" | "sleep";
  name: string;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
}

interface GoalSettingProps {
  userId: string;
  onGoalsChange?: (goals: Goal[]) => void;
}

const GOAL_TYPES = {
  weight: { label: "Peso objetivo", unit: "kg", icon: "⚖️", color: "from-blue-500 to-cyan-500" },
  calories: { label: "Calorías diarias", unit: "kcal", icon: "🔥", color: "from-orange-500 to-red-500" },
  protein: { label: "Proteína diaria", unit: "g", icon: "💪", color: "from-purple-500 to-pink-500" },
  exercise: { label: "Ejercicio semanal", unit: "min", icon: "🏃", color: "from-green-500 to-emerald-500" },
  water: { label: "Agua diaria", unit: "ml", icon: "💧", color: "from-cyan-500 to-blue-500" },
  sleep: { label: "Horas de sueño", unit: "h", icon: "😴", color: "from-indigo-500 to-purple-500" },
};

export function GoalSetting({ userId, onGoalsChange }: GoalSettingProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const { light, success } = useHaptic();

  useEffect(() => {
    const saved = localStorage.getItem(`goals-${userId}`);
    if (saved) {
      setGoals(JSON.parse(saved));
    } else {
      // Default goals
      setGoals([
        { id: "1", type: "weight", name: "Peso objetivo", target: 75, current: 82, unit: "kg" },
        { id: "2", type: "calories", name: "Calorías diarias", target: 2000, current: 1850, unit: "kcal" },
        { id: "3", type: "protein", name: "Proteína diaria", target: 120, current: 95, unit: "g" },
        { id: "4", type: "exercise", name: "Ejercicio semanal", target: 150, current: 120, unit: "min" },
      ]);
    }
  }, [userId]);

  function addGoal(type: Goal["type"]) {
    const config = GOAL_TYPES[type];
    const newGoal: Goal = {
      id: Date.now().toString(),
      type,
      name: config.label,
      target: type === "weight" ? 70 : type === "calories" ? 2000 : type === "protein" ? 100 : type === "exercise" ? 150 : type === "water" ? 2500 : 8,
      current: 0,
      unit: config.unit,
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    localStorage.setItem(`goals-${userId}`, JSON.stringify(updated));
    onGoalsChange?.(updated);
    light();
  }

  function updateGoal(id: string, field: "target" | "current", value: number) {
    const updated = goals.map((g) => (g.id === id ? { ...g, [field]: value } : g));
    setGoals(updated);
    localStorage.setItem(`goals-${userId}`, JSON.stringify(updated));
    onGoalsChange?.(updated);
    light();
  }

  function deleteGoal(id: string) {
    light();
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    localStorage.setItem(`goals-${userId}`, JSON.stringify(updated));
    onGoalsChange?.(updated);
  }

  function save() {
    success();
    setIsEditing(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-green-400" />
          <h3 className="font-semibold">Mis objetivos</h3>
        </div>
        <motion.button
          onClick={() => { light(); setIsEditing(!isEditing); }}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium"
          whileTap={{ scale: 0.95 }}
        >
          {isEditing ? "Hecho" : "Editar"}
        </motion.button>
      </div>

      {/* Goals list */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const config = GOAL_TYPES[goal.type];
          const progress = goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0;
          const isAchieved = goal.current >= goal.target;

          return (
            <motion.div
              key={goal.id}
              className={`p-4 rounded-2xl bg-white/5 border transition-colors ${
                isAchieved ? "border-green-500/30 bg-green-500/5" : "border-white/10"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-xl`}>
                  {config.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{goal.name}</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={goal.target}
                      onChange={(e) => updateGoal(goal.id, "target", parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 rounded bg-white/10 text-sm outline-none"
                    />
                  ) : (
                    <p className="text-sm text-zinc-400">Meta: {goal.target} {goal.unit}</p>
                  )}
                </div>
                {isEditing && (
                  <button onClick={() => deleteGoal(goal.id)} className="p-2 rounded-lg hover:bg-white/10 text-red-400">
                    <Trash2 size={18} />
                  </button>
                )}
                {isAchieved && !isEditing && (
                  <span className="text-2xl">🎉</span>
                )}
              </div>

              {/* Progress bar */}
              <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isAchieved ? "bg-green-500" : "bg-gradient-to-r " + config.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between mt-2 text-sm">
                <span className={isAchieved ? "text-green-400" : "text-zinc-400"}>
                  {goal.current} / {goal.target} {goal.unit}
                </span>
                <span className="text-zinc-500">{Math.round(progress)}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add goal */}
      {isEditing && (
        <motion.div
          className="p-4 rounded-2xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-zinc-400 mb-3">Añadir objetivo:</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(GOAL_TYPES) as Goal["type"][]).filter((type) => !goals.find((g) => g.type === type)).map((type) => {
              const config = GOAL_TYPES[type];
              return (
                <motion.button
                  key={type}
                  onClick={() => addGoal(type)}
                  className={`p-3 rounded-xl bg-gradient-to-br ${config.color} text-white text-center`}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl block mb-1">{config.icon}</span>
                  <span className="text-xs">{config.label.split(" ")[0]}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Save button */}
      {isEditing && (
        <motion.button
          onClick={save}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold flex items-center justify-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          <Save size={20} />
          Guardar objetivos
        </motion.button>
      )}
    </div>
  );
}
