"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedStatCard } from "@/components/AnimatedStats";
import { WaterTracker } from "@/components/WaterTracker";
import { CalorieRing } from "@/components/CalorieRing";
import { StreakCounter } from "@/components/StreakCounter";
import { DailyTips } from "@/components/DailyTips";
import { showToast } from "@/components/ui/Feedback";
import { useHaptic } from "@/hooks/useHaptic";
import { RefreshCw, Flame, Activity, Zap, ChevronRight, Target, ArrowDown } from "lucide-react";

// Dynamic imports for heavy components
const MealCard = dynamic(() => import("@/components/MealCard").then(mod => mod.MealCard), {
  loading: () => <div className="h-32 rounded-3xl bg-white/5 animate-pulse" />
});

interface Meal {
  type: "Desayuno" | "Almuerzo" | "Merienda" | "Cena";
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time?: string;
  emoji: string;
}

const mealEmojis: Record<string, string> = {
  "breakfast": "🌅",
  "lunch": "☀️",
  "snack": "🍂",
  "dinner": "🌙"
};

const mealLabels: Record<string, string> = {
  "breakfast": "Desayuno",
  "lunch": "Almuerzo",
  "snack": "Merienda",
  "dinner": "Cena"
};

function useAnimatedCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const startValue = 0;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * (target - startValue) + startValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration]);
  
  return count;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [pullY, setPullY] = useState(0);
  const [pulling, setPulling] = useState(false);
  const controls = useAnimation();
  const { light, medium } = useHaptic();
  
  // Memoized totals calculation
  const totalCalories = useMemo(() => meals.reduce((acc, m) => acc + m.calories, 0), [meals]);
  const totalProtein = useMemo(() => meals.reduce((acc, m) => acc + m.protein, 0), [meals]);
  const totalCarbs = useMemo(() => meals.reduce((acc, m) => acc + m.carbs, 0), [meals]);
  const totalFat = useMemo(() => meals.reduce((acc, m) => acc + m.fat, 0), [meals]);
  
  const animatedCalories = useAnimatedCounter(totalCalories);
  const animatedProtein = useAnimatedCounter(totalProtein);

  const fetchData = useCallback(async () => {
    try {
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      const mealsRes = await fetch(`/api/food-log?date=${selectedDate}`);
      if (mealsRes.ok) {
        const mealsData = await mealsRes.json();
        if (mealsData && mealsData.length > 0) {
          const formattedMeals = mealsData.map((log: any) => ({
            type: mealLabels[log.meal_type] || log.meal_type,
            name: log.description,
            calories: log.calories,
            protein: log.protein_g || 0,
            carbs: log.carbs_g || 0,
            fat: log.fat_g || 0,
            time: new Date(log.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            emoji: mealEmojis[log.meal_type] || '🍽️',
          }));
          setMeals(formattedMeals);
        } else {
          setMeals([]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    light();
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 500);
    showToast('Datos actualizados', 'success');
    medium();
  }, [fetchData, light, medium]);

  const handlePullRefresh = useCallback(async () => {
    if (pullY < -150) {
      await handleRefresh();
      setPullY(0);
      setPulling(false);
    } else {
      setPullY(0);
      setPulling(false);
    }
  }, [pullY, handleRefresh]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }), []);

  const itemVariants = useMemo(() => ({
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
  }), []);

  const macros = useMemo(() => [
    { label: 'Proteína', value: totalProtein, color: 'text-blue-400', icon: '💪' },
    { label: 'Carbs', value: totalCarbs, color: 'text-yellow-400', icon: '🌾' },
    { label: 'Grasas', value: totalFat, color: 'text-red-400', icon: '🥑' },
  ], [totalProtein, totalCarbs, totalFat]);

  const MEAL_TYPES = useMemo(() => ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'] as const, []);

  return (
    <motion.div
      className="min-h-screen px-4 py-6 pb-24 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Pull-to-refresh indicator */}
      <AnimatePresence>
        {pulling && (
          <motion.div
            className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
              animate={{ scale: Math.min(1 + Math.abs(pullY) / 300, 1.2) }}
            >
              {isRefreshing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RefreshCw size={20} className="text-green-400" />
                </motion.div>
              ) : (
                <ArrowDown size={20} className="text-zinc-400" />
              )}
              <span className="text-sm text-zinc-400">
                {isRefreshing ? "Actualizando..." : pullY < -100 ? "¡Suelta para actualizar!" : "Arrastra para actualizar"}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pullable content wrapper */}
      <motion.div
        drag="y"
        dragConstraints={{ top: -200, bottom: 0 }}
        dragElastic={0.3}
        onDragStart={() => { setPulling(true); light(); }}
        onDrag={(_e, info) => {
          setPullY(info.offset.y);
          controls.start({ y: info.offset.y });
        }}
        onDragEnd={() => {
          handlePullRefresh();
          controls.start({ y: 0 });
        }}
        animate={controls}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ cursor: pulling ? "grabbing" : "grab" }}
        className="relative"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <div>
            <motion.h1 
              className="text-2xl font-bold gradient-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              ¡Hola, {profile?.name || 'Usuario'}! 👋
            </motion.h1>
            <p className="text-zinc-400 text-sm">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <motion.button
            onClick={handleRefresh}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={{ duration: 0.5 }}
          >
            <RefreshCw size={20} className="text-zinc-400" />
          </motion.button>
        </motion.div>

        {/* Daily Progress Ring */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 mb-6" spotlight={true}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                <h2 className="font-semibold">Progreso diario</h2>
              </div>
              <span className="text-sm text-zinc-400">
                {Math.round((totalCalories / (profile?.daily_calories || 2000)) * 100)}%
              </span>
            </div>
            
            <div className="flex items-center justify-center py-4">
              <CalorieRing 
                current={totalCalories} 
                target={profile?.daily_calories || 2000}
                size={200}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              {macros.map((macro, i) => (
                <motion.div 
                  key={macro.label}
                  className="text-center p-3 rounded-2xl bg-white/5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span className="text-lg">{macro.icon}</span>
                  <p className={`text-lg font-bold ${macro.color}`}>{macro.value}g</p>
                  <p className="text-xs text-zinc-500">{macro.label}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <AnimatedStatCard
              title="Calorías"
              value={animatedCalories}
              unit="kcal"
              icon={<Flame size={20} />}
              color="#f97316"
              trend={totalCalories > (profile?.daily_calories || 2000) * 0.5 ? "up" : "neutral"}
              delay={0.1}
            />
            <AnimatedStatCard
              title="Proteína"
              value={animatedProtein}
              unit="g"
              icon={<Activity size={20} />}
              color="#3b82f6"
              trend={totalProtein > 50 ? "up" : "neutral"}
              delay={0.2}
            />
          </div>
        </motion.div>

        {/* Water Tracker */}
        <motion.div variants={itemVariants} className="mb-6">
          <WaterTracker dailyGoal={8} userId={user?.id || 'default'} />
        </motion.div>

        {/* Meals Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="font-semibold text-lg">Comidas de hoy</h2>
            </div>
            <motion.button
              className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors"
              whileHover={{ x: 3 }}
            >
              Ver todas
              <ChevronRight size={16} />
            </motion.button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 rounded-3xl bg-white/5 animate-pulse" />
                ))}
              </>
            ) : (
              <>
                {MEAL_TYPES.map((mealType) => {
                  const meal = meals.find(m => m.type === mealType);
                  return (
                    <MealCard
                      key={mealType}
                      type={mealType}
                      name={meal?.name || `Sin ${mealType.toLowerCase()}`}
                      calories={meal?.calories || 0}
                      protein={meal?.protein}
                      carbs={meal?.carbs}
                      fat={meal?.fat}
                      time={meal?.time}
                      isEmpty={!meal}
                    />
                  );
                })}
              </>
            )}
          </div>
        </motion.div>

        {/* Streak Counter */}
        <motion.div variants={itemVariants} className="mt-6">
          <StreakCounter userId={user?.id || 'default'} />
        </motion.div>

        {/* Daily Tips */}
        <motion.div variants={itemVariants} className="mt-6">
          <DailyTips />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
