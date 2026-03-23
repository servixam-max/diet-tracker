"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { calculateBMR, calculateTDEE, calculateDailyCalories, distributeMacros, activityLabels, goalLabels, speedLabels, type Gender, type ActivityLevel, type Goal, type Speed } from "@/lib/nutrition/calculations";
import { ArrowRight, ArrowLeft, Check, Sparkles, Scale, Ruler, Activity, Target, Zap, Utensils, Users, Brain } from "lucide-react";

// Icons as components
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

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
  { id: "Vegetariano", emoji: "🥗", color: "from-green-500" },
  { id: "Vegano", emoji: "🌱", color: "from-emerald-500" },
  { id: "Sin gluten", emoji: "🌾", color: "from-amber-500" },
  { id: "Sin lactosa", emoji: "🥛", color: "from-blue-500" },
  { id: "Sin frutos secos", emoji: "🥜", color: "from-orange-500" },
  { id: "Bajo en sodio", emoji: "🧂", color: "from-cyan-500" },
];

const stepIcons = [
  { icon: Sparkles, color: "from-green-400", label: "Inicio" },
  { icon: UserIcon, color: "from-blue-400", label: "Sobre ti" },
  { icon: Scale, color: "from-purple-400", label: "Medidas" },
  { icon: Activity, color: "from-orange-400", label: "Actividad" },
  { icon: Target, color: "from-red-400", label: "Objetivo" },
  { icon: Zap, color: "from-yellow-400", label: "Velocidad" },
  { icon: Utensils, color: "from-pink-400", label: "Dietas" },
  { icon: Users, color: "from-cyan-400", label: "Comensales" },
  { icon: Brain, color: "from-indigo-400", label: "Resumen" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
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
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const totalSteps = 9;

  useEffect(() => {
    if (!user && step === 1) {
      router.push("/login");
    }
    if (user?.name) {
      setData(prev => ({ ...prev, name: user.name || "" }));
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

  async function handleFinish() {
    setSaving(true);
    setError("");

    try {
      const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
      const tdee = calculateTDEE(bmr, data.activityLevel);
      const dailyCalories = calculateDailyCalories(tdee, data.goal, data.speed);

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
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error al guardar los datos");
    } finally {
      setSaving(false);
    }
  }

  const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
  const tdee = calculateTDEE(bmr, data.activityLevel);
  const dailyCal = calculateDailyCalories(tdee, data.goal, data.speed);
  const macros = distributeMacros(dailyCal, data.goal);

  const CurrentStepIcon = stepIcons[step - 1]?.icon || Sparkles;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      
      <motion.header 
        className="relative px-6 pt-6 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${stepIcons[step - 1]?.color} to-black/30 flex items-center justify-center`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CurrentStepIcon className="text-white" />
            </motion.div>
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Paso {step}</p>
              <p className="font-semibold text-white">{stepIcons[step - 1]?.label}</p>
            </div>
          </div>
          
          {step > 1 && (
            <motion.button
              onClick={prev}
              className="p-2 rounded-xl bg-white/5"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} className="text-zinc-400" />
            </motion.button>
          )}
        </div>

        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepWrapper key="step1" title="¿Cómo te llamas?">
              <motion.input
                type="text"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
                placeholder="Tu nombre"
                className="w-full p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 outline-none focus:border-green-500/50 text-lg text-white placeholder:text-zinc-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              />
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper key="step2" title="Sobre ti">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 block mb-2">Edad</label>
                  <input
                    type="number"
                    value={data.age}
                    onChange={(e) => updateData({ age: Number(e.target.value) })}
                    className="w-full p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 outline-none focus:border-green-500/50 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 block mb-2">Género</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["male", "female"] as Gender[]).map((g) => (
                      <motion.button
                        key={g}
                        onClick={() => updateData({ gender: g })}
                        className={`p-4 rounded-2xl text-lg font-medium transition-all ${
                          data.gender === g 
                            ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30" 
                            : "bg-white/5 border border-white/10 text-zinc-300"
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        {g === "male" ? "Hombre" : "Mujer"}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper key="step3" title="Tus medidas">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 block mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    value={data.weight}
                    onChange={(e) => updateData({ weight: Number(e.target.value) })}
                    className="w-full p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 outline-none focus:border-green-500/50 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 block mb-2">Altura (cm)</label>
                  <input
                    type="number"
                    value={data.height}
                    onChange={(e) => updateData({ height: Number(e.target.value) })}
                    className="w-full p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 outline-none focus:border-green-500/50 text-white"
                  />
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper key="step4" title="Actividad física">
              <div className="space-y-2">
                {(Object.entries(activityLabels) as [ActivityLevel, string][]).map(([key, label], i) => (
                  <motion.button
                    key={key}
                    onClick={() => updateData({ activityLevel: key })}
                    className={`w-full p-4 rounded-2xl text-left transition-all ${
                      data.activityLevel === key 
                        ? "bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/50 text-white" 
                        : "bg-white/5 border border-white/10 text-zinc-300"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 5 && (
            <StepWrapper key="step5" title="Tu objetivo">
              <div className="space-y-2">
                {(Object.entries(goalLabels) as [Goal, string][]).map(([key, label], i) => (
                  <motion.button
                    key={key}
                    onClick={() => updateData({ goal: key })}
                    className={`w-full p-4 rounded-2xl text-left transition-all ${
                      data.goal === key 
                        ? "bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/50 text-white" 
                        : "bg-white/5 border border-white/10 text-zinc-300"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 6 && (
            <StepWrapper key="step6" title="¿Cuánto peso quieres perder/ganar por semana?">
              <div className="space-y-2">
                {(Object.entries(speedLabels) as [Speed, string][]).map(([key, label], i) => (
                  <motion.button
                    key={key}
                    onClick={() => updateData({ speed: key })}
                    className={`w-full p-4 rounded-2xl text-left transition-all ${
                      data.speed === key 
                        ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/50 text-white" 
                        : "bg-white/5 border border-white/10 text-zinc-300"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 7 && (
            <StepWrapper key="step7" title="Preferencias alimentarias">
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
                        ? `bg-gradient-to-br ${opt.color} to-black/30 border border-white/20 text-white` 
                        : "bg-white/5 border border-white/10 text-zinc-300"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl mb-1 block">{opt.emoji}</span>
                    <span className="text-xs font-medium">{opt.id}</span>
                  </motion.button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 8 && (
            <StepWrapper key="step8" title="¿Para cuántos comensales cocinas?">
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((n, i) => (
                  <motion.button
                    key={n}
                    onClick={() => updateData({ servings: n })}
                    className={`p-6 rounded-2xl text-2xl font-bold transition-all ${
                      data.servings === n 
                        ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30" 
                        : "bg-white/5 border border-white/10 text-zinc-300"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {n}{n === 6 ? "+" : ""}
                  </motion.button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 9 && (
            <StepWrapper key="step9" title="Tu plan personalizado">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="p-6 rounded-3xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 text-center">
                  <p className="text-sm text-zinc-400 mb-1">Hola, {data.name || "amigo"}</p>
                  <motion.p 
                    className="text-5xl font-bold gradient-text mb-1"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    {dailyCal.toLocaleString()}
                  </motion.p>
                  <p className="text-sm text-zinc-400">kcal diarias</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Proteínas", value: macros.protein_g, color: "blue" },
                    { label: "Carbos", value: macros.carbs_g, color: "yellow" },
                    { label: "Grasas", value: macros.fat_g, color: "red" },
                  ].map((macro, i) => (
                    <motion.div
                      key={macro.label}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <p className={`text-2xl font-bold text-${macro.color}-400`}>{macro.value}g</p>
                      <p className="text-xs text-zinc-400">{macro.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Peso objetivo</span>
                    <span>{data.weight}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Altura</span>
                    <span>{data.height}cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Objetivo</span>
                    <span>{goalLabels[data.goal]}</span>
                  </div>
                </div>
              </motion.div>
            </StepWrapper>
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-400 text-sm text-center">{error}</p>
          </motion.div>
        )}
      </div>

      <div className="relative px-6 pb-6 pt-4">
        <motion.button
          onClick={step === totalSteps ? handleFinish : next}
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg shadow-lg shadow-green-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? (
            "Guardando..."
          ) : step === totalSteps ? (
            <>
              <Check size={20} />
              <span>Empezar</span>
            </>
          ) : (
            <>
              <span>Continuar</span>
              <ArrowRight size={20} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

function StepWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="py-4"
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </motion.div>
  );
}
