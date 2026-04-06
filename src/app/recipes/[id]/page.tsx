"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { 
  Heart, Share2, Plus, Clock, Flame, Users, ChefHat, 
  ShoppingCart, ArrowLeft, TrendingUp, Check, Play, Pause,
  ChevronRight, ChevronLeft, Info, Sparkles
} from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Recipe, RECIPES } from "@/data/recipes";
import { useHaptic } from "@/hooks/useHaptic";

// Types for step-by-step cooking mode
interface CookingStep {
  number: number;
  instruction: string;
  duration?: number; // in minutes
  tip?: string;
}

interface ShoppingItem {
  item: string;
  amount: string;
  checked: boolean;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;
  
  // Initialize state directly instead of in useEffect
  const [recipe, setRecipe] = useState<Recipe | null>(() => {
    const found = RECIPES.find(r => r.id === recipeId) || null;
    return found;
  });
  
  const [similarRecipes, setSimilarRecipes] = useState<Recipe[]>(() => {
    const found = RECIPES.find(r => r.id === recipeId);
    if (found) {
      return RECIPES
        .filter(r => 
          r.id !== recipeId &&
          (r.supermarket === found.supermarket ||
           Math.abs(r.calories - found.calories) < 100 ||
           r.mealType.some(t => found.mealType.includes(t)))
        )
        .slice(0, 4);
    }
    return [];
  });
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { light, success } = useHaptic();
  
  // New state for Sprint 10 features
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  // Initialize shopping items from recipe
  useEffect(() => {
    if (recipe?.ingredients) {
      setShoppingItems(recipe.ingredients.map(ing => ({
        ...ing,
        checked: false
      })));
    }
  }, [recipe]);
  
