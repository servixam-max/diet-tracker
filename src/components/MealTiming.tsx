"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Bell, Coffee, Sun, Moon, Utensils } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface MealTimingProps {
  userId: string;
}

const DEFAULT_TIMINGS = {
  breakfast: { time: "08:30", enabled: true, icon: Coffee, label: "Desayuno", color: "from-yellow-500 to-orange-500" },
  morningSnack: { time: "11:00", enabled: false, icon: Sun, label: "Media mañana", color: "from-amber-500 to-yellow-500" },
  lunch: { time: "14:00", enabled: true, icon: Utensils, label: "Almuerzo", color: "from-green-500 to-emerald-500" },
  afternoonSnack: { time: "17:30", enabled: true, icon: Sun, label: "Merienda", color: "from-orange-500 to-red-500" },
  dinner: { time: "21:00", enabled: true, icon: Moon, label: "Cena", color: "from-purple-500 to-indigo-500" },
};

export function MealTiming({ userId }: MealTimingProps) {
  const [timings, setTimings] = useState(DEFAULT_TIMINGS);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const { light, success } = useHaptic();

  useEffect(() => {
    const saved = localStorage.getItem(`meal-timings-${userId}`);
    if (saved) setTimings(JSON.parse(saved));
    setNotificationPermission(Notification.permission);
  }, [userId]);

  function toggleMeal(key: string) {
    light();
    setTimings((prev) => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], enabled: !prev[key as keyof typeof prev].enabled },
    }));
  }

  function updateTime(key: string, time: string) {
    light();
    setTimings((prev) => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], time },
    }));
  }

  async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === "granted") success();
  }

  function save() {
    localStorage.setItem(`meal-timings-${userId}`, JSON.stringify(timings));
    success();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-zinc-400" />
          <h3 className="font-semibold">Horarios de comida</h3>
        </div>
        {notificationPermission === "default" && (
          <button
            onClick={requestNotificationPermission}
            className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs"
          >
            Activar notificaciones
          </button>
        )}
      </div>

      {notificationPermission === "denied" && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          Las notificaciones están bloqueadas. Actívalas en la configuración del navegador.
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(timings).map(([key, meal]) => {
          const Icon = meal.icon;
          return (
            <motion.div
              key={key}
              className={`p-4 rounded-2xl border transition-colors ${
                meal.enabled ? "bg-white/5 border-white/10" : "bg-white/5 border-white/5 opacity-50"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meal.color} flex items-center justify-center`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="font-medium">{meal.label}</span>
                </div>
                <button
                  onClick={() => toggleMeal(key)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors relative ${
                    meal.enabled ? "bg-green-500" : "bg-zinc-600"
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow"
                    animate={{ x: meal.enabled ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {meal.enabled && (
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={meal.time}
                    onChange={(e) => updateTime(key, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                  {notificationPermission === "granted" && (
                    <button
                      onClick={() => {
                        new Notification(`🍽️ ${meal.label}`, {
                          body: `Es hora de registrar tu ${meal.label.toLowerCase()}`,
                        });
                        success();
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10"
                    >
                      <Bell size={18} className="text-zinc-400" />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.button
        onClick={save}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold"
        whileTap={{ scale: 0.98 }}
      >
        Guardar horarios
      </motion.button>
    </div>
  );
}
