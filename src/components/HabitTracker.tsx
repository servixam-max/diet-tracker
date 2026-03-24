"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Repeat, Flame, Check, Plus } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completedToday: boolean;
  completedDays: boolean[];
}

interface HabitTrackerProps {
  userId: string;
}

export function HabitTracker({ userId }: HabitTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", name: "Beber agua", icon: "💧", streak: 7, completedToday: true, completedDays: [true, true, true, true, true, true, true] },
    { id: "2", name: "Ejercicio", icon: "🏋️", streak: 5, completedToday: false, completedDays: [true, true, false, true, true, true, false] },
    { id: "3", name: "Meditación", icon: "🧘", streak: 3, completedToday: false, completedDays: [false, true, true, false, true, true, true] },
    { id: "4", name: "Dormir 8h", icon: "😴", streak: 12, completedToday: true, completedDays: [true, true, true, true, true, true, true] },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const { light, success } = useHaptic();

  function toggleHabit(id: string) {
    light();
    setHabits(habits.map(habit =>
      habit.id === id
        ? {
            ...habit,
            completedToday: !habit.completedToday,
            streak: !habit.completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1),
          }
        : habit
    ));
    success();
  }

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const maxStreak = Math.max(...habits.map(h => h.streak));

  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Repeat size={18} className="text-orange-400" />
          <h3 className="font-semibold">Hábitos diarios</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500">{completedToday}/{totalHabits}</span>
          {maxStreak >= 7 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-xs">
              <Flame size={12} />
              {maxStreak} días
            </span>
          )}
        </div>
      </div>

      {/* Weekly progress header */}
      <div className="grid grid-cols-8 gap-1 text-center text-xs text-zinc-500">
        <div></div>
        {weekDays.map((day, i) => (
          <div key={i}>{day}</div>
        ))}
      </div>

      {/* Habit list */}
      <div className="space-y-2">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              habit.completedToday
                ? "bg-orange-500/10 border border-orange-500/20"
                : "bg-white/5 border border-white/5"
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <button
              onClick={() => toggleHabit(habit.id)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                habit.completedToday
                  ? "bg-orange-500 border-orange-500"
                  : "border-zinc-600 hover:border-orange-500"
              }`}
            >
              {habit.completedToday && <Check size={16} className="text-white" />}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{habit.icon}</span>
                <p className={`font-medium ${habit.completedToday ? "text-orange-400" : ""}`}>
                  {habit.name}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {habit.completedDays.map((day, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${
                        day ? "bg-orange-500" : "bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                {habit.streak > 0 && (
                  <span className="text-xs text-orange-400 flex items-center gap-0.5">
                    <Flame size={10} />
                    {habit.streak}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add habit button */}
      {!showAdd && (
        <motion.button
          onClick={() => { light(); setShowAdd(true); }}
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-medium flex items-center justify-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          Añadir hábito
        </motion.button>
      )}

      {/* Streak celebration */}
      {completedToday === totalHabits && totalHabits > 0 && (
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-2xl mb-1">🎉</p>
          <p className="font-medium text-orange-300">¡Todos los hábitos completados!</p>
          <p className="text-sm text-zinc-400 mt-1">Mantén la racha</p>
        </motion.div>
      )}
    </div>
  );
}
