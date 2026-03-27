"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChefHat, Clock, Users, Flame, Search, Filter, X, Plus, Check, 
  Heart, Share2, BookOpen, ShoppingCart, FilterX 
} from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Recipe {
  id: string;
  name: string;
  description: string;
  image_url: string;
  prep_time_minutes: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  servings: number;
  supermarket: string;
  ingredients: { item: string; amount: string }[];
  instructions: string[];
  tags: string[];
}

interface RecipeBookProps {
  userId: string;
  onAddToMealPlan?: (recipe: Recipe) => void;
  onAddToShoppingList?: (recipe: Recipe) => void;
}

export function RecipeBook({ userId, onAddToMealPlan, onAddToShoppingList }: RecipeBookProps) {
  const router = useRouter();
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupermarket, setSelectedSupermarket] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const { light, success } = useHaptic();

  // Fetch recipes from Supabase
  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch('/api/recipes');
        if (response.ok) {
          const data = await response.json();
          setAllRecipes(data);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  // Get unique supermarkets
  const supermarkets = [...new Set(allRecipes.map(r => r.supermarket))];
  
  // Get unique tags
  const allTags = [...new Set(allRecipes.flatMap(r => r.tags))];

  // Filter recipes
  const filteredRecipes = allRecipes.filter(recipe => {
    const matchesSearch = searchQuery === "" || 
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some(i => i.item.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSupermarket = !selectedSupermarket || recipe.supermarket.toLowerCase().includes(selectedSupermarket.toLowerCase());
    const matchesTag = !selectedTag || recipe.tags.includes(selectedTag);
    
    return matchesSearch && matchesSupermarket && matchesTag;
  });

  function toggleLike(id: string) {
    setLikedRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  function clearFilters() {
    setSelectedSupermarket(null);
    setSelectedTag(null);
    setSearchQuery("");
  }

  function getSupermarketColor(supermarket: string) {
    switch (supermarket.toLowerCase()) {
      case "mercadona": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "lidl": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "aldi": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "familycash": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-zinc-500/10 text-zinc-400";
    }
  }

  function getMealTypeIcon(tags: string[]) {
    if (tags.includes('desayuno')) return '🌅';
    if (tags.includes('comida')) return '🍽️';
    if (tags.includes('cena')) return '🌙';
    if (tags.includes('snack')) return '🍎';
    return '🍴';
  }

  function handleShare(recipe: Recipe) {
    const text = `🍳 ${recipe.name}
${recipe.description}
⏱️ ${recipe.prep_time_minutes} min
🔥 ${recipe.calories} kcal | ${recipe.protein_g}g P | ${recipe.carbs_g}g C | ${recipe.fat_g}g G
🏪 ${recipe.supermarket}

📝 Ingredientes:
${recipe.ingredients.map(i => `• ${i.item} (${i.amount})`).join("\n")}`;
    
    if (navigator.share) {
      navigator.share({ title: recipe.name, text });
    } else {
      navigator.clipboard.writeText(text);
    }
  }

  const hasActiveFilters = selectedSupermarket || selectedTag || searchQuery;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <ChefHat size={48} className="mx-auto text-zinc-600 mb-4 animate-pulse" />
        <p className="text-zinc-400">Cargando recetas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-amber-400" />
          <h3 className="font-semibold">Recetas</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500">{filteredRecipes.length} recetas</span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-zinc-400"
            }`}
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar por nombre, ingrediente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-amber-500/50 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
          >
            <X size={16} className="text-zinc-500" />
          </button>
        )}
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
              {/* Supermarket filter */}
              <div>
                <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Supermercado</p>
                <div className="flex flex-wrap gap-2">
                  {supermarkets.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSupermarket(selectedSupermarket === s ? null : s)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedSupermarket === s
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-white/5 text-zinc-400 border border-white/10"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags filter */}
              <div>
                <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Etiquetas</p>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 15).map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`px-2 py-1 rounded-full text-xs transition-colors ${
                        selectedTag === tag
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-white/5 text-zinc-500"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <FilterX size={14} />
                  Limpiar filtros
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick filters (horizontal scroll) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => { setSelectedSupermarket(null); setSelectedTag(null); }}
          className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
            !hasActiveFilters
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              : "bg-white/5 text-zinc-400 border border-white/10"
          }`}
        >
          Todas
        </button>
        {supermarkets.map(s => (
          <button
            key={s}
            onClick={() => setSelectedSupermarket(selectedSupermarket === s ? null : s)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              selectedSupermarket === s
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : "bg-white/5 text-zinc-400 border border-white/10"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat size={48} className="mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400">No se encontraron recetas</p>
          <button
            onClick={clearFilters}
            className="mt-2 text-amber-400 text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              onClick={() => router.push(`/recipes/${recipe.id}`)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={recipe.image_url}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLike(recipe.id); }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/30 backdrop-blur-sm transition-transform hover:scale-110"
                >
                  <Heart
                    size={16}
                    className={likedRecipes.has(recipe.id) ? "fill-red-500 text-red-500" : "text-white"}
                  />
                </button>
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-xs border ${getSupermarketColor(recipe.supermarket)}`}>
                  {recipe.supermarket}
                </span>
                <div className="absolute bottom-2 left-2 flex gap-1">
                  <span className="text-sm">{getMealTypeIcon(recipe.tags)}</span>
                </div>
              </div>
              <div className="p-3">
                <p className="font-medium text-sm line-clamp-2 mb-1 leading-tight">{recipe.name}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Flame size={12} className="text-orange-400" />
                    {recipe.calories} kcal
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span>{recipe.protein_g}g P</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recipe detail modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRecipe(null)}
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

              {/* Hero image */}
              <div className="relative h-56">
                <img
                  src={selectedRecipe.image_url}
                  alt={selectedRecipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="px-5 pb-8 space-y-6 -mt-16 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className={`px-2 py-1 rounded-lg text-xs border mb-2 inline-block ${getSupermarketColor(selectedRecipe.supermarket)}`}>
                      {selectedRecipe.supermarket}
                    </span>
                    <h2 className="text-2xl font-bold leading-tight">{selectedRecipe.name}</h2>
                  </div>
                  <button
                    onClick={() => toggleLike(selectedRecipe.id)}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-sm"
                  >
                    <Heart
                      size={20}
                      className={likedRecipes.has(selectedRecipe.id) ? "fill-red-500 text-red-500" : "text-white"}
                    />
                  </button>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <Clock size={18} className="text-cyan-400 mx-auto mb-1" />
                    <p className="text-lg font-bold">{selectedRecipe.prep_time_minutes}</p>
                    <p className="text-xs text-zinc-500">min</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <Flame size={18} className="text-orange-400 mx-auto mb-1" />
                    <p className="text-lg font-bold">{selectedRecipe.calories}</p>
                    <p className="text-xs text-zinc-500">kcal</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <ChefHat size={18} className="text-green-400 mx-auto mb-1" />
                    <p className="text-lg font-bold">{selectedRecipe.protein_g}g</p>
                    <p className="text-xs text-zinc-500">proteína</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <Users size={18} className="text-purple-400 mx-auto mb-1" />
                    <p className="text-lg font-bold">{selectedRecipe.servings}</p>
                    <p className="text-xs text-zinc-500">porciones</p>
                  </div>
                </div>

                {/* Macros bar */}
                <div className="mb-6">
                  <p className="text-sm text-zinc-400 mb-2">Macronutrientes</p>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden flex">
                    <motion.div
                      className="bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedRecipe.protein_g / (selectedRecipe.protein_g + selectedRecipe.carbs_g + selectedRecipe.fat_g)) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                    <motion.div
                      className="bg-yellow-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedRecipe.carbs_g / (selectedRecipe.protein_g + selectedRecipe.carbs_g + selectedRecipe.fat_g)) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                    <motion.div
                      className="bg-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedRecipe.fat_g / (selectedRecipe.protein_g + selectedRecipe.carbs_g + selectedRecipe.fat_g)) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-zinc-500">
                    <span>Proteína {selectedRecipe.protein_g}g</span>
                    <span>Carbos {selectedRecipe.carbs_g}g</span>
                    <span>Grasa {selectedRecipe.fat_g}g</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.tags.slice(0, 5).map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-zinc-400 text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-zinc-400 leading-relaxed">{selectedRecipe.description}</p>

                {/* Ingredients */}
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <ShoppingCart size={18} className="text-amber-400" />
                    Ingredientes
                  </h3>
                  <div className="space-y-2">
                    {selectedRecipe.ingredients.map((ing, i) => (
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
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="font-bold mb-3">Instrucciones</h3>
                  <div className="space-y-4">
                    {selectedRecipe.instructions.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </div>
                        <p className="text-zinc-400 leading-relaxed pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    onClick={() => toggleLike(selectedRecipe.id)}
                    className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                      likedRecipes.has(selectedRecipe.id)
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-white/5 border border-white/10"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart size={18} className={likedRecipes.has(selectedRecipe.id) ? "fill-current" : ""} />
                    {likedRecipes.has(selectedRecipe.id) ? "Guardado" : "Guardar"}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleShare(selectedRecipe)}
                    className="py-3 px-4 rounded-xl bg-white/5 border border-white/10"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Share2 size={18} />
                  </motion.button>

                  {onAddToMealPlan && (
                    <motion.button
                      onClick={() => { onAddToMealPlan(selectedRecipe); setSelectedRecipe(null); }}
                      className="flex-1 py-3 rounded-xl font-medium bg-amber-500 text-black flex items-center justify-center gap-2"
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={18} />
                      Añadir al plan
                    </motion.button>
                  )}
                </div>

                {onAddToShoppingList && (
                  <motion.button
                    onClick={() => { onAddToShoppingList(selectedRecipe); }}
                    className="w-full py-3 rounded-xl font-medium bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center gap-2"
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart size={18} />
                    Añadir ingredientes a lista de compra
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
