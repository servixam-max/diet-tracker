"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Plus, Flame, Clock, ChevronDown, Check } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Exercise {
  id: string;
  name: string;
  category: "cardio" | "strength" | "flexibility" | "sports";
  caloriesPerMin: number;
  icon: string;
}

interface LoggedExercise {
  exercise: Exercise;
  duration: number;
  calories: number;
}

const exerciseDatabase: Exercise[] = [
  { id: "1", name: "Correr", category: "cardio", caloriesPerMin: 12, icon: "🏃" },
  { id: "2", name: "Caminar", category: "cardio", caloriesPerMin: 5, icon: "🚶" },
  { id: "3", name: "Ciclismo", category: "cardio", caloriesPerMin: 10, icon: "🚴" },
  { id: "4", name: "Natación", category: "cardio", caloriesPerMin: 11, icon: "🏊" },
  { id: "5", name: "Pesas", category: "strength", caloriesPerMin: 6, icon: "🏋️" },
  { id: "6", name: "Yoga", category: "flexibility", caloriesPerMin: 4, icon: "🧘" },
  { id: "7", name: "HIIT", category: "cardio", caloriesPerMin: 14, icon: "⚡" },
  { id: "8", name: "Fútbol", category: "sports", caloriesPerMin: 8, icon: "⚽" },
  { id: "9", name: "Baloncesto", category: "sports", caloriesPerMin: 8, icon: "🏀" },
  { id: "10", name: "Tenis", category: "sports", caloriesPerMin: 9, icon: "🎾" },
];

interface ExerciseQuickLogProps {
  userId: string;
}

export function ExerciseQuickLog({ userId }: ExerciseQuickLogProps) {
  const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [duration, setDuration] = useState(30);
  const { light, success } = useHaptic();

  const totalCalories = loggedExercises.reduce((acc, e) => acc + e.calories, 0);

  function addExercise() {
    if (!selectedExercise) return;
    
    light();
    const logged: LoggedExercise = {
      exercise: selectedExercise,
      duration,
      calories: Math.round(selectedExercise.caloriesPerMin * duration),
    };
    setLoggedExercises([...loggedExercises, logged]);
    setShowAdd(false);
    setSelectedExercise(null);
    setDuration(30);
    success();
  }

  function removeExercise(index: number) {
    light();
    setLoggedExercises(loggedExercises.filter((_, i) => i !== index));
  }

  function getCategoryColor(category: Exercise["category"]) {
    switch (category) {
      case "cardio": return "text-red-400 bg-red-500/10";
      case "strength": return "text-blue-400 bg-blue-500/10";
      case "flexibility": return "text-purple-400 bg-purple-500/10";
      case "sports": return "text-green-400 bg-green-500/10";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell size={18} className="text-blue-400" />
          <h3 className="font-semibold">Ejercicio</h3>
        </div>
        {totalCalories > 0 && (
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium">
            -{totalCalories} kcal
          </span>
        )}
      </div>

      {loggedExercises.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {loggedExercises.map((log, index) => (
              <motion.div
                key={index}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <span className="text-2xl">{log.exercise.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{log.exercise.name}</p>
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {log.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame size={12} className="text-orange-400" />
                      {log.calories} kcal
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeExercise(index)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Plus size={16} className="rotate-45" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showAdd ? (
          <motion.div
            className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-2 gap-2">
              {exerciseDatabase.map((exercise) => (
                <motion.button
                  key={exercise.id}
                  onClick={() => { light(); setSelectedExercise(exercise); }}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedExercise?.id === exercise.id
                      ? "bg-blue-500/20 border border-blue-500/40"
                      : "bg-white/5 border border-white/5 hover:border-white/20"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">{exercise.icon}</span>
                  <p className="font-medium mt-1">{exercise.name}</p>
                  <p className="text-xs text-zinc-500">{exercise.caloriesPerMin} kcal/min</p>
                </motion.button>
              ))}
            </div>

            {selectedExercise && (
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Duración</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="5"
                      max="120"
                      value={duration}
                      onChange={(e) => { light(); setDuration(parseInt(e.target.value)); }}
                      className="flex-1 accent-blue-500"
                    />
                    <span className="text-lg font-bold w-16 text-right">{duration} min</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Calorías estimadas</span>
                    <span className="text-xl font-bold text-orange-400">
                      {Math.round(selectedExercise.caloriesPerMin * duration)} kcal
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => { light(); setShowAdd(false); setSelectedExercise(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400"
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    onClick={addExercise}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium"
                    whileTap={{ scale: 0.98 }}
                  >
                    Añadir
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.button
            onClick={() => { light(); setShowAdd(true); }}
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Plus size={18} />
            Añadir ejercicio
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
