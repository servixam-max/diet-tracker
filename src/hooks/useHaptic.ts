"use client";

import { useCallback } from "react";

type HapticType = "light" | "medium" | "heavy" | "success" | "warning" | "error";

const hapticPatterns: Record<HapticType, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: [30, 50, 30],
  success: [10, 50, 10, 50, 10],
  warning: [20, 100, 20],
  error: [50, 30, 50, 30, 50],
};

export function useHaptic() {
  const trigger = useCallback((type: HapticType = "light") => {
    if (typeof navigator === "undefined" || !navigator.vibrate) {
      return;
    }
    
    try {
      navigator.vibrate(hapticPatterns[type]);
    } catch (e) {
      console.warn("[Haptic] Vibration failed:", e);
    }
  }, []);

  const success = useCallback(() => trigger("success"), [trigger]);
  const warning = useCallback(() => trigger("warning"), [trigger]);
  const error = useCallback(() => trigger("error"), [trigger]);
  const light = useCallback(() => trigger("light"), [trigger]);
  const medium = useCallback(() => trigger("medium"), [trigger]);
  const heavy = useCallback(() => trigger("heavy"), [trigger]);

  return { trigger, success, warning, error, light, medium, heavy };
}
