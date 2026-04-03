"use client";

import { useState, useCallback } from "react";

interface NotificationPermission {
  status: "granted" | "denied" | "default" | "unknown";
}

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  time: Date;
  mealType?: "breakfast" | "lunch" | "dinner" | "snack";
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission["status"]>(() => {
    if (typeof window !== "undefined" && typeof Notification !== "undefined") {
      return Notification.permission as NotificationPermission["status"];
    }
    return "unknown";
  });
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof Notification === "undefined") {
      setPermission("unknown");
      return false;
    }
    
    const result = await Notification.requestPermission();
    setPermission(result as NotificationPermission["status"]);
    return result === "granted";
  }, []);

  // Schedule a local notification
  const scheduleNotification = useCallback((
    title: string,
    body: string,
    time: Date,
    mealType?: "breakfast" | "lunch" | "dinner" | "snack"
  ): string => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const notification: ScheduledNotification = {
      id,
      title,
      body,
      time,
      mealType,
    };

    setScheduledNotifications(prev => [...prev, notification]);

    // Schedule using setTimeout for local notifications
    const delay = time.getTime() - Date.now();
    
    if (delay > 0) {
      setTimeout(() => {
        if (permission === "granted") {
          new Notification(title, {
            body,
            icon: "🍽️",
            badge: "🍽️",
          });
        }
      }, delay);
    }

    return id;
  }, [permission]);

  // Cancel a scheduled notification
  const cancelNotification = useCallback((id: string): void => {
    setScheduledNotifications(prev => prev.filter(n => n.id !== id));
    // Note: Web Notifications API doesn't have a built-in cancel for scheduled notifications
    // This removes it from our tracking list
  }, []);

  // Cancel all scheduled notifications
  const cancelAllNotifications = useCallback((): void => {
    setScheduledNotifications([]);
  }, []);

  // Check if permission is granted
  const hasPermission = useCallback((): boolean => {
    return permission === "granted";
  }, [permission]);

  // Send immediate notification
  const sendNotification = useCallback((
    title: string,
    body: string,
    options?: NotificationOptions
  ): void => {
    if (permission === "granted") {
      new Notification(title, {
        body,
        icon: "🍽️",
        badge: "🍽️",
        ...options,
      });
    }
  }, [permission]);

  // Schedule meal reminder
  const scheduleMealReminder = useCallback((
    mealType: "breakfast" | "lunch" | "dinner" | "snack",
    time: string // HH:MM format
  ): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime.getTime() < now.getTime()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const titles = {
      breakfast: "☕ Es hora del desayuno",
      lunch: "🍽️ Es hora del almuerzo",
      dinner: "🍽️ Es hora de la cena",
      snack: "🥗 Es hora del snack",
    };

    return scheduleNotification(
      titles[mealType],
      "No olvides registrar tu comida para mantener tu racha",
      scheduledTime,
      mealType
    );
  }, [scheduleNotification]);

  return {
    permission,
    requestPermission,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    hasPermission,
    sendNotification,
    scheduleMealReminder,
    scheduledNotifications,
  };
}
