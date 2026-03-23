"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { Mail, Lock, Eye, EyeOff, User, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const result = await register({ email, password });
      
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/onboarding");
      }
    } catch (err) {
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <motion.div 
        className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      
      <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
        {/* Logo */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <motion.div
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <User size={40} className="text-white" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-3xl bg-purple-500/30 blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Crear cuenta
            </span>
          </h1>
          <p className="text-zinc-400">Regístrate para empezar tu camino</p>
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Email input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              <Mail size={20} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all input-glow text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Password input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className="w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all input-glow text-white placeholder:text-zinc-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
              required
              minLength={6}
              className="w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all input-glow text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Error */}
          {error && (
            <motion.div 
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-red-400 text-sm text-center">{error}</p>
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold text-lg shadow-lg shadow-purple-500/30 disabled:opacity-50 relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">{loading ? "Creando..." : "Crear cuenta"}</span>
          </motion.button>
        </motion.form>

        {/* Login link */}
        <motion.p 
          className="mt-8 text-center text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-purple-400 font-medium hover:text-purple-300 transition-colors">
            Inicia sesión
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
