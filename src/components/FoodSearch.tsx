"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Plus, Loader2, Barcode, ExternalLink } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface FoodResult {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  imageUrl?: string;
  barcode?: string;
}

interface FoodSearchProps {
  onFoodSelect: (food: FoodResult) => void;
  onClose?: () => void;
}

export function FoodSearch({ onFoodSelect, onClose }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { light, success } = useHaptic();

  const searchFood = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    light();
    
    try {
      const response = await fetch(
        `https://es.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery)}&json=1&page_size=20&fields=code,product_name,brands,nutriments,image_small_url,serving_quantity`
      );
      
      if (!response.ok) throw new Error("Error searching foods");
      
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        const formattedResults: FoodResult[] = data.products
          .filter((p: any) => p.product_name && p.nutriments)
          .slice(0, 10)
          .map((p: any) => ({
            id: p.code || Math.random().toString(),
            name: p.product_name,
            brand: p.brands,
            calories: Math.round(p.nutriments["energy-kcal_100g"] || p.nutriments["energy-kcal"] / 4.184 || 0),
            protein: Math.round((p.nutriments["proteins_100g"] || 0) * 10) / 10,
            carbs: Math.round((p.nutriments["carbohydrates_100g"] || 0) * 10) / 10,
            fat: Math.round((p.nutriments["fat_100g"] || 0) * 10) / 10,
            servingSize: p.serving_quantity ? `${p.serving_quantity}g` : "100g",
            imageUrl: p.image_small_url,
            barcode: p.code,
          }));
        
        setResults(formattedResults);
      } else {
        setResults([]);
        setError("No se encontraron resultados");
      }
    } catch (err) {
      setError("Error al buscar. Intenta de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [light]);

  const handleSelect = (food: FoodResult) => {
    success();
    onFoodSelect(food);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar alimento..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchFood(query)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-500/50 focus:bg-white/10 transition-all"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setResults([]); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
            >
              <X size={16} className="text-zinc-500" />
            </button>
          )}
        </div>
        
        <motion.button
          onClick={() => searchFood(query)}
          disabled={isLoading || !query.trim()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium disabled:opacity-50"
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Buscar"}
        </motion.button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {results.map((food, index) => (
              <motion.div
                key={food.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(food)}
              >
                <div className="flex items-center gap-4">
                  {food.imageUrl ? (
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-14 h-14 rounded-xl object-cover bg-white/5"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center text-2xl">
                      🍎
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{food.name}</p>
                    {food.brand && (
                      <p className="text-sm text-zinc-500 truncate">{food.brand}</p>
                    )}
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-orange-400">{food.calories} kcal</span>
                      <span className="text-xs text-blue-400">{food.protein}g P</span>
                      <span className="text-xs text-yellow-400">{food.carbs}g C</span>
                      <span className="text-xs text-red-400">{food.fat}g G</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {food.barcode && (
                      <Barcode size={14} className="text-zinc-600" />
                    )}
                    <Plus size={20} className="text-green-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && !error && results.length === 0 && query && (
        <div className="text-center py-8 text-zinc-500">
          <p>Escribe y pulsa buscar para encontrar alimentos</p>
          <p className="text-xs mt-2">Usa la base de datos Open Food Facts</p>
        </div>
      )}
    </div>
  );
}