  // Timer effect for cooking steps
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);
  
  // Generate cooking steps from instructions
  const cookingSteps: CookingStep[] = recipe?.instructions?.map((instruction: string, index: number) => ({
    number: index + 1,
    instruction,
    duration: extractDuration(instruction),
    tip: extractTip(instruction)
  })) || [];
  
  function extractDuration(instruction: string): number | undefined {
    const match = instruction.match(/(\d+)\s*(min|minuto|minutos|hora|horas)/i);
    if (match) {
      const value = parseInt(match[1]);
      return match[2].toLowerCase().includes('hora') ? value * 60 : value;
    }
    return undefined;
  }
  
  function extractTip(instruction: string): string | undefined {
    // Extract tips in parentheses or after "consejo:" or "tip:"
    const tipMatch = instruction.match(/\(([^)]+)\)|consejo:\s*(.+)|tip:\s*(.+)/i);
    return tipMatch ? (tipMatch[1] || tipMatch[2] || tipMatch[3]) : undefined;
  }
  
  function toggleShoppingItem(index: number) {
    light();
    setShoppingItems(prev => prev.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    ));
  }
  
  function startCookingMode() {
    success();
    setCookingMode(true);
    setCurrentStep(0);
    setCompletedSteps(new Set());
  }
  
  function nextStep() {
    light();
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    if (currentStep < cookingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      const duration = cookingSteps[currentStep + 1]?.duration;
      if (duration) {
        setTimeLeft(duration * 60);
      }
    } else {
      // Finished cooking
      setCookingMode(false);
      success();
    }
  }
  
  function prevStep() {
    light();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setCompletedSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentStep - 1);
        return newSet;
      });
    }
  }
  
  function startTimer(minutes: number) {
    setTimeLeft(minutes * 60);
    setTimerRunning(true);
    success();
  }
  
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  const progress = shoppingItems.length > 0 
    ? (shoppingItems.filter(i => i.checked).length / shoppingItems.length) * 100 
    : 0;

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

        {/* Tab Navigation */}
        <motion.div
          className="flex gap-2 p-1 rounded-2xl bg-white/5 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {(['ingredients', 'instructions', 'nutrition'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab === 'ingredients' && 'Ingredientes'}
              {tab === 'instructions' && 'Preparación'}
              {tab === 'nutrition' && 'Nutrición'}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'ingredients' && (
            <motion.div
              key="ingredients"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <ShoppingCart size={18} className="text-amber-400" />
                    Lista de compra
                  </h3>
                  <span className="text-xs text-zinc-400">
                    {Math.round(progress)}% completado
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <div className="space-y-2">
                  {shoppingItems.map((ingredient, index) => (
                    <motion.button
                      key={index}
                      onClick={() => toggleShoppingItem(index)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        ingredient.checked
                          ? 'bg-green-500/10 border border-green-500/20'
                          : 'bg-white/5 border border-white/5 hover:border-white/10'
                      }`}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        ingredient.checked
                          ? 'bg-green-500 border-green-500'
                          : 'border-zinc-500'
                      }`}>
                        {ingredient.checked && <Check size={14} className="text-white" />}
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-medium ${ingredient.checked ? 'line-through text-zinc-500' : ''}`}>
                          {ingredient.item}
                        </p>
                        <p className="text-xs text-zinc-500">{ingredient.amount}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => {
                    // Add all ingredients to shopping list
                    success();
                  }}
                  className="py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-medium flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart size={18} />
                  Añadir a lista
                </motion.button>
                <motion.button
                  onClick={startCookingMode}
                  className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
                  whileTap={{ scale: 0.98 }}
                >
                  <ChefHat size={18} />
                  Modo cocina
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'instructions' && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ChefHat size={18} className="text-amber-400" />
                  Instrucciones paso a paso
                </h3>

                <div className="space-y-4">
                  {cookingSteps.map((step, index) => (
                    <motion.div
                      key={step.number}
                      className="flex gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          completedSteps.has(index)
                            ? 'bg-green-500 text-white'
                            : 'bg-white/10 text-zinc-400'
                        }`}>
                          {completedSteps.has(index) ? (
                            <Check size={16} />
                          ) : (
                            step.number
                          )}
                        </div>
                        {index < cookingSteps.length - 1 && (
                          <div className="w-0.5 flex-1 bg-white/10 my-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-zinc-300 leading-relaxed mb-2">
                          {step.instruction}
                        </p>
                        {step.duration && (
                          <button
                            onClick={() => startTimer(step.duration!)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs"
                          >
                            <Clock size={12} />
                            {step.duration} min
                          </button>
                        )}
                        {step.tip && (
                          <div className="mt-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <p className="text-xs text-blue-400 flex items-start gap-1">
                              <Info size={12} className="mt-0.5 flex-shrink-0" />
                              {step.tip}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={startCookingMode}
                  className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <Play size={18} />
                  Iniciar modo cocina guiado
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'nutrition' && (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-amber-400" />
                  Información nutricional
                </h3>

                {/* Macro breakdown */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <p className="text-2xl font-bold text-blue-400">{recipe.protein}g</p>
                    <p className="text-xs text-zinc-400 mt-1">Proteína</p>
                    <p className="text-xs text-zinc-500">
                      {Math.round((recipe.protein * 4 / recipe.calories) * 100)}%
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                    <p className="text-2xl font-bold text-yellow-400">{recipe.carbs}g</p>
                    <p className="text-xs text-zinc-400 mt-1">Carbohidratos</p>
                    <p className="text-xs text-zinc-500">
                      {Math.round((recipe.carbs * 4 / recipe.calories) * 100)}%
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                    <p className="text-2xl font-bold text-red-400">{recipe.fat}g</p>
                    <p className="text-xs text-zinc-400 mt-1">Grasas</p>
                    <p className="text-xs text-zinc-500">
                      {Math.round((recipe.fat * 9 / recipe.calories) * 100)}%
                    </p>
                  </div>
                </div>

                {/* Additional info */}
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span className="text-zinc-400">Por porción</span>
                    <span className="font-medium">{recipe.calories} kcal</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span className="text-zinc-400">Por 100g</span>
                    <span className="font-medium">
                      {Math.round(recipe.calories / recipe.servings)} kcal
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span className="text-zinc-400">Tiempo total</span>
                    <span className="font-medium">{recipe.prepTime + recipe.cookTime} min</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span className="text-zinc-400">Dificultad</span>
                    <span className={`font-medium ${
                      recipe.difficulty === 'Fácil' ? 'text-green-400' :
                      recipe.difficulty === 'Media' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <p className="text-sm text-zinc-400 mb-2">Etiquetas</p>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-white/5 text-zinc-400 text-sm border border-white/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Cooking Mode Modal */}
        <AnimatePresence>
          {cookingMode && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setCookingMode(false)} />
              <motion.div
                className="relative w-full max-w-lg bg-[#1a1a1f] rounded-3xl overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Paso {currentStep + 1} de {cookingSteps.length}</p>
                    <h2 className="text-xl font-bold">{recipe.name}</h2>
                  </div>
                  <button
                    onClick={() => setCookingMode(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10"
                  >
                    ✕
                  </button>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / cookingSteps.length) * 100}%` }}
                  />
                </div>

                {/* Current step */}
                <div className="p-6">
                  {cookingSteps[currentStep] && (
                    <>
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl font-bold">
                          {currentStep + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-lg leading-relaxed">
                            {cookingSteps[currentStep].instruction}
                          </p>
                        </div>
                      </div>

                      {cookingSteps[currentStep].duration && (
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Clock size={20} className="text-amber-400" />
                              <span className="font-medium">Temporizador</span>
                            </div>
                            <span className="text-2xl font-bold font-mono">
                              {formatTime(timeLeft)}
                            </span>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => setTimerRunning(!timerRunning)}
                              className="flex-1 py-2 rounded-xl bg-amber-500 text-black font-medium flex items-center justify-center gap-2"
                            >
                              {timerRunning ? <><Pause size={16} /> Pausar</> : <><Play size={16} /> Iniciar</>}
                            </button>
                            <button
                              onClick={() => startTimer(cookingSteps[currentStep].duration!)}
                              className="px-4 py-2 rounded-xl bg-white/10"
                            >
                              ⟲
                            </button>
                          </div>
                        </div>
                      )}

                      {cookingSteps[currentStep].tip && (
                        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
                          <div className="flex items-start gap-2">
                            <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-blue-400 text-sm">{cookingSteps[currentStep].tip}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Navigation buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ChevronLeft size={18} />
                      Anterior
                    </button>
                    
                    <button
                      onClick={nextStep}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center justify-center gap-2"
                    >
                      {currentStep === cookingSteps.length - 1 ? (
                        <><Check size={18} /> Completar</>
                      ) : (
                        <>Siguiente <ChevronRight size={18} /></>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNavBar />
    </div>
  );
}
