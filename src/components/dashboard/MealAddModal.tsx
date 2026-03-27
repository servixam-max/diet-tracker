"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Search, ChefHat } from "lucide-react";
import { showToast } from "@/components/ui/Feedback";

interface Recipe {
  id: string;
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  image_url: string;
}

interface MealAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: "breakfast" | "lunch" | "snack" | "dinner";
  onAdd: (recipe: Recipe) => Promise<void>;
}

export function MealAddModal({ isOpen, onClose, mealType, onAdd }: MealAddModalProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mealTypeLabels = {
    breakfast: "desayuno",
    lunch: "comida",
    snack: "snack",
    dinner: "cena"
  };

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/recipes?limit=50&tag=${mealTypeLabels[mealType]}`);
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecipes();
    } else {
      setRecipes([]);
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleAdd = async (recipe: Recipe) => {
    try {
      await onAdd(recipe);
      showToast(`${recipe.name} añadido`, "success");
      onClose();
    } catch (error) {
      showToast("Error al añadir", "error");
    }
  };

  const filteredRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div
            className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto bg-[#0a0a0f] rounded-t-3xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="sticky top-0 z-10 flex justify-center pt-3 pb-2 bg-[#0a0a0f]">
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Añadir {mealTypeLabels[mealType]}
                  </h2>
                  <p className="text-sm text-zinc-500">Selecciona una receta</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-white/10">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-5 py-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar receta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-green-500/50"
                />
              </div>
            </div>

            {/* Recipe list */}
            <div className="px-5 pb-8">
              {isLoading ? (
                <div className="text-center py-12">
                  <ChefHat size={48} className="mx-auto text-zinc-600 mb-4 animate-pulse" />
                  <p className="text-zinc-400">Cargando recetas...</p>
                </div>
              ) : filteredRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <ChefHat size={48} className="mx-auto text-zinc-600 mb-4" />
                  <p className="text-zinc-400">No se encontraron recetas</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredRecipes.map((recipe) => (
                    <motion.button
                      key={recipe.id}
                      className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 text-left"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => handleAdd(recipe)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="aspect-[4/3] relative">
                        <img
                          src={recipe.image_url}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="font-medium text-sm line-clamp-2 leading-tight">{recipe.name}</p>
                          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                            <span>{recipe.calories} kcal</span>
                            <span>•</span>
                            <span>{recipe.protein_g}g P</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
