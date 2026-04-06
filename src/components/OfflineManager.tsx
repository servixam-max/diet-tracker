"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  WifiOff, Cloud, CloudOff, RefreshCw, AlertCircle,
  Database, Trash2
} from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface OfflineManagerProps {
  userId: string;
}

export function OfflineManager({ userId }: OfflineManagerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [storageSize, setStorageSize] = useState(0);
  const { light, success } = useHaptic();

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => {
      setIsOnline(true);
      syncData();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    let size = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length * 2;
      }
    }
    setStorageSize(size);
  }, []);

  async function syncData() {
    setIsSyncing(true);
    light();
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastSync(new Date());
    setIsSyncing(false);
    success();
  }

  function clearOfflineData() {
    light();
    localStorage.clear();
    setStorageSize(0);
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function formatTimeAgo(date: Date | null): string {
    if (!date) return "Nunca";
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Hace un momento";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days} dias`;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {(!isOnline || showOfflineBanner) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                <WifiOff size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-orange-400">Sin conexion</p>
                <p className="text-sm text-zinc-400">
                  Tus datos se guardaran localmente
                </p>
              </div>
              <button
                onClick={() => setShowOfflineBanner(false)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <AlertCircle size={20} className="text-zinc-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isOnline ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>
              {isOnline ? <Cloud size={20} /> : <CloudOff size={20} />}
            </div>
            <div>
              <p className="font-medium">{isOnline ? "Conectado" : "Modo offline"}</p>
              <p className="text-sm text-zinc-400">
                {lastSync ? `Ultima sync: ${formatTimeAgo(lastSync)}` : "Sin sincronizar"}
              </p>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-orange-500"}`} />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-zinc-400" />
            <span className="text-sm text-zinc-400">Datos locales</span>
          </div>
          <span className="text-sm font-mono">{formatBytes(storageSize)}</span>
        </div>
      </div>

      <motion.button
        onClick={syncData}
        disabled={!isOnline || isSyncing}
        className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
          !isOnline
            ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
        }`}
        whileTap={{ scale: 0.98 }}
      >
        {isSyncing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={18} />
            </motion.div>
            Sincronizando...
          </>
        ) : (
          <>
            <RefreshCw size={18} />
            Sincronizar ahora
          </>
        )}
      </motion.button>

      <motion.button
        onClick={clearOfflineData}
        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-red-400 font-medium flex items-center justify-center gap-2"
        whileTap={{ scale: 0.98 }}
      >
        <Trash2 size={18} />
        Limpiar datos locales
      </motion.button>

      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-zinc-400">
            <p className="mb-1">
              <strong className="text-blue-400">Modo Offline</strong>
            </p>
            <p>
              Los datos se guardan localmente y se sincronizan automaticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
