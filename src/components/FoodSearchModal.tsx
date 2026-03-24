"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Barcode, Camera, Plus, Flame, Sparkles } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  emoji?: string;
}

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: FoodItem) => void;
}

const RECENT_FOODS: FoodItem[] = [
  { id: "1", name: "Pollo a la plancha", calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: "100g", emoji: "🍗" },
  { id: "2", name: "Arroz integral", calories: 111, protein: 2.6, carbs: 23, fat: 0.9, servingSize: "100g", emoji: "🍚" },
  { id: "3", name: "Huevos revueltos", calories: 147, protein: 10, carbs: 2, fat: 11, servingSize: "2 huevos", emoji: "🥚" },
  { id: "4", name: "Avena con leche", calories: 150, protein: 5, carbs: 27, fat: 3, servingSize: "taza", emoji: "🥣" },
];

const SAMPLE_FOODS: FoodItem[] = [
  { id: "5", name: "Manzana", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, servingSize: "1 mediana", emoji: "🍎" },
  { id: "6", name: "Plátano", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, servingSize: "1 mediano", emoji: "🍌" },
  { id: "7", name: "Yogur griego", calories: 100, protein: 17, carbs: 6, fat: 0.7, servingSize: "170g", emoji: "🥛", brand: "Griego Natural" },
  { id: "8", name: "Salmón", calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: "100g", emoji: "🐟" },
  { id: "9", name: "Brócoli", calories: 55, protein: 3.7, carbs: 11, fat: 0.6, servingSize: "1 taza", emoji: "🥦" },
  { id: "10", name: "Pasta integral", calories: 131, protein: 5, carbs: 25, fat: 1, servingSize: "100g", emoji: "🍝" },
];

export function FoodSearchModal({ isOpen, onClose, onSelect }: FoodSearchModalProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [recentSearches] = useState<string[]>(["pollo", "arroz", "huevo", "avena"]);
  const { light, success } = useHaptic();

  useEffect(() => {
    if (search.trim()) {
      const filtered = SAMPLE_FOODS.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.brand?.toLowerCase().includes(search.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [search]);

  function handleSelect(item: FoodItem) {
    light();
    success();
    onSelect(item);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            className="relative w-full max-w-md mx-4 mb-8 p-6 rounded-3xl bg-gradient-to-br from-[#0a0a0f] to-[#12121a] border border-white/10"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:bg-white/10"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold mb-4">Añadir alimento</h3>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                type="text"
                placeholder="Buscar alimento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-500/50"
                autoFocus
              />
            </div>

            {/* Quick actions */}
            <div className="flex gap-2 mb-4">
              <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-sm flex items-center justify-center gap-2">
                <Barcode size={16} />
                Escanear
              </button>
              <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-sm flex items-center justify-center gap-2">
                <Camera size={16} />
                Foto
              </button>
            </div>

            {/* Results or Recent */}
            {search.trim() ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="text-center py-8 text-zinc-400">
                    <p>No se encontraron resultados</p>
                    <button
                      onClick={() => handleSelect({ id: "custom", name: search, calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: "1 porción" })}
                      className="mt-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-400 text-sm"
                    >
                      Añadir manualmente
                    </button>
                  </div>
                ) : (
                  results.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-left flex items-center gap-3"
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-2xl">{item.emoji || "🍽️"}</span>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-zinc-400">{item.brand || item.servingSize}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-400">{item.calories}</p>
                        <p className="text-xs text-zinc-500">kcal</p>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            ) : (
              <>
                {/* Recent searches */}
                <div className="mb-4">
                  <p className="text-sm text-zinc-400 mb-2">Búsquedas recientes</p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSearch(s)}
                        className="px-3 py-1 rounded-full bg-white/5 text-sm text-zinc-400 hover:bg-white/10"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent foods */}
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Añadidos recientemente</p>
                  <div className="space-y-2">
                    {RECENT_FOODS.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-left flex items-center gap-3"
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-zinc-400">{item.servingSize}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-400">{item.calories}</p>
                          <p className="text-xs text-zinc-500">kcal</p>
                        </div>
                        <Plus size={16} className="text-green-400" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
