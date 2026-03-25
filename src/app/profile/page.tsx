"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { User, LogOut, Target, Award, Shield, Settings } from "lucide-react";
import { WeightChart } from "@/components/WeightChart";
import { BodyMeasurements } from "@/components/BodyMeasurements";
import { ProgressPhotos } from "@/components/ProgressPhotos";
import { AchievementBadge } from "@/components/AchievementBadge";
import { StreakCounter } from "@/components/StreakCounter";

export default function ProfilePage() {
  const mountedRef = useRef(false);
  const [isDemo, setIsDemo] = useState(false);
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    mountedRef.current = true;
    setIsDemo(localStorage.getItem("demo-mode") === "true");
  }, []);

  useEffect(() => {
    if (!loading && !user && !isDemo) {
      router.push("/login");
    }
  }, [user, loading, router, isDemo]);

  async function handleLogout() {
    await logout();
    localStorage.removeItem("demo-mode");
    router.push("/login");
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (!mountedRef.current || loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-4 border-white/20 border-t-green-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    );
  }

  if (isDemo || !user) {
    return (
      <div className="h-full flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        
        <div className="relative flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
          <motion.header 
            className="pt-8 pb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold">Perfil</h1>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
              Modo Demo
            </span>
          </motion.header>

          <motion.div 
            className="relative p-6 rounded-3xl overflow-hidden mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/5" />
            <div className="absolute inset-0 backdrop-blur-xl" />
            <div className="absolute inset-0 border border-white/10 rounded-3xl" />
            
            <div className="relative flex items-center gap-4">
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30"
                whileHover={{ scale: 1.05 }}
              >
                <User size={36} className="text-white" />
              </motion.div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Usuario Demo</h2>
                <p className="text-sm text-zinc-400">demo@ejemplo.com</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-yellow-400" />
              <div>
                <p className="font-medium text-yellow-400">Modo demostración</p>
                <p className="text-sm text-zinc-400">
                  Los datos mostrados son ejemplos. Crea una cuenta para guardar tu progreso real.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-4 rounded-2xl glass-card">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-green-400" />
                <span className="text-xs text-zinc-400">Calorías objetivo</span>
              </div>
              <p className="text-2xl font-bold gradient-text">2,000</p>
            </div>
            <div className="p-4 rounded-2xl glass-card">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} className="text-yellow-400" />
                <span className="text-xs text-zinc-400">Nivel</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">Demo</p>
            </div>
          </motion.div>

          <div className="space-y-6">
            <WeightChart currentWeight={75} targetWeight={70} />
            <StreakCounter userId="demo" />
            <AchievementBadge userId="demo" />
            <ProgressPhotos userId="demo" />
            <BodyMeasurements userId="demo" />
          </div>

          <motion.div
            className="p-6 rounded-2xl glass-card mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Settings size={20} className="text-zinc-400" />
              <h3 className="font-semibold">Configuración</h3>
            </div>
            <div className="space-y-3 text-sm text-zinc-400">
              <p>• Preferencias de unidades</p>
              <p>• Notificaciones</p>
              <p>• Tema de color</p>
              <p>• Exportar datos</p>
            </div>
          </motion.div>

          <motion.button 
            onClick={() => router.push("/login")}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-400 font-medium mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <User size={20} />
            <span>Crear cuenta o iniciar sesión</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      
      <div className="relative flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
        <motion.header 
          className="pt-8 pb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold">Perfil</h1>
        </motion.header>

        <motion.div 
          className="relative p-6 rounded-3xl overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/5" />
          <div className="absolute inset-0 backdrop-blur-xl" />
          <div className="absolute inset-0 border border-white/10 rounded-3xl" />
          
          <div className="relative flex items-center gap-4">
            <motion.div 
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <User size={36} className="text-white" />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.name || user.email?.split("@")[0]}</h2>
              <p className="text-sm text-zinc-400">{user.email}</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6 mb-6">
          <WeightChart currentWeight={75} targetWeight={70} />
          <StreakCounter userId={user.id || "user"} />
          <AchievementBadge userId={user.id || "user"} />
          <ProgressPhotos userId={user.id || "user"} />
          <BodyMeasurements userId={user.id || "user"} />
        </div>

        <motion.button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </motion.button>
      </div>
    </div>
  );
}
