"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { OnboardingComplete } from "@/components/OnboardingComplete";
import { calculateBMR, calculateTDEE, calculateDailyCalories, distributeMacros, activityLabels, goalLabels, goalDescriptions, activityDescriptions, speedLabels, type Gender, type ActivityLevel, type Goal, type Speed } from "@/lib/nutrition/calculations";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { ArrowRight, Check, Sparkles, Scale, Ruler, Activity, Target, Zap, Utensils, Users, Brain, Heart } from "lucide-react";
import { validateField, validators } from "@/lib/validation";

interface OnboardingData {
  name: string;
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  speed: Speed;
  restrictions: string[];
  servings: number;
}

const restrictionOptions = [
  { id: "Vegetariano", emoji: "🥗", color: "green" },
  { id: "Vegano", emoji: "🌱", color: "emerald" },
  { id: "Sin gluten", emoji: "🌾", color: "amber" },
  { id: "Sin lactosa", emoji: "🥛", color: "blue" },
  { id: "Sin frutos secos", emoji: "🥜", color: "orange" },
  { id: "Bajo en sodio", emoji: "🧂", color: "cyan" },
];

const stepConfig = [
  { icon: Sparkles, color: "green", gradient: "from-green-400 to-emerald-500", label: "Bienvenida", required: true },
  { icon: Sparkles, color: "blue", gradient: "from-blue-400 to-cyan-500", label: "Sobre ti", required: true },
  { icon: Scale, color: "purple", gradient: "from-purple-400 to-pink-500", label: "Medidas", required: true },
  { icon: Activity, color: "orange", gradient: "from-orange-400 to-red-500", label: "Actividad", required: true },
  { icon: Target, color: "red", gradient: "from-red-400 to-rose-500", label: "Objetivo", required: true },
  { icon: Zap, color: "yellow", gradient: "from-yellow-400 to-amber-500", label: "Intensidad", required: true },
  { icon: Utensils, color: "pink", gradient: "from-pink-400 to-rose-500", label: "Dietas", required: false },
  { icon: Users, color: "cyan", gradient: "from-cyan-400 to-teal-500", label: "Comensales", required: true },
  { icon: Brain, color: "indigo", gradient: "from-indigo-400 to-violet-500", label: "Tu plan", required: true },
];

