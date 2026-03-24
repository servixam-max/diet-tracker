"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedStatCard } from "@/components/AnimatedStats";
import { MealCard } from "@/components/MealCard";
import { WaterTracker } from "@/components/WaterTracker";
import { CalorieRing } from "@/components/CalorieRing";
import { StreakCounter } from "@/components/StreakCounter";
import { DailyTips } from "@/components/DailyTips";
import { showToast, triggerHaptic } from "@/components/ui/Feedback";
import { RefreshCw, Flame, Activity, Zap, ChevronRight, Target } from "lucide-react";

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
  
  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = meals.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbs = meals.reduce((acc, m) => acc + m.carbs, 0);
  const totalFat = meals.reduce((acc, m) => acc + m.fat, 0);
  
  const animatedCalories = useAnimatedCounter(totalCalories);
  const animatedProtein = useAnimatedCounter(totalProtein);
  const animatedCarbs = useAnimatedCounter(totalCarbs);
  const animatedFat = useAnimatedCounter(totalFat);

  async function fetchData() {
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
  }

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    triggerHaptic('light');
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 500);
    showToast('Datos actualizados', 'success');
  };

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
    <motion.div
      className="min-h-screen px-4 py-6 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
            {[
              { label: 'Proteína', value: totalProtein, color: 'text-blue-400', icon: '💪' },
              { label: 'Carbs', value: totalCarbs, color: 'text-yellow-400', icon: '🌾' },
              { label: 'Grasas', value: totalFat, color: 'text-red-400', icon: '🥑' },
            ].map((macro, i) => (
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
              {(['Desayuno', 'Almuerzo', 'Merienda', 'Cena'] as const).map((mealType) => {
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
  );
}
