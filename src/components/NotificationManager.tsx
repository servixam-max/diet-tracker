"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Clock, Check, Calendar, Utensils, Droplets, Flame } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: "meal" | "water" | "exercise" | "reminder" | "streak";
  scheduledTime: Date;
  repeat?: "daily" | "weekly" | "once";
  enabled: boolean;
}

interface NotificationManagerProps {
  userId: string;
}

const defaultNotifications: Notification[] = [
  {
    id: "1",
    title: "Desayuno 🌅",
    body: "¡Es hora de tu desayuno saludable!",
    type: "meal",
    scheduledTime: new Date(new Date().setHours(8, 0, 0, 0)),
    repeat: "daily",
    enabled: true,
  },
  {
    id: "2",
    title: "Almuerzo 🍽️",
    body: "No olvides registrar tu comida",
    type: "meal",
    scheduledTime: new Date(new Date().setHours(14, 0, 0, 0)),
    repeat: "daily",
    enabled: true,
  },
  {
    id: "3",
    title: "Cena 🌙",
    body: "¿Ya planeaste tu cena?",
    type: "meal",
    scheduledTime: new Date(new Date().setHours(20, 0, 0, 0)),
    repeat: "daily",
    enabled: true,
  },
  {
    id: "4",
    title: "Hidratación 💧",
    body: "¡Bebe agua! Tu cuerpo te lo agradecerá",
    type: "water",
    scheduledTime: new Date(new Date().setHours(10, 0, 0, 0)),
    repeat: "daily",
    enabled: false,
  },
  {
    id: "5",
    title: "Ejercicio 🔥",
    body: "¡Es hora de moverse! 30 min de actividad",
    type: "exercise",
    scheduledTime: new Date(new Date().setHours(18, 0, 0, 0)),
    repeat: "daily",
    enabled: false,
  },
  {
    id: "6",
    title: "¡No rompas tu racha! 🔥",
    body: "Registra tu última comida del día",
    type: "streak",
    scheduledTime: new Date(new Date().setHours(21, 30, 0, 0)),
    repeat: "daily",
    enabled: true,
  },
];