const stepLabels = stepConfig.map(s => s.label);

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [particlesInit, setParticlesInit] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    age: 30,
    gender: "male",
    weight: 75,
    height: 175,
    activityLevel: "moderately_active",
    goal: "lose",
    speed: "medium",
    restrictions: [],
    servings: 1,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const totalSteps = 9;

  // Calculate live preview
  const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
  const tdee = calculateTDEE(bmr, data.activityLevel);
  const dailyCalories = calculateDailyCalories(tdee, data.goal, data.speed);
  const macros = distributeMacros(dailyCalories, data.goal, data.weight);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesInit(true));
  }, []);

  useEffect(() => {
    if (!user && step === 1) {
      router.push("/login");
    }
    if (user) {
      setData(prev => ({
        ...prev,
        name: user.name || prev.name,
        age: user.age || prev.age,
        gender: (user.gender || prev.gender) as Gender,
        weight_kg: user.weight_kg || prev.weight,
        height_cm: user.height_cm || prev.height,
        activityLevel: (user.activity_level || prev.activityLevel) as ActivityLevel,
        goal: (user.goal || prev.goal) as Goal,
        speed: (user.speed || prev.speed) as Speed,
        restrictions: user.dietary_restrictions || prev.restrictions,
      }));
    }
  }, [user, step, router]);

  function updateData(updates: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...updates }));
  }

  function next() {
    if (step < totalSteps) setStep(step + 1);
  }

  function prev() {
    if (step > 1) setStep(step - 1);
  }

  function handleSkip() {
    // Skip optional steps (step 7 - dietary restrictions)
    if (step === 7) {
      next();
    }
  }

  async function handleFinish() {
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          age: data.age,
          gender: data.gender,
          weight_kg: data.weight,
          height_cm: data.height,
          activity_level: data.activityLevel,
          goal: data.goal,
          speed: data.speed,
          daily_calories: dailyCalories,
          preferred_meals: 4,
          dietary_restrictions: data.restrictions,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al guardar");
      }

      await refreshUser();
      setCompleted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al guardar";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  function handleStartTracking() {
    router.push("/dashboard");
  }

  // Validation functions
  function validateStep(): boolean {
    switch (step) {
      case 2: // Name, age, gender
        return data.name.length > 0 && data.age >= 15 && data.age <= 80;
      case 3: // Weight, height
        return data.weight >= 40 && data.weight <= 200 && data.height >= 140 && data.height <= 220;
      case 4: // Activity level
        return !!data.activityLevel;
      case 5: // Goal
        return !!data.goal;
      case 6: // Speed
        return !!data.speed;
      case 8: // Servings
        return data.servings >= 1 && data.servings <= 6;
      default:
        return true;
    }
  }

  const canProceed = validateStep();

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Dynamic background gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Particles */}
      {particlesInit && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Particles
            id="onboarding-particles"
            className="w-full h-full"
            options={{
              background: { color: { value: "transparent" } },
              fpsLimit: 30,
              particles: {
                number: { value: 30 },
                color: { value: "#22c55e" },
                shape: { type: "circle" },
                opacity: { value: { min: 0.1, max: 0.4 }, animation: { enable: true, speed: 0.5 } },
                size: { value: { min: 1, max: 4 } },
                links: { enable: true, distance: 120, color: "#22c55e", opacity: 0.1 },
                move: { enable: true, speed: 0.3, direction: "none", random: true, outModes: "bounce" },
              },
              detectRetina: true,
            }}
          />
        </div>
      )}

      {/* Header with OnboardingProgress component */}
      <motion.header className="relative px-5 pt-6 pb-4 z-10">
        <OnboardingProgress
          currentStep={step}
          totalSteps={totalSteps}
          stepLabels={stepLabels}
          onBack={prev}
          canGoBack={step > 1}
        />
      </motion.header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="py-4"
          >
            {/* Step 1: Welcome */}
            {step === 1 && (
              <div className="space-y-6 text-center">
                <motion.div
                  className="relative mx-auto w-32 h-32"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 opacity-30 blur-2xl animate-pulse" />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
                    <Sparkles size={60} className="text-white" />
                  </div>
                </motion.div>

                <div>
                  <motion.h2 className="text-3xl font-bold mb-3" initial={{ y: 20 }} animate={{ y: 0 }}>
                    <span className="gradient-text">¡Hola!</span>
                  </motion.h2>
                  <motion.p className="text-zinc-400 max-w-xs mx-auto" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.1 }}>
                    Vamos a crear tu plan nutricional personalizado en unos simples pasos
                  </motion.p>
                </div>
              </div>
            )}

            {/* Step 2: Name & Age & Gender */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-zinc-400 block mb-2">¿Cómo te llamas?</label>
                  <motion.input
                    type="text"
                    value={data.name}
                    onChange={(e) => {
                      const result = validateField(e.target.value, validators.email);
                      if (result.isValid || e.target.value === '') {
                        updateData({ name: e.target.value });
                      }
                    }}
                    placeholder="Tu nombre"
                    className="w-full p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 outline-none focus:border-green-500/50 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    aria-label="Nombre"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-zinc-400 block mb-2">¿Cuántos años tienes?</label>
                  <div className="flex items-center gap-4">
                    <motion.input
                      type="range"
                      min={15}
                      max={80}
                      value={data.age}
                      onChange={(e) => {
                        const result = validateField(Number(e.target.value), validators.age);
                        if (result.isValid) {
                          updateData({ age: Number(e.target.value) });
                        }
                      }}
                      className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-400 [&::-webkit-slider-thumb]:to-emerald-500"
                      aria-label="Edad"
                    />
                    <motion.span className="text-3xl font-bold gradient-text w-16 text-center" key={data.age} initial={{ scale: 1.3 }} animate={{ scale: 1 }} aria-live="polite">
                      {data.age}
                    </motion.span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-zinc-400 block mb-3">¿Cuál es tu género?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { value: "male", label: "Hombre", icon: "👨", color: "blue" },
                      { value: "female", label: "Mujer", icon: "👩", color: "pink" },
                    ] as const).map((opt) => (
                      <motion.button
                        key={opt.value}
                        onClick={() => updateData({ gender: opt.value })}
                        className={`p-4 rounded-2xl text-center transition-all ${
                          data.gender === opt.value
                            ? `bg-gradient-to-br from-${opt.color}-500/20 to-${opt.color}-600/10 border border-${opt.color}-500/50`
                            : "bg-white/5 border border-white/10"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-3xl mb-2 block">{opt.icon}</span>
                        <span className={`font-medium ${data.gender === opt.value ? `text-${opt.color}-400` : "text-zinc-300"}`}>
                          {opt.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Weight & Height */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-zinc-400 block mb-2">
                    <span className="flex items-center gap-2">
                      <Scale size={14} className="text-purple-400" />
                      Peso actual (kg)
                    </span>
                  </label>
                  <div className="flex items-center gap-4">
                    <motion.input
                      type="range"
                      min={40}
                      max={200}
                      value={data.weight}
                      onChange={(e) => {
                        const result = validateField(Number(e.target.value), validators.weight);
                        if (result.isValid) {
                          updateData({ weight: Number(e.target.value) });
                        }
                      }}
                      className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-400 [&::-webkit-slider-thumb]:to-pink-500"
                      aria-label="Peso en kilogramos"
                    />
                    <motion.span className="text-3xl font-bold text-purple-400 w-20 text-center" key={data.weight} initial={{ scale: 1.3 }} animate={{ scale: 1 }} aria-live="polite">
                      {data.weight}
                    </motion.span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-zinc-400 block mb-2">
                    <span className="flex items-center gap-2">
                      <Ruler size={14} className="text-blue-400" />
                      Altura (cm)
                    </span>
                  </label>
                  <div className="flex items-center gap-4">
                    <motion.input
                      type="range"
                      min={140}
                      max={220}
                      value={data.height}
                      onChange={(e) => {
                        const result = validateField(Number(e.target.value), validators.height);
                        if (result.isValid) {
                          updateData({ height: Number(e.target.value) });
                        }
                      }}
                      className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-400 [&::-webkit-slider-thumb]:to-cyan-500"
                      aria-label="Altura en centímetros"
                    />
                    <motion.span className="text-3xl font-bold text-blue-400 w-20 text-center" key={data.height} initial={{ scale: 1.3 }} animate={{ scale: 1 }} aria-live="polite">
                      {data.height}
                    </motion.span>
                  </div>
                </div>

                {/* Live BMI */}
                <motion.div className="p-4 rounded-2xl glass-card text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-xs text-zinc-400 mb-1">Tu IMC estimado</p>
                  <p className="text-2xl font-bold">
                    {(data.weight / Math.pow(data.height / 100, 2)).toFixed(1)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {(() => {
                      const bmi = data.weight / Math.pow(data.height / 100, 2);
                      if (bmi < 18.5) return "Bajo peso";
                      if (bmi < 25) return "Normal";
                      if (bmi < 30) return "Sobrepeso";
                      return "Obesidad";
                    })()}
                  </p>
                </motion.div>
              </div>
            )}

            {/* Step 4: Activity Level */}
            {step === 4 && (
              <div className="space-y-3">
                <p className="text-sm text-zinc-400 mb-4">¿Cuánto ejercicio haces?</p>
                {(Object.entries(activityLabels) as [ActivityLevel, string][]).map(([key, label], i) => (
                  <motion.button
                    key={key}
                    onClick={() => updateData({ activityLevel: key })}
                    className={`w-full p-4 rounded-2xl text-left transition-all ${
                      data.activityLevel === key
                        ? "bg-gradient-to-r from-orange-500/20 to-red-500/10 border border-orange-500/50"
                        : "bg-white/5 border border-white/10"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.01, x: 5 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${data.activityLevel === key ? "text-orange-400" : ""}`}>{label}</p>
                        <p className="text-xs text-zinc-500 mt-1">{activityDescriptions[key]}</p>
                      </div>
                      {data.activityLevel === key && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Step 5: Goal */}
            {step === 5 && (
              <div className="space-y-3">
                <p className="text-sm text-zinc-400 mb-4">¿Cuál es tu objetivo?</p>
                {(Object.entries(goalLabels) as [Goal, string][]).map(([key, label], i) => (
                  <motion.button
                    key={key}
                    onClick={() => updateData({ goal: key })}
                    className={`w-full p-5 rounded-2xl text-left transition-all ${
                      data.goal === key
                        ? "bg-gradient-to-r from-red-500/20 to-rose-500/10 border border-red-500/50"
                        : "bg-white/5 border border-white/10"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl ${{ lose: "🔥", maintain: "⚖️", gain: "💪" }[key]}`} />
                      <div className="flex-1">
                        <p className={`font-semibold text-lg ${data.goal === key ? "text-red-400" : ""}`}>{label}</p>
                        <p className="text-xs text-zinc-500">{goalDescriptions[key]}</p>
                      </div>
                      {data.goal === key && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Step 6: Speed */}
            {step === 6 && (
              <div className="space-y-3">
                <p className="text-sm text-zinc-400 mb-4">¿Cuánto peso quieres cambiar por semana?</p>
                {(Object.entries(speedLabels) as [Speed, string][]).map(([key, label], i) => (
                  <motion.button
                    key={key}
                    onClick={() => updateData({ speed: key })}
                    className={`w-full p-4 rounded-2xl text-left transition-all ${
                      data.speed === key
                        ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-500/50"
                        : "bg-white/5 border border-white/10"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          key === "slow" ? "bg-blue-400" : key === "medium" ? "bg-yellow-400" : "bg-red-400"
                        }`} />
                        <div>
                          <p className={`font-medium ${data.speed === key ? "text-yellow-400" : ""}`}>{label}</p>
                          <p className="text-xs text-zinc-500">{speedLabels[key]}</p>
                        </div>
                      </div>
                      {data.speed === key && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                          <Check size={14} className="text-black" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Step 7: Dietary Restrictions (Optional - can skip) */}
            {step === 7 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-zinc-400">¿Tienes alguna restricción alimentaria?</p>
                  <motion.button
                    onClick={handleSkip}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Saltar (opcional)
                  </motion.button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {restrictionOptions.map((opt, i) => (
                    <motion.button
                      key={opt.id}
                      onClick={() => {
                        const current = data.restrictions;
                        if (current.includes(opt.id)) {
                          updateData({ restrictions: current.filter((r) => r !== opt.id) });
                        } else {
                          updateData({ restrictions: [...current, opt.id] });
                        }
                      }}
                      className={`p-4 rounded-2xl text-center transition-all ${
                        data.restrictions.includes(opt.id)
                          ? `bg-gradient-to-br from-${opt.color}-500/20 to-${opt.color}-600/10 border border-${opt.color}-500/50`
                          : "bg-white/5 border border-white/10"
                      }`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-3xl mb-2 block">{opt.emoji}</span>
                      <span className={`text-xs font-medium ${data.restrictions.includes(opt.id) ? `text-${opt.color}-400` : "text-zinc-300"}`}>
                        {opt.id}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 8: Servings */}
            {step === 8 && (
              <div className="space-y-6">
                <p className="text-sm text-zinc-400 mb-4 text-center">¿Para cuántos comensales cocinas?</p>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((n, i) => (
                    <motion.button
                      key={n}
                      onClick={() => updateData({ servings: n })}
                      className={`aspect-square rounded-3xl flex flex-col items-center justify-center transition-all ${
                        data.servings === n
                          ? "bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30 scale-105"
                          : "bg-white/5 border border-white/10"
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-4xl font-bold">{n}</span>
                      <span className={`text-xs ${data.servings === n ? "text-white/80" : "text-zinc-500"}`}>
                        {n === 6 ? "+ personas" : n === 1 ? "persona" : "personas"}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 9: Summary with Live Preview */}
            {step === 9 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <motion.h2 className="text-2xl font-bold" initial={{ y: 20 }} animate={{ y: 0 }}>
                    ¡Hola, <span className="gradient-text">{data.name || "amigo"}</span>!
                  </motion.h2>
                </div>

                {/* Main calorie card with real-time preview */}
                <motion.div
                  className="relative p-6 rounded-3xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/10" />
                  <div className="absolute inset-0 border border-green-500/30 rounded-3xl" />
                  
                  <div className="relative text-center">
                    <p className="text-sm text-zinc-400 mb-1">Calorías diarias objetivo</p>
                    <motion.p
                      className="text-6xl font-bold gradient-text"
                      key={dailyCalories}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {dailyCalories}
                    </motion.p>
                    <p className="text-zinc-400 mt-1">kcal / día</p>

                    {/* Macros preview */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      {[
                        { label: "Proteínas", value: macros.protein_g, color: "blue", icon: Activity },
                        { label: "Carbos", value: macros.carbs_g, color: "yellow", icon: Zap },
                        { label: "Grasas", value: macros.fat_g, color: "red", icon: Heart },
                      ].map((macro, i) => (
                        <motion.div
                          key={macro.label}
                          className="p-3 rounded-2xl glass-card text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                        >
                          <macro.icon size={14} className={`text-${macro.color}-400 mx-auto mb-1`} />
                          <p className={`text-xl font-bold text-${macro.color}-400`}>{macro.value}g</p>
                          <p className="text-xs text-zinc-400">{macro.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Summary details */}
                <motion.div
                  className="p-4 rounded-2xl glass-card space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {[
                    { label: "Peso", value: `${data.weight} kg` },
                    { label: "Altura", value: `${data.height} cm` },
                    { label: "Objetivo", value: goalLabels[data.goal] },
                    { label: "Comensales", value: `${data.servings} persona${data.servings > 1 ? "s" : ""}` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">{item.label}</span>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30"
          >
            <p className="text-red-400 text-sm text-center">⚠️ {error}</p>
          </motion.div>
        )}
      </div>

      {/* Footer with animated button */}
      <div className="relative px-5 pb-6 pt-4 z-10">
        {completed ? (
          <OnboardingComplete
            userName={data.name}
            dailyCalories={dailyCalories}
            onStartTracking={handleStartTracking}
          />
        ) : (
          <>
            <motion.button
              onClick={step === totalSteps ? handleFinish : next}
              disabled={!canProceed || saving}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 relative overflow-hidden ${
                canProceed && !saving
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30"
                  : "bg-white/10 cursor-not-allowed"
              }`}
              whileHover={canProceed && !saving ? { scale: 1.02 } : {}}
              whileTap={canProceed && !saving ? { scale: 0.98 } : {}}
            >
              <span className="relative z-10 flex items-center gap-2">
                {saving ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Sparkles size={20} />
                    </motion.div>
                    <span>Guardando...</span>
                  </>
                ) : step === totalSteps ? (
                  <>
                    <span>¡Empezar!</span>
                    <Check size={20} />
                  </>
                ) : (
                  <>
                    <span>Continuar</span>
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <ArrowRight size={20} />
                    </motion.div>
                  </>
                )}
              </span>
            </motion.button>

            {/* Skip option for optional steps */}
            {!stepConfig[step - 1]?.required && step < totalSteps && (
              <motion.button
                onClick={handleSkip}
                className="w-full mt-3 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Saltar este paso
              </motion.button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
