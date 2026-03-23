"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Clock, Flame, ChevronRight } from "lucide-react";

const sampleRecipes = [
  { id: "1", name: "Tortilla de patatas", time: 30, kcal: 350, supermarket: "Mercadona", protein: 15, carbs: 35, fat: 18 },
  { id: "2", name: "Ensalada César", time: 15, kcal: 280, supermarket: "Lidl", protein: 20, carbs: 12, fat: 18 },
  { id: "3", name: "Paella Valenciana", time: 60, kcal: 520, supermarket: "Mercadona", protein: 30, carbs: 60, fat: 18 },
  { id: "4", name: "Pechuga a la plancha", time: 20, kcal: 220, supermarket: "Aldi", protein: 45, carbs: 5, fat: 4 },
  { id: "5", name: "Lentejas con verduras", time: 45, kcal: 380, supermarket: "Family Cash", protein: 22, carbs: 55, fat: 8 },
  { id: "6", name: "Salmón al horno", time: 35, kcal: 420, supermarket: "Lidl", protein: 35, carbs: 8, fat: 28 },
];

const supermarkets = ["Todos", "Mercadona", "Lidl", "Aldi", "Family Cash"];

const supermarketColors: Record<string, string> = {
  Mercadona: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
  Lidl: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
  Aldi: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400",
  "Family Cash": "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
};

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");

  const filtered = sampleRecipes.filter(
    (r) =>
      (filter === "Todos" || r.supermarket === filter) &&
      r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header 
          className="px-5 pt-6 pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-4">Recetas</h1>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="text"
              placeholder="Buscar recetas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 outline-none focus:border-green-500/50 text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {supermarkets.map((s) => (
              <motion.button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === s 
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30" 
                    : "bg-white/5 border border-white/10 text-zinc-400"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </motion.header>

        {/* Recipe list */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="mb-3"
              >
                <div className="relative p-4 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 glass-card" />
                  <div className="absolute inset-0 border border-white/10 rounded-2xl" />
                  
                  <div className="relative">
                    <div className="flex justify-between items-start mb-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${supermarketColors[recipe.supermarket]}`}>
                        {recipe.supermarket}
                      </div>
                      <div className="flex items-center gap-1 text-orange-400">
                        <Flame size={14} />
                        <span className="text-sm font-medium">{recipe.kcal}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {recipe.time} min
                        </span>
                        <span className="text-blue-400">P: {recipe.protein}g</span>
                        <span className="text-yellow-400">C: {recipe.carbs}g</span>
                        <span className="text-red-400">G: {recipe.fat}g</span>
                      </div>
                      <ChevronRight size={18} className="text-zinc-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filtered.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-zinc-500">No hay recetas que coincidan</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
