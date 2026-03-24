"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, Utensils, Clock, Flame } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface QuickAddMealProps {
  onAdd: (meal: { name: string; calories: number; protein: number; carbs: number; fat: number }) => void;
}

const QUICK_FOODS = [
  { name: "Huevo cocido", calories: 78, protein: 6, carbs: 1, fat: 5 },
  { name: "Plátano", calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: "Manzana", calories: 95, protein: 0, carbs: 25, fat: 0 },
  { name: "Yogur griego", calories: 100, protein: 17, carbs: 6, fat: 1 },
  { name: "Arroz blanco (100g)", calories: 130, protein: 3, carbs: 28, fat: 0 },
  { name: "Pollo pechuga (100g)", calories: 165, protein: 31, carbs: 0, fat: 4 },
  { name: "Avena (50g)", calories: 190, protein: 7, carbs: 33, fat: 5 },
  { name: "Almendras (30g)", calories: 170, protein: 6, carbs: 6, fat: 15 },
];

const MEAL_TYPES = [
  { id: "breakfast", label: "Desayuno", icon: "🌅", color: "from-yellow-500 to-orange-500" },
  { id: "lunch", label: "Almuerzo", icon: "🍽️", color: "from-green-500 to-emerald-500" },
  { id: "snack", label: "Merienda", icon: "🍪", color: "from-orange-500 to-red-500" },
  { id: "dinner", label: "Cena", icon: "🌙", color: "from-purple-500 to-indigo-500" },
];

export function QuickAddMeal({ onAdd }: QuickAddMealProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("lunch");
  const [customFood, setCustomFood] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  const { light, success } = useHaptic();

  const filteredFoods = QUICK_FOODS.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleQuickAdd(food: typeof QUICK_FOODS[0]) {
    light();
    onAdd(food);
    success();
    setIsOpen(false);
  }

  function handleCustomAdd() {
    if (!customFood.name || !customFood.calories) return;
    
    light();
    onAdd({
      name: customFood.name,
      calories: parseInt(customFood.calories) || 0,
      protein: parseInt(customFood.protein) || 0,
      carbs: parseInt(customFood.carbs) || 0,
      fat: parseInt(customFood.fat) || 0,
    });
    setCustomFood({ name: "", calories: "", protein: "", carbs: "", fat: "" });
    success();
    setIsOpen(false);
  }

  return (
    <>
      <motion.button
        onClick={() => { light(); setIsOpen(true); }}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
        whileTap={{ scale: 0.98 }}
      >
        <Plus size={24} />
        Añadir comida
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60" />
            <motion.div
              className="relative w-full max-w-lg mx-4 mb-4 max-h-[85vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] border border-white/10"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 p-4 border-b border-white/10 bg-[#0a0a0f]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Añadir comida</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/10"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Meal type selector */}
                <div className="flex gap-2 mb-4">
                  {MEAL_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => { light(); setSelectedMealType(type.id); }}
                      className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                        selectedMealType === type.id
                          ? `bg-gradient-to-br ${type.color} text-white`
                          : "bg-white/5 text-zinc-400"
                      }`}
                    >
                      <span className="text-lg">{type.icon}</span>
                      <span className="text-xs">{type.label}</span>
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar alimento..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-green-500/50"
                  />
                </div>
              </div>

              {/* Quick foods */}
              <div className="p-4 space-y-3">
                {filteredFoods.length > 0 && (
                  <div>
                    <p className="text-xs text-zinc-500 mb-2">ALIMENTOS RÁPIDOS</p>
                    {filteredFoods.map((food) => (
                      <motion.button
                        key={food.name}
                        onClick={() => handleQuickAdd(food)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-left flex items-center justify-between mb-2"
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <Utensils size={18} className="text-zinc-500" />
                          <div>
                            <p className="font-medium">{food.name}</p>
                            <p className="text-xs text-zinc-500">P: {food.protein}g • C: {food.carbs}g • G: {food.fat}g</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-400">{food.calories}</p>
                          <p className="text-xs text-zinc-500">kcal</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Custom food */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-zinc-500 mb-2">AÑADIR ALIMENTO PERSONALIZADO</p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Nombre del alimento"
                      value={customFood.name}
                      onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 outline-none"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      <input
                        type="number"
                        placeholder="kcal"
                        value={customFood.calories}
                        onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-center"
                      />
                      <input
                        type="number"
                        placeholder="P (g)"
                        value={customFood.protein}
                        onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-center"
                      />
                      <input
                        type="number"
                        placeholder="C (g)"
                        value={customFood.carbs}
                        onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-center"
                      />
                      <input
                        type="number"
                        placeholder="G (g)"
                        value={customFood.fat}
                        onChange={(e) => setCustomFood({ ...customFood, fat: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-center"
                      />
                    </div>
                    <motion.button
                      onClick={handleCustomAdd}
                      disabled={!customFood.name || !customFood.calories}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold disabled:opacity-50"
                      whileTap={{ scale: 0.98 }}
                    >
                      Añadir {customFood.name || "alimento"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
