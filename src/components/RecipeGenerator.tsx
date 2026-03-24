"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, ChefHat, Clock, Flame } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Recipe {
  id: string;
  name: string;
  emoji: string;
  time: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  tags: string[];
}

interface RecipeGeneratorProps {
  onSelect?: (recipe: Recipe) => void;
}

const SAMPLE_RECIPES: Recipe[] = [
  { id: "1", name: "Bowl de quinoa con aguacate", emoji: "🥑", time: 25, calories: 420, protein: 15, carbs: 45, fat: 22, ingredients: ["quinoa", "aguacate", "tomates cherry", "huevo"], tags: ["vegetariano", "alto en fibra"] },
  { id: "2", name: "Pollo tikka masala", emoji: "🍛", time: 45, calories: 550, protein: 42, carbs: 35, fat: 18, ingredients: ["pollo", "tomate", "crema de coco", "especias"], tags: ["alto en proteína"] },
  { id: "3", name: "Ensalada César con atún", emoji: "🥗", time: 15, calories: 320, protein: 28, carbs: 18, fat: 15, ingredients: ["atún", "lechuga romana", "parmesano", "crutones"], tags: ["bajo en carbs"] },
  { id: "4", name: "Salmón al vapor con verduras", emoji: "🐟", time: 30, calories: 380, protein: 35, carbs: 12, fat: 22, ingredients: ["salmón", "brócoli", "zanahoria", "jengibre"], tags: ["omega-3", "keto"] },
  { id: "5", name: "Tortillawrap integral", emoji: "🌯", time: 20, calories: 380, protein: 22, carbs: 38, fat: 14, ingredients: ["tortilla integral", "huevo", "jamón york", "queso"], tags: ["rápido"] },
  { id: "6", name: "Porridge proteico", emoji: "🥣", time: 10, calories: 350, protein: 28, carbs: 40, fat: 8, ingredients: ["copos de avena", "proteína en polvo", "plátano", "miel"], tags: ["post-entreno"] },
  { id: "7", name: " Curry de verduras", emoji: "🍲", time: 35, calories: 280, protein: 8, carbs: 32, fat: 14, ingredients: ["garbanzos", "espinacas", "leche de coco", "curry"], tags: ["vegan", "bowl"] },
  { id: "8", name: "Pechuga a la plancha", emoji: "🍗", time: 20, calories: 220, protein: 45, carbs: 0, fat: 4, ingredients: ["pechuga de pollo", "sal", "pimienta", "limón"], tags: ["keto", "bajo en grasa"] },
];

const PREFERENCES = ["alto en proteína", "bajo en carbs", "vegetariano", "vegano", "keto", "sin gluten", "rápido", "post-entreno"];

export function RecipeGenerator({ onSelect }: RecipeGeneratorProps) {
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { light, success } = useHaptic();

  function togglePref(pref: string) {
    light();
    setSelectedPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  }

  function generateRecipes() {
    setIsGenerating(true);
    light();

    setTimeout(() => {
      let filtered = SAMPLE_RECIPES;
      
      if (selectedPrefs.length > 0) {
        filtered = SAMPLE_RECIPES.filter((r) =>
          selectedPrefs.some((pref) => r.tags.includes(pref))
        );
      }

      // Shuffle and take 3
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      setGeneratedRecipes(shuffled.slice(0, 3));
      setIsGenerating(false);
      success();
    }, 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <ChefHat size={16} className="text-white" />
        </div>
        <h3 className="font-semibold">Generador de recetas</h3>
      </div>

      {/* Preference tags */}
      <div className="flex flex-wrap gap-2">
        {PREFERENCES.map((pref) => (
          <button
            key={pref}
            onClick={() => togglePref(pref)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              selectedPrefs.includes(pref)
                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                : "bg-white/5 border border-white/10 text-zinc-400"
            }`}
          >
            {pref}
          </button>
        ))}
      </div>

      {/* Generate button */}
      <motion.button
        onClick={generateRecipes}
        disabled={isGenerating}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        whileTap={{ scale: 0.98 }}
      >
        {isGenerating ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
              <RefreshCw size={20} />
            </motion.div>
            Generando...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Generar recetas
          </>
        )}
      </motion.button>

      {/* Generated recipes */}
      <div className="space-y-3">
        {generatedRecipes.map((recipe) => (
          <motion.div
            key={recipe.id}
            className="p-4 rounded-2xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-4xl">{recipe.emoji}</span>
              <div className="flex-1">
                <h4 className="font-bold">{recipe.name}</h4>
                <div className="flex gap-2 mt-1">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="text-center p-2 rounded-xl bg-white/5">
                <Clock size={14} className="mx-auto mb-1 text-zinc-400" />
                <p className="text-xs font-medium">{recipe.time}m</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-white/5">
                <Flame size={14} className="mx-auto mb-1 text-orange-400" />
                <p className="text-xs font-medium">{recipe.calories}</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-white/5">
                <p className="text-xs text-blue-400 font-bold">{recipe.protein}g</p>
                <p className="text-xs text-zinc-500">proteína</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-white/5">
                <p className="text-xs text-yellow-400 font-bold">{recipe.carbs}g</p>
                <p className="text-xs text-zinc-500">carbos</p>
              </div>
            </div>

            <motion.button
              onClick={() => { light(); onSelect?.(recipe); }}
              className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium"
              whileTap={{ scale: 0.98 }}
            >
              Ver receta
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
