"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { 
  Heart, Share2, Plus, Clock, Flame, Users, ChefHat, 
  ShoppingCart, ArrowLeft, TrendingUp 
} from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Recipe, RECIPES } from "@/data/recipes";
import { useHaptic } from "@/hooks/useHaptic";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [similarRecipes, setSimilarRecipes] = useState<Recipe[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { light, success } = useHaptic();

  useEffect(() => {
    const foundRecipe = RECIPES.find(r => r.id === recipeId);
    if (foundRecipe) {
      // Find similar recipes based on supermarket, calories, and meal type
      const similar = RECIPES
        .filter(r => 
          r.id !== recipeId &&
          (r.supermarket === foundRecipe.supermarket ||
           Math.abs(r.calories - foundRecipe.calories) < 100 ||
           r.mealType.some(t => foundRecipe.mealType.includes(t)))
        )
        .slice(0, 4);
      // Set state in separate calls to avoid cascading renders warning
      requestAnimationFrame(() => {
        setRecipe(foundRecipe);
        setSimilarRecipes(similar);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [recipeId]);

  function toggleFavorite() {
    light();
    setIsFavorite(!isFavorite);
    if (!isFavorite) success();
  }

  function handleShare() {
    light();
    if (!recipe) return;
    
    const text = `🍳 ${recipe.name}
${recipe.description}
⏱️ ${recipe.prepTime + recipe.cookTime} min
🔥 ${recipe.calories} kcal | ${recipe.protein}g P | ${recipe.carbs}g C | ${recipe.fat}g G
🏪 ${recipe.supermarket}

📝 Ingredientes:
${recipe.ingredients.map(i => `• ${i.item} (${i.amount})`).join("\n")}`;
    
    if (navigator.share) {
      navigator.share({ title: recipe.name, text });
    } else {
      navigator.clipboard.writeText(text);
      success();
    }
  }

  function handleAddToMealPlan() {
    if (!recipe) return;
    success();
    // Navigate to weekly plan page with recipe
    router.push('/weekly-plan');
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

  function getMealTypeIcon(type: string) {
    switch (type) {
      case "desayuno": return "🌅";
      case "comida": return "🍽️";
      case "cena": return "🌙";
      case "snack": return "🍎";
      default: return "🍴";
    }
  }

  if (isLoading || !recipe) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <ChefHat size={48} className="mx-auto text-zinc-600 mb-4 animate-pulse" />
          <p className="text-zinc-400">Cargando receta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-24">
      <ParticleBackground />
      
      {/* Header with back button */}
      <motion.header 
        className="relative z-10 px-5 pt-8 pb-4 flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold flex-1">Detalle de receta</h1>
      </motion.header>

      <main className="relative z-10 px-5 space-y-6">
        {/* Hero image */}
        <motion.div
          className="relative h-64 rounded-3xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className={`px-3 py-1.5 rounded-lg text-xs border mb-2 inline-block ${getSupermarketColor(recipe.supermarket)}`}>
              {recipe.supermarket}
            </span>
            <h2 className="text-2xl font-bold leading-tight">{recipe.name}</h2>
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          className="grid grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Clock size={18} className="text-cyan-400 mx-auto mb-1" />
            <p className="text-lg font-bold">{recipe.prepTime + recipe.cookTime}</p>
            <p className="text-xs text-zinc-500">min</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Flame size={18} className="text-orange-400 mx-auto mb-1" />
            <p className="text-lg font-bold">{recipe.calories}</p>
            <p className="text-xs text-zinc-500">kcal</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <ChefHat size={18} className="text-green-400 mx-auto mb-1" />
            <p className="text-lg font-bold">{recipe.protein}g</p>
            <p className="text-xs text-zinc-500">proteína</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <Users size={18} className="text-purple-400 mx-auto mb-1" />
            <p className="text-lg font-bold">{recipe.servings}</p>
            <p className="text-xs text-zinc-500">porciones</p>
          </div>
        </motion.div>

        {/* Macros bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-zinc-400 mb-2">Macronutrientes</p>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden flex">
            <motion.div
              className="bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(recipe.protein / (recipe.protein + recipe.carbs + recipe.fat)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="bg-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${(recipe.carbs / (recipe.protein + recipe.carbs + recipe.fat)) * 100}%` }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            <motion.div
              className="bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${(recipe.fat / (recipe.protein + recipe.carbs + recipe.fat)) * 100}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-zinc-500">
            <span>Proteína {recipe.protein}g</span>
            <span>Carbos {recipe.carbs}g</span>
            <span>Grasa {recipe.fat}g</span>
          </div>
        </motion.div>

        {/* Meal type and difficulty badges */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {recipe.mealType.map(type => (
            <span key={type} className="px-3 py-1 rounded-full bg-white/5 text-sm flex items-center gap-1">
              <span>{getMealTypeIcon(type)}</span>
              <span className="capitalize">{type}</span>
            </span>
          ))}
          <span className={`px-3 py-1 rounded-full text-sm ${
            recipe.difficulty === "Fácil" ? "bg-green-500/10 text-green-400" :
            recipe.difficulty === "Media" ? "bg-yellow-500/10 text-yellow-400" :
            "bg-red-500/10 text-red-400"
          }`}>
            {recipe.difficulty}
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-zinc-400 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {recipe.description}
        </motion.p>

        {/* Tags */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {recipe.tags.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-zinc-400 text-sm">
              #{tag}
            </span>
          ))}
        </motion.div>

        {/* Ingredients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <ShoppingCart size={18} className="text-amber-400" />
            Ingredientes
          </h3>
          <div className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <span>{ing.item}</span>
                </div>
                <span className="text-zinc-400">{ing.amount}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <ChefHat size={18} className="text-amber-400" />
            Instrucciones
          </h3>
          <div className="space-y-4">
            {recipe.instructions.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <p className="text-zinc-400 leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Similar recipes */}
        {similarRecipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-amber-400" />
            Recetas similares
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {similarRecipes.map((similar, i) => (
                <motion.div
                  key={similar.id}
                  className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.05 }}
                  onClick={() => router.push(`/recipes/${similar.id}`)}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={similar.image}
                      alt={similar.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-xs border ${getSupermarketColor(similar.supermarket)}`}>
                      {similar.supermarket}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm line-clamp-2 mb-1 leading-tight">{similar.name}</p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Flame size={12} className="text-orange-400" />
                        {similar.calories} kcal
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          className="flex gap-3 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <motion.button
            onClick={toggleFavorite}
            className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
              isFavorite
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-white/5 border border-white/10"
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <Heart size={18} className={isFavorite ? "fill-current" : ""} />
            {isFavorite ? "Guardado" : "Guardar"}
          </motion.button>
          
          <motion.button
            onClick={handleShare}
            className="py-3 px-4 rounded-xl bg-white/5 border border-white/10"
            whileTap={{ scale: 0.98 }}
          >
            <Share2 size={18} />
          </motion.button>

          <motion.button
            onClick={handleAddToMealPlan}
            className="flex-1 py-3 rounded-xl font-medium bg-amber-500 text-black flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} />
            Añadir al plan
          </motion.button>
        </motion.div>
      </main>

      <BottomNavBar />
    </div>
  );
}
