"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { User, Target, Award, Settings, ChevronRight, Shield, TrendingUp, Camera, Ruler, Trophy, Zap } from "lucide-react";
import { WeightChart } from "@/components/WeightChart";
import { BodyMeasurements } from "@/components/BodyMeasurements";
import { ProgressPhotos } from "@/components/ProgressPhotos";
import { StreakCounter } from "@/components/StreakCounter";
import { AchievementBadge } from "@/components/AchievementBadge";

function getIsDemo(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("demo-mode") === "true";
}

export default function ProfilePage() {
  const [isDemo] = useState(() => getIsDemo());
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  // Initialize ready state
  useEffect(() => {
    // Delay to avoid hydration mismatch
    const timeout = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isReady && !loading && !user && !isDemo) {
      router.push("/login");
    }
  }, [user, loading, router, isDemo, isReady]);

  async function handleLogout() {
    await logout();
    localStorage.removeItem("demo-mode");
    router.push("/login");
  }

  if (!isReady || loading) {
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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-24">
      <div className="px-5 pt-8 pb-6">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
          Modo Demo
        </span>
      </div>

      <div className="px-5 space-y-6">
        {/* User Card */}
        <motion.div 
          className="p-6 rounded-3xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Usuario Demo</h2>
              <p className="text-sm text-zinc-400">demo@ejemplo.com</p>
            </div>
          </div>
        </motion.div>

        {/* Demo Notice */}
        <motion.div 
          className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-yellow-400 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-400">Modo demostración</p>
              <p className="text-sm text-zinc-400">
                Los datos son ejemplos. Inicia sesión para guardar progreso real.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-green-400" />
              <span className="text-xs text-zinc-400">Calorías</span>
            </div>
            <p className="text-2xl font-bold">2,000</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Award size={16} className="text-yellow-400" />
              <span className="text-xs text-zinc-400">Nivel</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">Demo</p>
          </div>
        </motion.div>

        {/* Progress Stats */}
        <motion.div
          className="grid grid-cols-4 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 text-center">
            <TrendingUp size={18} className="mx-auto mb-1 text-blue-400" />
            <p className="text-lg font-bold">-5</p>
            <p className="text-xs text-zinc-500">kg</p>
          </div>
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-600/5 border border-purple-500/20 text-center">
            <Camera size={18} className="mx-auto mb-1 text-purple-400" />
            <p className="text-lg font-bold">3</p>
            <p className="text-xs text-zinc-500">fotos</p>
          </div>
          <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-600/5 border border-orange-500/20 text-center">
            <Trophy size={18} className="mx-auto mb-1 text-orange-400" />
            <p className="text-lg font-bold">7</p>
            <p className="text-xs text-zinc-500">logros</p>
          </div>
          <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-600/5 border border-green-500/20 text-center">
            <Zap size={18} className="mx-auto mb-1 text-green-400" />
            <p className="text-lg font-bold">12</p>
            <p className="text-xs text-zinc-500">días</p>
          </div>
        </motion.div>

        {/* Weight Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <WeightChart currentWeight={75} targetWeight={70} />
        </motion.div>

        {/* Body Measurements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <BodyMeasurements userId={user?.id || 'demo'} />
        </motion.div>

        {/* Progress Photos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ProgressPhotos userId={user?.id || 'demo'} />
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <AchievementBadge userId={user?.id || 'demo'} />
        </motion.div>

        {/* Settings */}
        <motion.div
          className="p-4 rounded-2xl bg-white/5 border border-white/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Settings size={20} className="text-zinc-400" />
            <h3 className="font-semibold">Configuración</h3>
          </div>
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
              <span className="text-zinc-400 text-sm">Notificaciones</span>
              <ChevronRight size={16} className="text-zinc-600" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
              <span className="text-zinc-400 text-sm">Unidades</span>
              <ChevronRight size={16} className="text-zinc-600" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
              <span className="text-zinc-400 text-sm">Exportar datos</span>
              <ChevronRight size={16} className="text-zinc-600" />
            </button>
          </div>
        </motion.div>

        {/* Login Button */}
        <motion.button 
          onClick={() => router.push("/login")}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-400 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <User size={20} />
          <span>Iniciar sesión para guardar progreso</span>
        </motion.button>
      </div>
    </div>
  );
}
