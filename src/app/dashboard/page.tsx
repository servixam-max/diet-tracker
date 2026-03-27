"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedStatCard } from "@/components/AnimatedStats";
import { WaterTracker } from "@/components/WaterTracker";
import { CalorieRing } from "@/components/CalorieRing";
import { StreakCounter } from "@/components/StreakCounter";
import { DailyTips } from "@/components/DailyTips";
import { showToast } from "@/components/ui/Feedback";
import { useHaptic } from "@/hooks/useHaptic";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MacrosSummary } from "@/components/dashboard/MacrosSummary";
import { MealsSection } from "@/components/dashboard/MealsSection";
import { Flame, Activity, Target, ArrowDown, RefreshCw, Zap, ChevronRight } from "lucide-react";

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
  const [profile, setProfile] = useState<{
    name?: string;
    daily_calories?: number;
    macros?: { protein: number; carbs: number; fat: number };
  } | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
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
          const formattedMeals = mealsData.map((log: { meal_type: string; description: string; calories: number; protein_g?: number; carbs_g?: number; fat_g?: number; created_at: string }) => ({
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
    } catch {
      // Silent error handling
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


      {/* Scrollable content wrapper - disabled pull-to-refresh to fix scroll issues */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <DashboardHeader 
          name={profile?.name} 
          isRefreshing={isRefreshing} 
          onRefresh={handleRefresh}
        />

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
              <MacrosSummary protein={totalProtein} carbs={totalCarbs} fat={totalFat} />
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
          <MealsSection meals={meals} isLoading={isLoading} />
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
