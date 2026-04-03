"use client";

import { useState, useEffect, useCallback } from "react";
import { offlineDB, type OfflineFoodLog } from "@/lib/offline-db";

interface UseOfflineSyncOptions {
  onSyncComplete?: () => void;
}

export function useOfflineSync({ onSyncComplete }: UseOfflineSyncOptions) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [hasPendingSync, setHasPendingSync] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const checkPendingSync = useCallback(async () => {
    try {
      const unsynced = await offlineDB.getUnsyncedLogs();
      setHasPendingSync(unsynced.length > 0);
    } catch (error) {
      console.error("Error checking pending sync:", error);
    }
  }, []);

  const syncPendingData = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      const unsyncedLogs = await offlineDB.getUnsyncedLogs();
      
      for (const log of unsyncedLogs) {
        try {
          const response = await fetch("/api/food-log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              meal_type: log.meal_type,
              description: log.description,
              calories: log.calories,
              protein_g: log.protein_g,
              carbs_g: log.carbs_g,
              fat_g: log.fat_g,
              date: log.date,
              image_url: log.image_url,
              source: log.source,
            }),
          });

          if (response.ok) {
            await offlineDB.markLogSynced(log.localId);
          } else {
            console.error("Failed to sync log:", await response.text());
            // Re-queue for retry
            throw new Error("Sync failed");
          }
        } catch (error) {
          console.error("Error syncing log:", error);
          // Don't mark as synced, will retry next time
        }
      }

      // Process sync queue
      const queue = await offlineDB.getSyncQueue() as Array<{ id?: number; type: string; data: unknown }>;
      for (const item of queue) {
        try {
          if (item.type === "food-log") {
            const response = await fetch("/api/food-log", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item.data),
            });
            if (response.ok && item.id !== undefined) {
              await offlineDB.removeFromSyncQueue(item.id);
            }
          }
          console.log("Processed sync queue item:", item);
        } catch (error) {
          console.error("Error processing queue item:", error);
          // Retry later
        }
      }

      await offlineDB.clearSyncQueue();
      setHasPendingSync(false);
      setLastSynced(new Date());
      onSyncComplete?.();
      return true;
    } catch (error) {
      console.error("Sync error:", error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, onSyncComplete]);

  // Initialize DB
  useEffect(() => {
    offlineDB.init().catch(console.error);
  }, []);

  // Online/offline detection
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncPendingData]);

  // Check for pending sync on mount
  useEffect(() => {
    checkPendingSync();
  }, [checkPendingSync]);

  async function addFoodLogOffline(log: Omit<OfflineFoodLog, "id">) {
    const localLog = {
      ...log,
      localId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      synced: false,
      created_at: new Date().toISOString(),
    };

    // Save to IndexedDB
    await offlineDB.addFoodLog(localLog as OfflineFoodLog);
    setHasPendingSync(true);

    // If online, try to sync immediately
    if (isOnline) {
      syncPendingData();
    }

    return localLog.localId;
  }

  async function deleteFoodLogOffline(localId: string) {
    await offlineDB.deleteFoodLog(localId);
    await checkPendingSync();
  }

  return {
    isOnline,
    isSyncing,
    hasPendingSync,
    lastSynced,
    addFoodLogOffline,
    deleteFoodLogOffline,
    syncPendingData,
  };
}
