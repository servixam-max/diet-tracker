"use client";
import { useCallback } from "react";

export function useHaptic() {
  const light = useCallback(() => {
    // Disabled - too distracting
    // if (typeof window !== "undefined" && "vibrate" in navigator) {
    //   navigator.vibrate(5);
    // }
  }, []);

  const medium = useCallback(() => {
    // Disabled - too distracting
    // if (typeof window !== "undefined" && "vibrate" in navigator) {
    //   navigator.vibrate(10);
    // }
  }, []);

  const success = useCallback(() => {
    // Disabled - too distracting
  }, []);

  const warning = useCallback(() => {
    // Disabled - too distracting
  }, []);

  const error = useCallback(() => {
    // Disabled - too distracting
  }, []);

  return { light, medium, success, warning, error };
}
