"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, RefreshCw, Check } from "lucide-react";

interface OfflineIndicatorProps {
  isOnline: boolean;
  isSyncing?: boolean;
  hasPendingSync?: boolean;
  lastSynced?: Date | null;
}

export function OfflineIndicator({ isOnline, isSyncing, hasPendingSync, lastSynced }: OfflineIndicatorProps) {
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      setShowReconnected(true);
      setWasOffline(false);
      setTimeout(() => setShowReconnected(false), 3000);
    }
  }, [isOnline, wasOffline]);

  // Don't show if online and no pending sync
  if (isOnline && !hasPendingSync && !showReconnected) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
        >
          <div className="flex items-center justify-center gap-2 text-white text-sm font-medium">
            <WifiOff size={16} />
            <span>Sin conexión - Los datos se guardarán localmente</span>
          </div>
        </motion.div>
      )}

      {showReconnected && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
        >
          <div className="flex items-center justify-center gap-2 text-white text-sm font-medium">
            <Wifi size={16} />
            <span>¡Vuelta a conectada! Sincronizando...</span>
          </div>
        </motion.div>
      )}

      {isOnline && hasPendingSync && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
        >
          <div className="flex items-center justify-center gap-2 text-white text-sm font-medium">
            {isSyncing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <RefreshCw size={16} />
                </motion.div>
                <span>Sincronizando datos...</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                <span>Datos pendientes de sincronizar</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
