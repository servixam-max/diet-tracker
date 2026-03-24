"use client";
import { useCallback } from "react";

export function useHaptic() {
  const light = useCallback(() => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  }, []);

  const medium = useCallback(() => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(25);
    }
  }, []);

  const success = useCallback(() => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  }, []);

  const warning = useCallback(() => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  }, []);

  const error = useCallback(() => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }, []);

  return { light, medium, success, warning, error };
}
