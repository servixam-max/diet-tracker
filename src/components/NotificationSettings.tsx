"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, Clock, Check, Smartphone, Coffee, Utensils } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface NotificationConfig {
  mealReminders: boolean;
  mealTimes: { breakfast: string; lunch: string; dinner: string; snack: string };
  waterReminders: boolean;
  waterInterval: number;
  weeklyReport: boolean;
  achievementAlerts: boolean;
  quietHours: { enabled: boolean; start: string; end: string };
}

interface NotificationSettingsProps {
  userId: string;
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [config, setConfig] = useState<NotificationConfig>({
    mealReminders: true,
    mealTimes: { breakfast: "08:30", lunch: "14:00", dinner: "21:00", snack: "17:00" },
    waterReminders: true,
    waterInterval: 60,
    weeklyReport: true,
    achievementAlerts: true,
    quietHours: { enabled: true, start: "22:00", end: "08:00" },
  });
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const { light, success } = useHaptic();

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
    const saved = localStorage.getItem(`notifications-${userId}`);
    if (saved) setConfig(JSON.parse(saved));
  }, [userId]);

  async function requestPermission() {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") success();
  }

  function updateConfig(key: string, value: any) {
    light();
    const updated = { ...config, [key]: value };
    setConfig(updated);
    localStorage.setItem(`notifications-${userId}`, JSON.stringify(updated));
  }

  function updateMealTime(meal: keyof typeof config.mealTimes, time: string) {
    light();
    const updated = {
      ...config,
      mealTimes: { ...config.mealTimes, [meal]: time },
    };
    setConfig(updated);
    localStorage.setItem(`notifications-${userId}`, JSON.stringify(updated));
  }

  function testNotification() {
    light();
    if (permission === "granted") {
      new Notification("🍽️ Recordatorio de prueba", {
        body: "Las notificaciones están funcionando correctamente",
        icon: "🍽️",
      });
      success();
    }
  }

  if (permission === "denied") {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
        <div className="flex items-center gap-3 mb-3">
          <BellOff size={24} className="text-red-400" />
          <h3 className="font-bold text-red-400">Notificaciones bloqueadas</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">
          Las notificaciones están bloqueadas en tu navegador. Para activarlas, ve a la configuración del sitio y permite las notificaciones.
        </p>
        <button
          onClick={() => window.open("chrome://settings/content/notifications")}
          className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium"
        >
          Abrir configuración
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-blue-400" />
          <h3 className="font-semibold">Notificaciones</h3>
        </div>
        {permission === "default" && (
          <motion.button
            onClick={requestPermission}
            className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium"
            whileTap={{ scale: 0.95 }}
          >
            Activar
          </motion.button>
        )}
        {permission === "granted" && (
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
            ✓ Activadas
          </span>
        )}
      </div>

      {permission === "default" && (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <Bell size={20} className="text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium text-blue-400">Activa las notificaciones</p>
              <p className="text-sm text-zinc-400">
                Recibe recordatorios para registrar tus comidas y mantener tu racha.
              </p>
            </div>
          </div>
        </div>
      )}

      {permission === "granted" && (
        <>
          {/* Meal reminders */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Coffee size={18} className="text-orange-400" />
                <div>
                  <p className="font-medium">Recordatorios de comida</p>
                  <p className="text-xs text-zinc-500">Te avisan cuando es hora de comer</p>
                </div>
              </div>
              <button
                onClick={() => updateConfig("mealReminders", !config.mealReminders)}
                className={`w-12 h-7 rounded-full p-1 transition-colors relative ${
                  config.mealReminders ? "bg-green-500" : "bg-zinc-600"
                }`}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white shadow"
                  animate={{ x: config.mealReminders ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {config.mealReminders && (
              <div className="space-y-3">
                {Object.entries(config.mealTimes).map(([meal, time]) => (
                  <div key={meal} className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400 capitalize">{meal}</span>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => updateMealTime(meal as keyof typeof config.mealTimes, e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Water reminders */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Smartphone size={18} className="text-cyan-400" />
                <div>
                  <p className="font-medium">Recordatorios de agua</p>
                  <p className="text-xs text-zinc-400">Mantente hidratado durante el día</p>
                </div>
              </div>
              <button
                onClick={() => updateConfig("waterReminders", !config.waterReminders)}
                className={`w-12 h-7 rounded-full p-1 transition-colors relative ${
                  config.waterReminders ? "bg-green-500" : "bg-zinc-600"
                }`}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white shadow"
                  animate={{ x: config.waterReminders ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {config.waterReminders && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-400">Cada</span>
                <select
                  value={config.waterInterval}
                  onChange={(e) => updateConfig("waterInterval", parseInt(e.target.value))}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm"
                >
                  <option value={30}>30 min</option>
                  <option value={60}>1 hora</option>
                  <option value={90}>1.5 horas</option>
                  <option value={120}>2 horas</option>
                </select>
              </div>
            )}
          </div>

          {/* Weekly report */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-green-400" />
              <div>
                <p className="font-medium">Informe semanal</p>
                <p className="text-xs text-zinc-500">Resumen de tu progreso cada domingo</p>
              </div>
            </div>
            <button
              onClick={() => updateConfig("weeklyReport", !config.weeklyReport)}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative ${
                config.weeklyReport ? "bg-green-500" : "bg-zinc-600"
              }`}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white shadow"
                animate={{ x: config.weeklyReport ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Achievement alerts */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check size={18} className="text-yellow-400" />
              <div>
                <p className="font-medium">Alertas de logros</p>
                <p className="text-xs text-zinc-500">Notificaciones cuando desbloquees logros</p>
              </div>
            </div>
            <button
              onClick={() => updateConfig("achievementAlerts", !config.achievementAlerts)}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative ${
                config.achievementAlerts ? "bg-green-500" : "bg-zinc-600"
              }`}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white shadow"
                animate={{ x: config.achievementAlerts ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Quiet hours */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-indigo-400" />
                <div>
                  <p className="font-medium">Horas de silencio</p>
                  <p className="text-xs text-zinc-500">Sin notificaciones durante la noche</p>
                </div>
              </div>
              <button
                onClick={() => updateConfig("quietHours", { ...config.quietHours, enabled: !config.quietHours.enabled })}
                className={`w-12 h-7 rounded-full p-1 transition-colors relative ${
                  config.quietHours.enabled ? "bg-green-500" : "bg-zinc-600"
                }`}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white shadow"
                  animate={{ x: config.quietHours.enabled ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {config.quietHours.enabled && (
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={config.quietHours.start}
                  onChange={(e) => updateConfig("quietHours", { ...config.quietHours, start: e.target.value })}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm"
                />
                <span className="text-zinc-500">a</span>
                <input
                  type="time"
                  value={config.quietHours.end}
                  onChange={(e) => updateConfig("quietHours", { ...config.quietHours, end: e.target.value })}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm"
                />
              </div>
            )}
          </div>

          {/* Test button */}
          <motion.button
            onClick={testNotification}
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-medium flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Bell size={18} />
            Probar notificación
          </motion.button>
        </>
      )}
    </div>
  );
}
