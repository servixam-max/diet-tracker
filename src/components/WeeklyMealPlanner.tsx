"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChefHat, Clock, Users, Check, Plus, Trash2, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface MealOption {
  id: string;
  name: string;
  calories: number;
  protein: number;
  time: string;
  image: string;
  selected: boolean;
}

interface DayPlan {
  day: string;
  date: Date;
  breakfast: MealOption | null;
  lunch: MealOption | null;
  dinner: MealOption | null;
  snacks: MealOption[];
}

const mealOptions: Record<string, MealOption[]> = {
  breakfast: [
    { id: "b1", name: "Avena con frutas del bosque", calories: 320, protein: 12, time: "08:00", image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400", selected: false },
    { id: "b2", name: "Tostadas con aguacate y huevo", calories: 380, protein: 18, time: "08:30", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400", selected: false },
    { id: "b3", name: "Yogur griego con granola y miel", calories: 280, protein: 15, time: "08:00", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", selected: false },
    { id: "b4", name: "Smoothie de plátano y espinacas", calories: 250, protein: 8, time: "08:15", image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400", selected: false },
    { id: "b5", name: "Huevos revueltos con pavo", calories: 350, protein: 25, time: "09:00", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400", selected: false },
  ],
  lunch: [
    { id: "l1", name: "Ensalada César con pollo a la plancha", calories: 450, protein: 38, time: "14:00", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", selected: false },
    { id: "l2", name: "Bowl de quinoa con vegetales", calories: 420, protein: 15, time: "13:30", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", selected: false },
    { id: "l3", name: "Peachuga de pollo con arroz integral", calories: 520, protein: 42, time: "14:00", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400", selected: false },
    { id: "l4", name: "Salmón al horno con verduras", calories: 480, protein: 40, time: "14:30", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400", selected: false },
    { id: "l5", name: "Wrap integral de atún y vegetales", calories: 380, protein: 28, time: "13:00", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400", selected: false },
  ],
  dinner: [
    { id: "d1", name: "Merluza a la plancha con ensalada", calories: 380, protein: 35, time: "21:00", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400", selected: false },
    { id: "d2", name: "Pasta integral con tomate y albahaca", calories: 450, protein: 15, time: "20:30", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400", selected: false },
    { id: "d3", name: "Pollo al curry con arroz basmati", calories: 520, protein: 38, time: "20:00", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400", selected: false },
    { id: "d4", name: "Tofu salteado con vegetales", calories: 350, protein: 22, time: "20:30", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", selected: false },
    { id: "d5", name: "Filete de ternera con brócoli", calories: 480, protein: 45, time: "21:00", image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400", selected: false },
  ],
};

interface WeeklyMealPlannerProps {
  userId: string;
}

function MealSlot({ type, meal, onSelect, onRemove }: {
  type: string;
  meal: MealOption | null;
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {meal ? (
        <>
          <img src={meal.image} alt={meal.name} className="w-10 h-10 rounded-lg object-cover" loading="lazy" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{meal.name}</p>
            <p className="text-xs text-zinc-500">{meal.calories} kcal</p>
          </div>
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </>
      ) : (
        <button
          onClick={onSelect}
          className="flex-1 py-2 rounded-xl bg-white/5 border border-dashed border-white/10 text-sm text-zinc-500 flex items-center justify-center gap-2 hover:bg-white/10"
        >
          <Plus size={14} />
          {type}
        </button>
      )}
    </div>
  );
}

function createWeekDays(currentWeekOffset: number): DayPlan[] {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + currentWeekOffset * 7);

  const days: DayPlan[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    days.push({
      day: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][i],
      date,
      breakfast: i === 0 ? mealOptions.breakfast[0] : null,
      lunch: i === 0 ? mealOptions.lunch[0] : null,
      dinner: null,
      snacks: [],
    });
  }

  return days;
}

export function WeeklyMealPlanner({ userId }: WeeklyMealPlannerProps) {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [weekDays, setWeekDays] = useState<DayPlan[]>(() => createWeekDays(0));
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [showMealSelector, setShowMealSelector] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const { light, success } = useHaptic();

  useEffect(() => {
    setWeekDays(createWeekDays(currentWeekOffset));
  }, [currentWeekOffset]);

  const openMealSelector = useCallback((dayIndex: number, mealType: string) => {
    light();
    setSelectedDayIndex(dayIndex);
    setSelectedMealType(mealType);
    setShowMealSelector(true);
  }, [light]);

  const selectMeal = useCallback((meal: MealOption) => {
    success();
    setWeekDays((prev) =>
      prev.map((day, index) => {
        if (index !== selectedDayIndex) return day;
        if (selectedMealType === "breakfast") return { ...day, breakfast: meal };
        if (selectedMealType === "lunch") return { ...day, lunch: meal };
        if (selectedMealType === "dinner") return { ...day, dinner: meal };
        return day;
      })
    );
    setShowMealSelector(false);
    setSelectedMealType(null);
  }, [selectedDayIndex, selectedMealType, success]);

  const removeMeal = useCallback((dayIndex: number, mealType: string) => {
    light();
    setWeekDays((prev) =>
      prev.map((day, index) => {
        if (index !== dayIndex) return day;
        if (mealType === "breakfast") return { ...day, breakfast: null };
        if (mealType === "lunch") return { ...day, lunch: null };
        if (mealType === "dinner") return { ...day, dinner: null };
        return day;
      })
    );
  }, [light]);

  const getTotalCalories = useCallback((day: DayPlan) => {
    let total = 0;
    if (day.breakfast) total += day.breakfast.calories;
    if (day.lunch) total += day.lunch.calories;
    if (day.dinner) total += day.dinner.calories;
    day.snacks.forEach(s => total += s.calories);
    return total;
  }, []);

  const weekTotal = useMemo(() => weekDays.reduce((acc, day) => acc + getTotalCalories(day), 0), [weekDays, getTotalCalories]);
  const avgCalories = useMemo(() => Math.round(weekTotal / 7), [weekTotal]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-rose-400" />
          <h3 className="font-semibold">Plan semanal</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { light(); setCurrentWeekOffset(currentWeekOffset - 1); }}
            className="p-1.5 rounded-lg hover:bg-white/10"
          >
            <ChevronLeft size={18} className="text-zinc-400" />
          </button>
          <span className="text-sm text-zinc-400 min-w-[80px] text-center">
            {weekDays[0]?.date.toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
          </span>
          <button
            onClick={() => { light(); setCurrentWeekOffset(currentWeekOffset + 1); }}
            className="p-1.5 rounded-lg hover:bg-white/10"
          >
            <ChevronRight size={18} className="text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Week summary */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/5 border border-rose-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">Media semanal</p>
            <p className="text-xl font-bold text-rose-400">{avgCalories} kcal/día</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400">Total semana</p>
            <p className="text-xl font-bold">{weekTotal} kcal</p>
          </div>
        </div>
      </div>

      {/* Days list */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {weekDays.map((day, dayIndex) => {
          const isToday = day.date.toDateString() === new Date().toDateString();
          const total = getTotalCalories(day);
          
          return (
            <motion.div
              key={day.day}
              className={`p-4 rounded-2xl border ${
                isToday 
                  ? "bg-rose-500/10 border-rose-500/30" 
                  : "bg-white/5 border-white/10"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.05 }}
            >
              {/* Day header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${isToday ? "text-rose-400" : ""}`}>
                    {day.day} {day.date.getDate()}
                  </span>
                  {isToday && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs">
                      Hoy
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Flame size={14} className="text-orange-400" />
                  <span className="text-zinc-400">{total} kcal</span>
                </div>
              </div>

              {/* Meals */}
              <div className="space-y-2">
                <MealSlot type="Desayuno" meal={day.breakfast} onSelect={() => openMealSelector(dayIndex, "breakfast")} onRemove={() => removeMeal(dayIndex, "breakfast")} />
                <MealSlot type="Almuerzo" meal={day.lunch} onSelect={() => openMealSelector(dayIndex, "lunch")} onRemove={() => removeMeal(dayIndex, "lunch")} />
                <MealSlot type="Cena" meal={day.dinner} onSelect={() => openMealSelector(dayIndex, "dinner")} onRemove={() => removeMeal(dayIndex, "dinner")} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Meal selector modal */}
      <AnimatePresence>
        {showMealSelector && selectedMealType && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowMealSelector(false)} />
            <motion.div
              className="relative w-full max-w-lg bg-[#121218] rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
            >
              <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-4" />
              <h4 className="text-lg font-bold mb-4">
                Selecciona {selectedMealType === "breakfast" ? "desayuno" : selectedMealType === "lunch" ? "almuerzo" : "cena"}
              </h4>
              
              <div className="space-y-3">
                {mealOptions[selectedMealType].map((meal) => (
                  <motion.button
                    key={meal.id}
                    onClick={() => selectMeal(meal)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/30 transition-colors flex items-center gap-3"
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-16 h-16 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1 text-left">
                      <p className="font-medium">{meal.name}</p>
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <span>{meal.calories} kcal</span>
                        <span>{meal.protein}g proteína</span>
                      </div>
                    </div>
                    <Plus size={20} className="text-rose-400" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
