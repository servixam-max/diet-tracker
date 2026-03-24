"use client";

import { useEffect } from "react";
import { useServiceWorker } from "@/hooks/useServiceWorker";

export function ServiceWorkerRegistration() {
  const { isRegistered, isUpdateAvailable, update } = useServiceWorker();

  useEffect(() => {
    if (isRegistered) {
      console.log("[App] Service Worker registered");
    }
  }, [isRegistered]);

  // Show update prompt if available
  useEffect(() => {
    if (isUpdateAvailable) {
      console.log("[App] New version available");
      // Could show a toast or banner here
    }
  }, [isUpdateAvailable]);

  return null; // Silent registration
}
