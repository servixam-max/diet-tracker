"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { User, LogOut, Moon, Bell, Scale, Ruler, Target, Settings, ChevronRight, Award } from "lucide-react";

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      setProfile(user);
    }
  }, [user, loading, router]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      
      <div className="relative flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
        {/* Header */}
        <motion.header 
          className="pt-8 pb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold">Perfil</h1>
        </motion.header>

        {/* Profile card */}
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
              <h2 className="text-xl font-bold">{profile?.name || user.email?.split("@")[0]}</h2>
              <p className="text-sm text-zinc-400">{user.email}</p>
            </div>
            <motion.button
              className="p-3 rounded-xl bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={20} className="text-zinc-400" />
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        {profile?.daily_calories && (
          <motion.div 
            className="grid grid-cols-2 gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-4 rounded-2xl glass-card">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-green-400" />
                <span className="text-xs text-zinc-400">Calorías objetivo</span>
              </div>
              <p className="text-2xl font-bold gradient-text">{profile.daily_calories.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-2xl glass-card">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} className="text-yellow-400" />
                <span className="text-xs text-zinc-400">Nivel</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">Principiante</p>
            </div>
          </motion.div>
        )}

        {/* Measurements */}
        <motion.div 
          className="space-y-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Medidas</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 rounded-2xl glass-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Scale size={20} className="text-blue-400" />
                </div>
                <span className="font-medium">Peso</span>
              </div>
              <span className="text-zinc-400">{profile?.weight_kg || "—"} kg</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl glass-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Ruler size={20} className="text-purple-400" />
                </div>
                <span className="font-medium">Altura</span>
              </div>
              <span className="text-zinc-400">{profile?.height_cm || "—"} cm</span>
            </div>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div 
          className="space-y-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Ajustes</h3>
          
          <button className="w-full flex items-center justify-between p-4 rounded-2xl glass-card">
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-zinc-400" />
              <span className="font-medium">Modo oscuro</span>
            </div>
            <div 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${darkMode ? "bg-green-500" : "bg-zinc-600"}`}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white shadow-md"
                animate={{ x: darkMode ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 rounded-2xl glass-card">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-zinc-400" />
              <span className="font-medium">Notificaciones</span>
            </div>
            <ChevronRight size={20} className="text-zinc-600" />
          </button>
        </motion.div>

        {/* Logout */}
        <motion.button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </motion.button>
      </div>
    </div>
  );
}