export function NotificationManager({ userId }: NotificationManagerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [showPreview, setShowPreview] = useState(false);
  const [previewNotification, setPreviewNotification] = useState<Notification | null>(null);
  const { light, success } = useHaptic();

  // Load notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`notifications-${userId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotifications(parsed.map((n: Notification) => ({
        ...n,
        scheduledTime: new Date(n.scheduledTime)
      })));
    } else {
      setNotifications(defaultNotifications);
    }

    // Check notification permission
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, [userId]);

  // Save notifications when changed
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(`notifications-${userId}`, JSON.stringify(notifications));
    }
  }, [notifications, userId]);

  // Schedule notifications
  useEffect(() => {
    if (permission !== "granted") return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      notifications.forEach((notif) => {
        if (!notif.enabled) return;
        
        const notifTime = new Date(notif.scheduledTime);
        if (
          now.getHours() === notifTime.getHours() &&
          now.getMinutes() === notifTime.getMinutes() &&
          now.getSeconds() === 0
        ) {
          showNotification(notif);
        }
      });
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [notifications, permission]);

  async function requestPermission() {
    if (!("Notification" in window)) {
      alert("Tu navegador no soporta notificaciones");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === "granted") {
      success();
      // Show welcome notification
      new Notification("Diet Tracker", {
        body: "¡Notificaciones activadas! 🎉",
        icon: "/icon.png",
        badge: "/badge.png",
      });
    }
  }

  function showNotification(notification: Notification) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      body: notification.body,
      icon: "/icon.png",
      badge: "/badge.png",
      tag: notification.id,
      requireInteraction: notification.type === "streak",
    };
    
    // Add actions if supported (mobile devices)
    if ('actions' in Notification.prototype) {
      options.actions = [
        { action: "open", title: "Abrir app" },
        { action: "dismiss", title: "Descartar" },
      ];
    }
    
    new Notification(notification.title, options);
  }

  function toggleNotification(id: string) {
    light();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  }

  function updateNotificationTime(id: string, timeString: string) {
    const [hours, minutes] = timeString.split(":").map(Number);
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const newTime = new Date(n.scheduledTime);
          newTime.setHours(hours, minutes, 0, 0);
          return { ...n, scheduledTime: newTime };
        }
        return n;
      })
    );
  }

  function showNotificationPreview(notification: Notification) {
    setPreviewNotification(notification);
    setShowPreview(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowPreview(false);
    }, 5000);
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case "meal":
        return <Utensils size={16} />;
      case "water":
        return <Droplets size={16} />;
      case "exercise":
        return <Flame size={16} />;
      case "streak":
        return <Calendar size={16} />;
      default:
        return <Bell size={16} />;
    }
  }

  function getNotificationColor(type: string) {
    switch (type) {
      case "meal":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "water":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "exercise":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "streak":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      default:
        return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  }

  const enabledCount = notifications.filter((n) => n.enabled).length;

  return (
    <div className="space-y-4">
      {/* Permission banner */}
      {permission !== "granted" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-amber-400 mb-1">
                Activa las notificaciones
              </p>
              <p className="text-sm text-zinc-400 mb-3">
                Recibe recordatorios de comidas, hidratación y más
              </p>
              <motion.button
                onClick={requestPermission}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-medium text-sm"
                whileTap={{ scale: 0.98 }}
              >
                Activar notificaciones
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Status */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${permission === "granted" ? "bg-green-500/20 text-green-400" : "bg-zinc-500/20 text-zinc-400"}`}>
            <Bell size={20} />
          </div>
          <div>
            <p className="font-medium">
              {permission === "granted" ? "Notificaciones activas" : "Notificaciones desactivadas"}
            </p>
            <p className="text-sm text-zinc-400">
              {enabledCount} recordatorios configurados
            </p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${permission === "granted" ? "bg-green-500" : "bg-zinc-500"}`} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          onClick={() => {
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, enabled: true }))
            );
            success();
          }}
          className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          Activar todas
        </motion.button>
        <motion.button
          onClick={() => {
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, enabled: false }))
            );
            light();
          }}
          className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          Desactivar todas
        </motion.button>
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        <p className="text-sm text-zinc-400 font-medium mb-2">Recordatorios</p>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={`p-4 rounded-2xl border transition-all ${
              notification.enabled
                ? getNotificationColor(notification.type)
                : "bg-white/5 border-white/5 opacity-50"
            }`}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl ${notification.enabled ? "bg-white/10" : "bg-white/5"}`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">{notification.title}</p>
                  <button
                    onClick={() => toggleNotification(notification.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      notification.enabled ? "bg-green-500" : "bg-zinc-600"
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white"
                      animate={{ left: notification.enabled ? "28px" : "4px" }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
                <p className="text-sm opacity-70 mb-2">{notification.body}</p>
                
                {/* Time selector */}
                <div className="flex items-center gap-2">
                  <Clock size={14} className="opacity-50" />
                  <input
                    type="time"
                    value={notification.scheduledTime.toTimeString().slice(0, 5)}
                    onChange={(e) => updateNotificationTime(notification.id, e.target.value)}
                    disabled={!notification.enabled}
                    className="bg-transparent text-sm font-mono outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview notification */}
      <AnimatePresence>
        {showPreview && previewNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-4 right-4 z-50"
          >
            <div className="p-4 rounded-2xl bg-[#1a1a2e] border border-white/10 shadow-2xl shadow-black/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Bell size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm">{previewNotification.title}</p>
                    <span className="text-xs text-zinc-500">ahora</span>
                  </div>
                  <p className="text-sm text-zinc-400">{previewNotification.body}</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1 rounded-lg hover:bg-white/10"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
