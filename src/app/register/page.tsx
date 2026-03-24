"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Sparkles, Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, Check, X, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);
  const [particlesInit, setParticlesInit] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  // Magnetic button
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 15 };
  const buttonX = useSpring(mouseX, springConfig);
  const buttonY = useSpring(mouseY, springConfig);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesInit(true));
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x * 0.3);
      mouseY.set(y * 0.3);
    }
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  // Password validation
  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const allValid = Object.values(validations).every(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!allValid) {
      setError("La contraseña no cumple los requisitos");
      return;
    }

    if (!agreed) {
      setError("Debes aceptar los términos");
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
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 right-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-1/4 w-56 h-56 bg-pink-500/10 rounded-full blur-[80px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
      />

      {/* Particles */}
      {particlesInit && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Particles
            id="register-particles"
            className="w-full h-full"
            options={{
              background: { color: { value: "transparent" } },
              fpsLimit: 30,
              particles: {
                number: { value: 20 },
                color: { value: "#a855f7" },
                shape: { type: "circle" },
                opacity: { value: { min: 0.1, max: 0.3 }, animation: { enable: true, speed: 0.5 } },
                size: { value: { min: 1, max: 3 } },
                move: { enable: true, speed: 0.3, direction: "none", random: true, straight: false, outModes: "bounce" },
              },
              detectRetina: true,
            }}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative">
            <motion.div
              className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/40"
              initial={{ scale: 0, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              <motion.div
                className="relative z-10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <UserPlus size={44} className="text-white drop-shadow-lg" />
              </motion.div>
            </motion.div>

            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-[2rem] border-2 border-purple-400/50"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h1
            className="text-3xl font-bold mb-3"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Crear cuenta
            </span>
          </motion.h1>
          <motion.p
            className="text-zinc-400"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Únete a miles que ya(transformaron su vida
          </motion.p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Email */}
          <div className="relative">
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10"
              animate={{ scale: isEmailFocused || email ? 0.8 : 1, color: isEmailFocused ? "#a855f7" : "#71717a" }}
            >
              <Mail size={20} />
            </motion.div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              placeholder=" "
              required
              className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all peer placeholder:text-transparent"
            />
            <motion.label
              className="absolute left-12 top-4 text-zinc-500 pointer-events-none transition-all duration-200 peer-focus:-top-2 peer-focus:left-4 peer-focus:text-xs peer-focus:text-purple-400 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zinc-400"
              animate={{ color: isEmailFocused ? "#a855f7" : "#71717a" }}
            >
              tu@email.com
            </motion.label>
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
              animate={{ width: isEmailFocused ? "80%" : 0, opacity: isEmailFocused ? 1 : 0 }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10"
              animate={{ scale: isPasswordFocused || password ? 0.8 : 1, color: isPasswordFocused ? "#a855f7" : "#71717a" }}
            >
              <Lock size={20} />
            </motion.div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              placeholder=" "
              required
              className="w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all peer placeholder:text-transparent"
            />
            <motion.label
              className="absolute left-12 top-4 text-zinc-500 pointer-events-none transition-all duration-200 peer-focus:-top-2 peer-focus:left-4 peer-focus:text-xs peer-focus:text-purple-400 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zinc-400"
            >
              Contraseña
            </motion.label>
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              whileTap={{ scale: 0.9 }}
              animate={{ color: showPassword ? "#a855f7" : "#71717a" }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </motion.button>
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
              animate={{ width: isPasswordFocused ? "80%" : 0, opacity: isPasswordFocused ? 1 : 0 }}
            />
          </div>

          {/* Password requirements */}
          <AnimatePresence>
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 p-3 rounded-xl bg-white/5"
              >
                {[
                  { key: "length", label: "Mínimo 8 caracteres", valid: validations.length },
                  { key: "uppercase", label: "Una mayúscula", valid: validations.uppercase },
                  { key: "number", label: "Un número", valid: validations.number },
                  { key: "special", label: "Un carácter especial", valid: validations.special },
                ].map((req) => (
                  <motion.div
                    key={req.key}
                    className="flex items-center gap-2 text-xs"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: Object.keys(validations).indexOf(req.key) * 0.05 }}
                  >
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      req.valid ? "bg-green-500/20 text-green-400" : "bg-white/10 text-zinc-500"
                    }`}>
                      {req.valid ? <Check size={10} /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>
                    <span className={req.valid ? "text-green-400" : "text-zinc-500"}>{req.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirm Password */}
          <div className="relative">
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 z-10"
              animate={{ 
                scale: isConfirmFocused || confirmPassword ? 0.8 : 1, 
                color: isConfirmFocused ? "#a855f7" : 
                  confirmPassword && password === confirmPassword ? "#22c55e" : 
                  confirmPassword ? "#ef4444" : "#71717a"
              }}
            >
              <Lock size={20} />
            </motion.div>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setIsConfirmFocused(true)}
              onBlur={() => setIsConfirmFocused(false)}
              placeholder=" "
              required
              className="w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border outline-none transition-all peer placeholder:text-transparent"
              style={{
                borderColor: confirmPassword && password !== confirmPassword ? "rgba(239, 68, 68, 0.5)" : "rgba(255, 255, 255, 0.1)",
                borderWidth: "1px"
              }}
            />
            <motion.label
              className="absolute left-12 top-4 text-zinc-500 pointer-events-none transition-all duration-200 peer-focus:-top-2 peer-focus:left-4 peer-focus:text-xs peer-focus:text-purple-400 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zinc-400"
            >
              Confirmar contraseña
            </motion.label>
            {confirmPassword && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                {password === confirmPassword ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <X size={18} className="text-red-400" />
                )}
              </div>
            )}
            <motion.button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </motion.button>
          </div>

          {/* Terms checkbox */}
          <motion.div
            className="flex items-start gap-3 p-3 rounded-xl bg-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                agreed ? "bg-purple-500 border-purple-500" : "border-zinc-600"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {agreed && <Check size={14} className="text-white" />}
            </motion.button>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Acepto los{" "}
              <button type="button" className="text-purple-400 hover:underline">Términos de servicio</button>
              {" "}y la{" "}
              <button type="button" className="text-purple-400 hover:underline">Política de privacidad</button>
            </p>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, x: [0, -5, 5, -5, 5, 0] }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30"
              >
                <p className="text-red-400 text-sm text-center">⚠️ {error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            ref={buttonRef}
            type="submit"
            disabled={loading || !agreed}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: buttonX, y: buttonY }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 disabled:opacity-50 relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Loader2 size={20} />
                  </motion.div>
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <span>Crear cuenta</span>
                  <motion.div initial={{ x: 0 }} whileHover={{ x: 5 }}>
                    <ArrowRight size={20} />
                  </motion.div>
                </>
              )}
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </motion.form>

        {/* Login link */}
        <motion.p
          className="mt-8 text-center text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-purple-400 font-medium hover:text-purple-300 transition-colors relative group">
            Inicia sesión
            <motion.span
              className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-purple-400"
              whileHover={{ width: "100%" }}
            />
          </Link>
        </motion.p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </div>
  );
}
