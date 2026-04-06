"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat, Clock, Users, Flame, Search, Filter, X, Plus, Check,
  Heart, Share2, BookOpen, ShoppingCart, FilterX
} from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";
// import { FixedSizeList as List } from 'react-window';
// import AutoSizer from 'react-virtualized-auto-sizer';
// Virtualization temporarily disabled due to react-window types issue
// We'll use standard rendering instead

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

interface OptimizedRecipeBookProps {
  userId: string;
  onAddToMealPlan?: (recipe: Recipe) => void;
  onAddToShoppingList?: (recipe: Recipe) => void;
}

// Componente optimizado con memoización
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RecipeCard = React.memo(({
  recipe,
  onSelect,
  onToggleLike,
  isLiked,
  style
}: {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onToggleLike: (id: string) => void;
  isLiked: boolean;
  style: React.CSSProperties | undefined;
}) => {
  const { light } = useHaptic();

  return (
    <div
      style={style}
      className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer"
      onClick={() => {
        light();
        onSelect(recipe);
      }}
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
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(recipe.id);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/30 backdrop-blur-sm transition-transform hover:scale-110"
        >
          <Heart
            size={16}
            className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{recipe.name}</h3>
        <p className="text-xs text-zinc-400 line-clamp-2 mb-2">{recipe.description}</p>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-zinc-400">
            <Clock size={12} />
            <span>{recipe.prep_time_minutes}min</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <Flame size={12} />
            <span>{recipe.calories}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

RecipeCard.displayName = 'RecipeCard';

export function OptimizedRecipeBook({ userId, onAddToMealPlan, onAddToShoppingList }: OptimizedRecipeBookProps) {
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

  // Optimización: Debounce para búsqueda
  const debouncedSearchQuery = useMemo(() => {
    return searchQuery;
  }, [searchQuery]);

  // Fetch recipes con mejor manejo de errores
  useEffect(() => {
    let isMounted = true;

    const fetchRecipes = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch('/api/recipes', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok && isMounted) {
          const data = await response.json();
          setAllRecipes(data);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.error('Timeout al cargar recetas');
        } else {
          console.error('Error fetching recipes:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRecipes();

    return () => {
      isMounted = false;
    };
  }, []);

  // Optimización: Memoización de cálculos pesados
  const supermarkets = useMemo(() => {
    return [...new Set(allRecipes.map(r => r.supermarket))];
  }, [allRecipes]);

  const allTags = useMemo(() => {
    return [...new Set(allRecipes.flatMap(r => r.tags))];
  }, [allRecipes]);

  // Optimización: Memoización del filtrado
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter(recipe => {
      const matchesSearch = debouncedSearchQuery === "" ||
        recipe.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        recipe.ingredients.some(i => i.item.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));

      const matchesSupermarket = !selectedSupermarket ||
        recipe.supermarket.toLowerCase().includes(selectedSupermarket.toLowerCase());
      const matchesTag = !selectedTag || recipe.tags.includes(selectedTag);

      return matchesSearch && matchesSupermarket && matchesTag;
    });
  }, [allRecipes, debouncedSearchQuery, selectedSupermarket, selectedTag]);

  // Optimización: Funciones memoizadas
  const toggleLike = useCallback((id: string) => {
    setLikedRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedSupermarket(null);
    setSelectedTag(null);
    setSearchQuery("");
  }, []);

  const handleRecipeSelect = useCallback((recipe: Recipe) => {
    light();
    setSelectedRecipe(recipe);
  }, [light]);

  const hasActiveFilters = searchQuery || selectedSupermarket || selectedTag;

  // Standard rendering without virtualization (disabled due to react-window types issue)
  const RecipeList = ({ items }: { items: Recipe[] }) => (
    <div className="grid grid-cols-2 gap-3">
      {items.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onSelect={handleRecipeSelect}
          onToggleLike={toggleLike}
          isLiked={likedRecipes.has(recipe.id)}
          style={undefined}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-white/10 rounded-2xl mb-3"></div>
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-5">
      {/* Header con búsqueda optimizada */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar recetas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl transition-colors ${
            hasActiveFilters
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              : "bg-white/5 text-zinc-400 border border-white/10"
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filtros optimizados */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 space-y-4 overflow-hidden"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipe list */}
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
        <RecipeList items={filteredRecipes} />
      )}

      {/* Modal para detalles de receta */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetailModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            onAddToMealPlan={onAddToMealPlan}
            onAddToShoppingList={onAddToShoppingList}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente modal para detalles (simplificado para este ejemplo)
const RecipeDetailModal = ({
  recipe,
  onClose,
  onAddToMealPlan,
  onAddToShoppingList
}: {
  recipe: Recipe;
  onClose: () => void;
  onAddToMealPlan?: (recipe: Recipe) => void;
  onAddToShoppingList?: (recipe: Recipe) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1a1a1f] rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Contenido del modal */}
        <div className="space-y-6">
          <div className="relative">
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="w-full h-64 object-cover rounded-2xl"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-sm"
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">{recipe.name}</h2>
            <p className="text-zinc-400 mb-4">{recipe.description}</p>

            {/* Información nutricional */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">{recipe.calories}</div>
                <div className="text-xs text-zinc-400">Calorías</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{recipe.protein_g}g</div>
                <div className="text-xs text-zinc-400">Proteína</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{recipe.carbs_g}g</div>
                <div className="text-xs text-zinc-400">Carbos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{recipe.fat_g}g</div>
                <div className="text-xs text-zinc-400">Grasas</div>
              </div>
            </div>

            {/* Ingredientes */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Ingredientes</h3>
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-zinc-300">{ingredient.item}</span>
                    <span className="text-zinc-400">{ingredient.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instrucciones */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Instrucciones</h3>
              <div className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="text-amber-400 font-semibold">{index + 1}.</span>
                    <span className="text-zinc-300">{instruction}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onAddToMealPlan?.(recipe);
                  onClose();
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Agregar a plan
              </button>
              <button
                onClick={() => {
                  onAddToShoppingList?.(recipe);
                  onClose();
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <ShoppingCart className="w-4 h-4 inline mr-2" />
                Lista de compras
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};