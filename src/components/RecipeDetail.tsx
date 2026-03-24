"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Flame, Users, ChefHat, Heart, Share2, Plus, Check } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Recipe {
  id: string;
  name: string;
  time: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  supermarket: string;
  ingredients: string[];
  steps?: string[];
  emoji: string;
  isFavorite?: boolean;
}

interface RecipeDetailProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onAddToPlan?: (recipe: Recipe) => void;
}

export function RecipeDetail({ recipe, isOpen, onClose, onAddToPlan }: RecipeDetailProps) {
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite || false);
  const { light, success } = useHaptic();

  function toggleFavorite() {
    light();
    setIsFavorite(!isFavorite);
    if (!isFavorite) success();
  }

  function handleShare() {
    light();
    const text = `🍳 ${recipe.name}\n⏱️ ${recipe.time} min\n🔥 ${recipe.kcal} kcal\n\n${recipe.ingredients.map(i => `• ${i}`).join("\n")}`;
    
    if (navigator.share) {
      navigator.share({ title: recipe.name, text });
    }
  }

  function handleAdd() {
    success();
    onAddToPlan?.(recipe);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <motion.div
            className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto bg-[#0a0a0f] rounded-t-3xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="sticky top-0 z-10 flex justify-center pt-3 pb-2 bg-[#0a0a0f]">
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="relative px-5 pb-4">
              <button
                onClick={onClose}
                className="absolute top-0 right-0 p-2 rounded-xl bg-white/5 hover:bg-white/10"
              >
                <X size={20} className="text-zinc-400" />
              </button>

              {/* Emoji header */}
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center text-5xl"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  {recipe.emoji}
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{recipe.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      recipe.supermarket === "Mercadona" ? "bg-red-500/20 text-red-400" :
                      recipe.supermarket === "Lidl" ? "bg-blue-500/20 text-blue-400" :
                      recipe.supermarket === "Aldi" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-purple-500/20 text-purple-400"
                    }`}>
                      {recipe.supermarket}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <Clock size={18} className="text-cyan-400 mx-auto mb-1" />
                  <p className="text-lg font-bold">{recipe.time}</p>
                  <p className="text-xs text-zinc-500">min</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <Flame size={18} className="text-orange-400 mx-auto mb-1" />
                  <p className="text-lg font-bold">{recipe.kcal}</p>
                  <p className="text-xs text-zinc-500">kcal</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <ChefHat size={18} className="text-green-400 mx-auto mb-1" />
                  <p className="text-lg font-bold">{recipe.protein}g</p>
                  <p className="text-xs text-zinc-500">proteína</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <Users size={18} className="text-purple-400 mx-auto mb-1" />
                  <p className="text-lg font-bold">1</p>
                  <p className="text-xs text-zinc-500">persona</p>
                </div>
              </div>

              {/* Macros bar */}
              <div className="mb-6">
                <p className="text-sm text-zinc-400 mb-2">Macronutrientes</p>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden flex">
                  <motion.div
                    className="bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(recipe.protein / (recipe.protein + recipe.carbs + recipe.fat)) * 100}%` }}
                  />
                  <motion.div
                    className="bg-yellow-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(recipe.carbs / (recipe.protein + recipe.carbs + recipe.fat)) * 100}%` }}
                  />
                  <motion.div
                    className="bg-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(recipe.fat / (recipe.protein + recipe.carbs + recipe.fat)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-blue-400">P: {recipe.protein}g</span>
                  <span className="text-yellow-400">C: {recipe.carbs}g</span>
                  <span className="text-red-400">G: {recipe.fat}g</span>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ChefHat size={18} className="text-green-400" />
                  Ingredientes
                </h3>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-white/90">{ingredient}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-8">
                <motion.button
                  onClick={toggleFavorite}
                  className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border transition-colors ${
                    isFavorite 
                      ? "bg-red-500/20 text-red-400 border-red-500/30" 
                      : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart size={20} className={isFavorite ? "fill-current" : ""} />
                  {isFavorite ? "Favorito" : "Guardar"}
                </motion.button>
                
                <motion.button
                  onClick={handleShare}
                  className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 size={20} />
                  Compartir
                </motion.button>
              </div>

              {/* Add to plan */}
              {onAddToPlan && (
                <motion.button
                  onClick={handleAdd}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 mb-4"
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={22} />
                  Añadir al plan
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
