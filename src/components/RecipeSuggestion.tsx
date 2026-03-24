"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Clock, Users, Flame, RefreshCw, Sparkles, Heart, BookOpen } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: { item: string; amount: string }[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  difficulty: "Fácil" | "Media" | "Difícil";
  tags: string[];
  supermarket: string;
  image: string;
  liked: boolean;
}

const allRecipes: Recipe[] = [
  {
    id: "1",
    name: "Bowl Mediterráneo de Quinoa",
    description: "Un bowl nutritivo con quinoa, vegetales frescos y aderezo de limón.",
    ingredients: [
      { item: "Quinoa", amount: "200g" },
      { item: "Pepino", amount: "1 unidad" },
      { item: "Tomates cherry", amount: "150g" },
      { item: "Aceitunas", amount: "80g" },
      { item: "Queso feta", amount: "100g" },
      { item: "Aceite de oliva", amount: "30ml" },
    ],
    instructions: [
      "Cocina la quinoa según las instrucciones del paquete.",
      "Corta el pepino en dados y los tomates cherry por la mitad.",
      "Mezcla la quinoa con los vegetales.",
      "Añade el queso feta desmenuzado y las aceitunas.",
      "Aliña con aceite de oliva, limón, sal y pimienta.",
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    calories: 420,
    protein: 18,
    carbs: 52,
    fat: 14,
    difficulty: "Fácil",
    tags: ["Vegetariano", "Sin gluten", "Alto en proteína"],
    supermarket: "Lidl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
    liked: false,
  },
  {
    id: "2",
    name: "Pollo al Limón con Espárragos",
    description: "Pechuga de pollo jugosa con espárragos asados y hierbas mediterráneas.",
    ingredients: [
      { item: "Pechuga de pollo", amount: "400g" },
      { item: "Espárragos", amount: "300g" },
      { item: "Limón", amount: "1 unidad" },
      { item: "Ajo", amount: "3 dientes" },
      { item: "Romero fresco", amount: "10g" },
      { item: "Aceite de oliva", amount: "40ml" },
    ],
    instructions: [
      "Precalienta el horno a 200°C.",
      "Sazona el pollo con sal, pimienta y ajo picado.",
      "Coloca el pollo y los espárragos en una bandeja.",
      "Exprime el limón por encima y añade el romero.",
      "Hornea durante 25-30 minutos hasta que el pollo esté hecho.",
    ],
    prepTime: 10,
    cookTime: 30,
    servings: 2,
    calories: 380,
    protein: 42,
    carbs: 12,
    fat: 16,
    difficulty: "Fácil",
    tags: ["Bajo en carbs", "Alto en proteína", "Meal prep"],
    supermarket: "Mercadona",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
    liked: false,
  },
  {
    id: "3",
    name: "Smoothie Bowl Tropical",
    description: "Bowl energético de smoothie con frutas tropicales y toppings crujientes.",
    ingredients: [
      { item: "Plátano congelado", amount: "2 unidades" },
      { item: "Mango", amount: "150g" },
      { item: "Leche de almendras", amount: "100ml" },
      { item: "Granola", amount: "50g" },
      { item: "Semillas de chía", amount: "10g" },
      { item: "Miel", amount: "15g" },
    ],
    instructions: [
      "Tritura el plátano congelado con el mango y la leche.",
      "Vierte en un bowl.",
      "Añade la granola, semillas de chía y miel por encima.",
      "Decora con frutas frescas al gusto.",
    ],
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 350,
    protein: 8,
    carbs: 65,
    fat: 10,
    difficulty: "Fácil",
    tags: ["Vegano", "Desayuno", "Rápido"],
    supermarket: "Aldi",
    image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600",
    liked: false,
  },
  {
    id: "4",
    name: "Salmón al Horno con Verduras",
    description: "Salmón horneado con verduras de temporada, rico en omega-3.",
    ingredients: [
      { item: "Filete de salmón", amount: "400g" },
      { item: "Calabacín", amount: "200g" },
      { item: "Pimientos", amount: "200g" },
      { item: "Cebolla", amount: "150g" },
      { item: "Aceite de oliva", amount: "30ml" },
      { item: "Limón", amount: "1 unidad" },
    ],
    instructions: [
      "Precalienta el horno a 190°C.",
      "Corta las verduras en rodajas.",
      "Coloca el salmón en el centro y las verduras alrededor.",
      "Riega con aceite y exprime el limón.",
      "Hornea durante 20-25 minutos.",
    ],
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    calories: 450,
    protein: 40,
    carbs: 15,
    fat: 28,
    difficulty: "Fácil",
    tags: ["Alto en omega-3", "Keto", "Sin lactosa"],
    supermarket: "Lidl",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
    liked: false,
  },
  {
    id: "5",
    name: "Ensalada César con Pollo",
    description: "Ensalada clásica César con pechuga de pollo a la plancha.",
    ingredients: [
      { item: "Pechuga de pollo", amount: "300g" },
      { item: "Lechuga romana", amount: "200g" },
      { item: "Queso parmesano", amount: "50g" },
      { item: "Crutones", amount: "50g" },
      { item: "Salsa César", amount: "60ml" },
      { item: "Aceite de oliva", amount: "15ml" },
    ],
    instructions: [
      "Cocina el pollo a la plancha con un poco de aceite.",
      "Trocea la lechuga romana.",
      "Corta el pollo en tiras.",
      "Mezcla la lechuga con la salsa César.",
      "Añade el pollo, queso y crutones por encima.",
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    calories: 420,
    protein: 38,
    carbs: 18,
    fat: 24,
    difficulty: "Fácil",
    tags: ["Clásico", "Alto en proteína", "Rápido"],
    supermarket: "Mercadona",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600",
    liked: false,
  },
  {
    id: "6",
    name: "Tacos de Pavo",
    description: "Tacos mexicanos saludables con carne de pavo y guacamole.",
    ingredients: [
      { item: "Carne de pavo molida", amount: "400g" },
      { item: "Tortillas de trigo", amount: "8 unidades" },
      { item: "Aguacate", amount: "1 unidad" },
      { item: "Tomate", amount: "150g" },
      { item: "Cebolla", amount: "80g" },
      { item: "Salsa picante", amount: "30ml" },
    ],
    instructions: [
      "Cocina la carne de pavo sazonada con comino y pimentón.",
      "Prepara el guacamole machacando el aguacate con limón y sal.",
      "Pica el tomate y la cebolla finamente.",
      "Calienta las tortillas.",
      "Monta los tacos con carne, guacamole y vegetales.",
    ],
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    calories: 380,
    protein: 32,
    carbs: 35,
    fat: 14,
    difficulty: "Fácil",
    tags: ["Mexicano", "Alto en proteína", "Bajo en grasa"],
    supermarket: "Aldi",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600",
    liked: false,
  },
];

interface RecipeSuggestionProps {
  userId: string;
}

export function RecipeSuggestion({ userId }: RecipeSuggestionProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(allRecipes.slice(0, 3));
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState<Recipe | null>(null);
  const [viewAll, setViewAll] = useState(false);
  const { light, success } = useHaptic();

  async function generateNewRecipes() {
    setIsLoading(true);
    light();
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Shuffle and pick 3 random recipes
    const shuffled = [...allRecipes].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    setRecipes(selected);
    
    setIsLoading(false);
    success();
  }

  function toggleLike(id: string) {
    light();
    setRecipes(recipes.map(r => r.id === id ? { ...r, liked: !r.liked } : r));
    if (showDetails) {
      setShowDetails(showDetails.id === id ? { ...showDetails, liked: !showDetails.liked } : showDetails);
    }
    success();
  }

  function getSupermarketColor(supermarket: string) {
    switch (supermarket) {
      case "Mercadona": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Lidl": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Aldi": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Family Cash": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-zinc-500/10 text-zinc-400";
    }
  }

  const displayRecipes = viewAll ? allRecipes : recipes;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat size={18} className="text-amber-400" />
          <h3 className="font-semibold">Recetas sugeridas</h3>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => { light(); setViewAll(!viewAll); }}
            className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-zinc-400 hover:bg-white/10 transition-colors flex items-center gap-1"
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen size={14} />
            {viewAll ? "Ver menos" : "Ver todas"}
          </motion.button>
          <motion.button
            onClick={generateNewRecipes}
            disabled={isLoading || viewAll}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium disabled:opacity-50 flex items-center gap-1"
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            Nuevas
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-amber-500 border-t-transparent"
            />
            <p className="text-zinc-400">Generando recetas...</p>
          </motion.div>
        ) : (
          <motion.div
            key="recipes"
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {displayRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => { light(); setShowDetails(recipe); }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 p-3">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{recipe.name}</p>
                        <span className={`px-2 py-0.5 rounded text-xs border ${getSupermarketColor(recipe.supermarket)}`}>
                          {recipe.supermarket}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLike(recipe.id); }}
                        className="p-1"
                      >
                        <Heart
                          size={16}
                          className={recipe.liked ? "fill-red-500 text-red-500" : "text-zinc-500"}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Flame size={12} className="text-orange-400" />
                        {recipe.calories} kcal
                      </span>
                      <span>{recipe.protein}g P</span>
                      <span>{recipe.protein + recipe.carbs + recipe.fat > 0 ? Math.round((recipe.protein / (recipe.protein + recipe.carbs + recipe.fat)) * 100) : 0}% proteína</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {recipe.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 text-zinc-500 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipe detail modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(null)}
          >
            <div className="absolute inset-0 bg-black/80" />
            <motion.div
              className="absolute inset-0 md:inset-4 md:rounded-3xl bg-[#0a0a0f] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-56">
                <img src={showDetails.image} alt={showDetails.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
                <button
                  onClick={() => setShowDetails(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm"
                >
                  <svg width={20} height={20} className="text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className={`px-2 py-1 rounded-lg text-xs border mb-2 inline-block ${getSupermarketColor(showDetails.supermarket)}`}>
                    {showDetails.supermarket}
                  </span>
                  <h2 className="text-2xl font-bold">{showDetails.name}</h2>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 rounded-xl bg-white/5">
                    <p className="text-xl font-bold text-orange-400">{showDetails.calories}</p>
                    <p className="text-xs text-zinc-500">kcal</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-white/5">
                    <p className="text-xl font-bold text-blue-400">{showDetails.protein}g</p>
                    <p className="text-xs text-zinc-500">Proteína</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-white/5">
                    <p className="text-xl font-bold text-yellow-400">{showDetails.carbs}g</p>
                    <p className="text-xs text-zinc-500">Carbos</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-white/5">
                    <p className="text-xl font-bold text-red-400">{showDetails.fat}g</p>
                    <p className="text-xs text-zinc-500">Grasa</p>
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {showDetails.prepTime + showDetails.cookTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {showDetails.servings} personas
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    showDetails.difficulty === "Fácil" ? "bg-green-500/10 text-green-400" :
                    showDetails.difficulty === "Media" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>
                    {showDetails.difficulty}
                  </span>
                </div>

                <p className="text-zinc-400">{showDetails.description}</p>

                <div>
                  <h3 className="font-bold mb-2">Ingredientes</h3>
                  <div className="space-y-1">
                    {showDetails.ingredients.map((ing, i) => (
                      <div key={i} className="flex justify-between p-2 rounded-lg bg-white/5">
                        <span>{ing.item}</span>
                        <span className="text-zinc-400">{ing.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Instrucciones</h3>
                  <div className="space-y-2">
                    {showDetails.instructions.map((step, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-sm flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <p className="text-zinc-400 text-sm pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => toggleLike(showDetails.id)}
                    className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                      showDetails.liked
                        ? "bg-red-500/20 text-red-400 border border-red-500/40"
                        : "bg-white/5 border border-white/10"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart size={18} className={showDetails.liked ? "fill-current" : ""} />
                    {showDetails.liked ? "Me gusta" : "Añadir a favoritos"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
