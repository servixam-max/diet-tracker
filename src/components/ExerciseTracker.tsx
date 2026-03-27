"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Plus, Flame, Clock, Dumbbell, TrendingUp } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Exercise {
  id: string;
  name: string;
  duration: number; // minutes
  calories: number;
  type: "cardio" | "strength" | "flexibility" | "sport";
}

interface ExerciseEntry {
  date: string;
  exercises: Exercise[];
}

interface ExerciseTrackerProps {
  userId: string;
}

const EXERCISE_PRESETS: Exercise[] = [
  { id: "1", name: "Caminata", duration: 30, calories: 150, type: "cardio" },
  { id: "2", name: "Correr", duration: 30, calories: 300, type: "cardio" },
  { id: "3", name: "Natación", duration: 30, calories: 250, type: "cardio" },
  { id: "4", name: "Yoga", duration: 45, calories: 120, type: "flexibility" },
  { id: "5", name: "Pesas/Fuerza", duration: 45, calories: 200, type: "strength" },
  { id: "6", name: "Spinning", duration: 30, calories: 350, type: "cardio" },
  { id: "7", name: "CrossFit", duration: 45, calories: 400, type: "strength" },
  { id: "8", name: "Pilates", duration: 45, calories: 150, type: "flexibility" },
  { id: "9", name: "Fútbol", duration: 60, calories: 500, type: "sport" },
  { id: "10", name: "Tenis", duration: 60, calories: 450, type: "sport" },
];

export function ExerciseTracker({ userId }: ExerciseTrackerProps) {
  const [todayExercises, setTodayExercises] = useState<Exercise[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; calories: number; minutes: number }[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const { light, success } = useHaptic();

  useEffect(() => {
    const saved = localStorage.getItem(`exercise-${userId}`);
    if (saved) {
      const data = JSON.parse(saved);
      setTodayExercises(data.today || []);
      setWeeklyData(data.weekly || []);
    } else {
      // Sample weekly data
      const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      const sample = days.map((day, i) => ({
        day,
        calories: Math.round(100 + Math.random() * 300),
        minutes: Math.round(20 + Math.random() * 60),
      }));
      setWeeklyData(sample);
    }
  }, [userId]);

  function addExercise(exercise: Exercise) {
    light();
    const updated = [...todayExercises, { ...exercise, id: crypto.randomUUID() }];
    setTodayExercises(updated);
    localStorage.setItem(`exercise-${userId}`, JSON.stringify({ today: updated, weekly: weeklyData }));
    setShowAdd(false);
    success();
  }

  function removeExercise(id: string) {
    light();
    const updated = todayExercises.filter((e) => e.id !== id);
    setTodayExercises(updated);
    localStorage.setItem(`exercise-${userId}`, JSON.stringify({ today: updated, weekly: weeklyData }));
  }

  const totalCalories = todayExercises.reduce((sum, e) => sum + e.calories, 0);
  const totalMinutes = todayExercises.reduce((sum, e) => sum + e.duration, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-orange-400" />
          <h3 className="font-semibold">Ejercicio</h3>
        </div>
        <motion.button
          onClick={() => { light(); setShowAdd(!showAdd); }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium flex items-center gap-2"
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={16} />
          Añadir
        </motion.button>
      </div>

      {/* Today's summary */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Flame size={20} className="text-orange-400" />
            </div>
            <p className="text-2xl font-bold">{totalCalories}</p>
            <p className="text-xs text-zinc-400">calorías</p>
          </div>
          <div>
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Clock size={20} className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold">{totalMinutes}</p>
            <p className="text-xs text-zinc-400">minutos</p>
          </div>
          <div>
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Dumbbell size={20} className="text-green-400" />
            </div>
            <p className="text-2xl font-bold">{todayExercises.length}</p>
            <p className="text-xs text-zinc-400">ejercicios</p>
          </div>
        </div>
      </div>

      {/* Add exercise menu */}
      {showAdd && (
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-zinc-400">Ejercicios populares:</p>
          {EXERCISE_PRESETS.map((exercise) => (
            <motion.button
              key={exercise.id}
              onClick={() => addExercise(exercise)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-left flex items-center justify-between"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {exercise.type === "cardio" ? "🏃" : exercise.type === "strength" ? "💪" : exercise.type === "flexibility" ? "🧘" : "⚽"}
                </span>
                <div>
                  <p className="font-medium">{exercise.name}</p>
                  <p className="text-xs text-zinc-400">{exercise.duration} min</p>
                </div>
              </div>
              <span className="text-orange-400 font-medium">{exercise.calories} kcal</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Today's exercises */}
      {todayExercises.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">Hoy:</p>
          {todayExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {exercise.type === "cardio" ? "🏃" : exercise.type === "strength" ? "💪" : exercise.type === "flexibility" ? "🧘" : "⚽"}
                </span>
                <div>
                  <p className="font-medium">{exercise.name}</p>
                  <p className="text-xs text-zinc-400">{exercise.duration} min</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-orange-400 font-medium">{exercise.calories}</span>
                <button
                  onClick={() => removeExercise(exercise.id)}
                  className="p-1 rounded hover:bg-white/10 text-zinc-500"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weekly chart */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-green-400" />
          <p className="text-sm text-zinc-400">Esta semana</p>
        </div>
        <div className="flex items-end justify-between gap-1 h-16">
          {weeklyData.map((day, i) => {
            const maxCal = Math.max(...weeklyData.map((d) => d.calories));
            const height = (day.calories / maxCal) * 100;
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-orange-500 to-red-500"
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(10, height)}%` }}
                transition={{ delay: i * 0.1 }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          {weeklyData.map((d, i) => (
            <span key={i}>{d.day}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
