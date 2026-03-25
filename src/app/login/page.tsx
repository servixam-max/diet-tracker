"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { showToast, triggerHaptic } from "@/components/ui/Feedback";
import { Mail, Lock, User, ArrowRight, Sparkles, Leaf, Zap } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, register } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    triggerHaptic("medium");

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.error) {
          setError(result.error);
          showToast(result.error, "error");
          triggerHaptic("heavy");
          setLoading(false);
          return;
        }
        showToast("¡Bienvenido de vuelta!", "success");
      } else {
        const result = await register({ email, password, name });
        if (result.error) {
          setError(result.error);
          showToast(result.error, "error");
          triggerHaptic("heavy");
          setLoading(false);
          return;
        }
        showToast("¡Cuenta creada exitosamente!", "success");
      }
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(message);
      showToast(message, "error");
      triggerHaptic("heavy");
    } finally {
      setLoading(false);
    }
  }

  function handleDemo() {
    triggerHaptic("medium");
    localStorage.setItem("demo-mode", "true");
    localStorage.setItem("demo-user", JSON.stringify({
      id: "demo-user",
      email: "demo@diettracker.app",
      name: "Usuario Demo"
    }));
    showToast("Modo demo activado", "info");
    router.push("/dashboard");
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              background: `radial-gradient(circle, rgba(34, 197, 94, ${0.05 - i * 0.01}) 0%, transparent 70%)`,
              filter: "blur(60px)",
              left: `${-10 + i * 40}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -30, 50, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo with enhanced animation */}
        <motion.div variants={itemVariants} className="relative">
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 blur-2xl opacity-50"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-5xl shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Leaf className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold mt-8 mb-2 gradient-text"
        >
          Diet Tracker
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-zinc-400 mb-10 text-center text-lg"
        >
          Tu asistente de nutrición personal
        </motion.p>

        {/* Demo Button - Enhanced */}
        <motion.button
          variants={itemVariants}
          onClick={handleDemo}
          className="w-full max-w-sm mb-8 py-4 px-6 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white font-bold text-lg shadow-lg shadow-green-500/30 flex items-center justify-center gap-3 relative overflow-hidden group"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          <Sparkles size={22} className="relative z-10" />
          <span className="relative z-10">Probar versión demo</span>
        </motion.button>

        <motion.div variants={itemVariants} className="flex items-center gap-4 w-full max-w-sm mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="text-zinc-500 text-sm">o continúa con email</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>

        {/* Form with GlassCard */}
        <GlassCard className="w-full max-w-sm p-6" spotlight={true}>
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "register"}
              onSubmit={handleSubmit}
              className="space-y-5"
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {!isLogin && (
                <motion.div 
                  className="relative group"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-400 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-500/50 focus:bg-white/10 text-white placeholder:text-zinc-500 transition-all duration-300 input-glow"
                    required={!isLogin}
                  />
                </motion.div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-400 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-500/50 focus:bg-white/10 text-white placeholder:text-zinc-500 transition-all duration-300 input-glow"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-400 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-500/50 focus:bg-white/10 text-white placeholder:text-zinc-500 transition-all duration-300 input-glow"
                  required
                  minLength={6}
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    className="text-red-400 text-sm text-center bg-red-500/10 py-2 px-4 rounded-xl border border-red-500/20"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 font-bold text-lg flex items-center justify-center gap-2 hover:from-white/20 hover:to-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap size={22} className="text-green-400" />
                  </motion.div>
                ) : (
                  <>
                    <span className="relative z-10">{isLogin ? "Iniciar sesión" : "Crear cuenta"}</span>
                    <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </GlassCard>

        {/* Toggle */}
        <motion.button
          variants={itemVariants}
          onClick={() => {
            triggerHaptic("light");
            setIsLogin(!isLogin);
          }}
          className="mt-8 text-sm text-zinc-400 hover:text-white transition-colors relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative">
            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <span className="text-green-400 font-medium group-hover:underline">
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </span>
          </span>
        </motion.button>
      </motion.div>

      {/* Footer */}
      <motion.p
        className="text-center text-zinc-600 text-xs py-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Al continuar, aceptas nuestros términos de uso
      </motion.p>
    </div>
  );
}
