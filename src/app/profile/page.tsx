"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { User, Target, Award, Settings, ChevronRight, Shield, TrendingUp, Camera, Trophy, Zap } from "lucide-react";
import { WeightChart } from "@/components/WeightChart";
import { BodyMeasurements } from "@/components/BodyMeasurements";
import { ProgressPhotos } from "@/components/ProgressPhotos";
import { AchievementBadge } from "@/components/AchievementBadge";

// Lazy load heavy components
import dynamic from "next/dynamic";

function getIsDemo(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("demo-mode") === "true";
}

// Loading fallback
function ComponentLoader() {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 animate-pulse">
      <div className="h-20 bg-white/10 rounded-xl" />
    </div>
  );
}

export default function ProfilePage() {
  const [isDemo, setIsDemo] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  // Initialize client-side only
  useEffect(() => {
    setIsClient(true);
    setIsDemo(getIsDemo());
  }, []);

  // Redirect if not logged in and not demo
  useEffect(() => {
    if (isClient && !loading && !user && !isDemo) {
      router.push("/login");
    }
  }, [isClient, loading, user, isDemo, router]);

  async function handleLogout() {
    try {
      await logout();
      localStorage.removeItem("demo-mode");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  function goToLogin() {
    localStorage.removeItem("demo-mode");
    router.push("/login");
  }

  function goToRegister() {
    router.push("/register");
  }

  // Show loading state
  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-4 border-white/20 border-t-green-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-32">
      {/* Header */}
      <div className="px-5 pt-8 pb-6">
        <h1 className="text-2xl font-bold">Perfil</h1>
        {isDemo && (
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
            Modo Demo
          </span>
        )}
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
              <h2 className="text-lg font-bold">
                {user?.email ? user.email.split('@')[0] : "Usuario Demo"}
              </h2>
              <p className="text-sm text-zinc-400">
                {user?.email || "demo@ejemplo.com"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Demo Notice */}
        {isDemo && (
          <motion.div 
            className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-400">Modo demostración</p>
                <p className="text-sm text-zinc-400">
                  Los datos son ejemplos. Inicia sesión para guardar progreso real.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
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

        {/* Components with Suspense */}
        <Suspense fallback={<ComponentLoader />}>
          <WeightChart currentWeight={75} targetWeight={70} />
        </Suspense>

        <Suspense fallback={<ComponentLoader />}>
          <BodyMeasurements userId={user?.id || 'demo'} />
        </Suspense>

        <Suspense fallback={<ComponentLoader />}>
          <ProgressPhotos userId={user?.id || 'demo'} />
        </Suspense>

        <Suspense fallback={<ComponentLoader />}>
          <AchievementBadge userId={user?.id || 'demo'} />
        </Suspense>

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
            <button 
              onClick={() => router.push('/settings')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <span className="text-zinc-400 text-sm">Ajustes avanzados</span>
              <ChevronRight size={16} className="text-zinc-600" />
            </button>
          </div>
        </motion.div>

        {/* Demo Mode Actions */}
        {isDemo && (
          <motion.div
            className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <User size={20} className="text-green-400" />
              <h3 className="font-semibold">Cuenta</h3>
            </div>
            
            <p className="text-sm text-zinc-400">
              Estás en modo demo. Los datos no se guardan permanentemente.
            </p>
            
            <button 
              onClick={goToLogin}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg shadow-green-500/25 active:scale-95 transition-transform"
            >
              <User size={20} />
              <span>Iniciar sesión real</span>
            </button>
            
            <button 
              onClick={goToRegister}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/10 border border-white/20 text-white font-medium active:scale-95 transition-transform"
            >
              <span>Crear cuenta nueva</span>
            </button>
          </motion.div>
        )}

        {/* Logout button for logged in users */}
        {!isDemo && user && (
          <motion.button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 font-medium active:scale-95 transition-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span>Cerrar sesión</span>
          </motion.button>
        )}

        {/* Extra space for BottomNavBar */}
        <div className="h-20" />
      </div>
    </div>
  );
}
