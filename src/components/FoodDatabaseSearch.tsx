"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Database, Barcode, Camera, X } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  servingSize: string;
  category: string;
  barcode?: string;
}

interface FoodDatabaseSearchProps {
  onSelect: (food: FoodItem) => void;
  onClose?: () => void;
}

const CATEGORIES = [
  { id: "all", label: "Todos", emoji: "🍽️" },
  { id: "fruits", label: "Frutas", emoji: "🍎" },
  { id: "proteins", label: "Proteínas", emoji: "🍗" },
  { id: "dairy", label: "Lácteos", emoji: "🧀" },
  { id: "grains", label: "Cereales", emoji: "🍞" },
  { id: "vegetables", label: "Verduras", emoji: "🥦" },
  { id: "snacks", label: "Snacks", emoji: "🍿" },
  { id: "drinks", label: "Bebidas", emoji: "🥤" },
];

// Local cache simulating OpenFoodFacts data
const LOCAL_FOODS: FoodItem[] = [
  { id: "1", name: "Manzana golden", brand: "Mercadona", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4, servingSize: "1 unidad (180g)", category: "fruits" },
  { id: "2", name: "Plátano ecológico", brand: "Bio", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3, servingSize: "1 unidad (120g)", category: "fruits" },
  { id: "3", name: "Yogur natural", brand: "Danone", calories: 85, protein: 6, carbs: 8, fat: 3, servingSize: "1 unidad (125g)", category: "dairy" },
  { id: "4", name: "Yogur griego 0%", brand: "Danone", calories: 55, protein: 10, carbs: 4, fat: 0, servingSize: "1 unidad (125g)", category: "dairy" },
  { id: "5", name: "Pechuga de pollo", brand: "Mercadona", calories: 110, protein: 23, carbs: 0, fat: 1, servingSize: "100g", category: "proteins" },
  { id: "6", name: "Arroz blanco", brand: "SOS", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, servingSize: "100g cocido", category: "grains" },
  { id: "7", name: "Huevos camperos", brand: "El Puerto", calories: 155, protein: 13, carbs: 1.1, fat: 11, servingSize: "100g (2 huevos)", category: "proteins" },
  { id: "8", name: "Avena integral", brand: "Hacendado", calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, servingSize: "100g seca", category: "grains" },
  { id: "9", name: "Brócoli fresco", brand: "Mercadona", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, servingSize: "100g", category: "vegetables" },
  { id: "10", name: "Atún en lata", brand: "Calvo", calories: 132, protein: 28, carbs: 0, fat: 1.2, servingSize: "100g escurrido", category: "proteins" },
  { id: "11", name: "Leche semidesnatada", brand: "Pascual", calories: 45, protein: 3.2, carbs: 4.8, fat: 1.5, servingSize: "100ml", category: "dairy" },
  { id: "12", name: "Pan integral", brand: "Bimbo", calories: 230, protein: 8, carbs: 42, fat: 3, fiber: 6, servingSize: "100g (2 rebanadas)", category: "grains" },
  { id: "13", name: "Almendras", brand: "C忙着", calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 13, servingSize: "100g", category: "snacks" },
  { id: "14", name: "Zumo de naranja", brand: "Trident", calories: 45, protein: 0.7, carbs: 10, fat: 0.2, servingSize: "100ml", category: "drinks" },
  { id: "15", name: "Patata", brand: "Mercadona", calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, servingSize: "100g", category: "vegetables" },
  { id: "16", name: "Aguacate", brand: "Mercadona", calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, servingSize: "100g (medio)", category: "fruits" },
  { id: "17", name: "Queso fresco 0%", brand: "Hacendado", calories: 62, protein: 10, carbs: 3, fat: 0, servingSize: "100g", category: "dairy" },
  { id: "18", name: "Salmón ahumado", brand: "Nobel", calories: 217, protein: 20, carbs: 0, fat: 14, servingSize: "100g", category: "proteins" },
  { id: "19", name: "Galletas integrales", brand: "Cuétara", calories: 440, protein: 7, carbs: 66, fat: 17, fiber: 5, servingSize: "100g (6 galletas)", category: "snacks" },
  { id: "20", name: "Espinacas congeladas", brand: "Mercadona", calories: 26, protein: 3, carbs: 3, fat: 0.5, fiber: 2, servingSize: "100g", category: "vegetables" },
];

export function FoodDatabaseSearch({ onSelect, onClose }: FoodDatabaseSearchProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [results, setResults] = useState<FoodItem[]>(LOCAL_FOODS);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { light } = useHaptic();

  useEffect(() => {
    // Simulate API search delay
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = LOCAL_FOODS;
      
      if (search) {
        filtered = filtered.filter(
          (f) =>
            f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.brand?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (category !== "all") {
        filtered = filtered.filter((f) => f.category === category);
      }
      
      setResults(filtered);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search, category]);

  function handleSelect(food: FoodItem) {
    light();
    onSelect(food);
  }

  return (
    <div className="space-y-4">
      {/* Search header */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-500/50 text-lg"
          />
        </div>
        <motion.button
          onClick={() => { light(); setShowFilters(!showFilters); }}
          className={`p-4 rounded-2xl ${showFilters ? "bg-green-500 text-white" : "bg-white/5"}`}
          whileTap={{ scale: 0.95 }}
        >
          <Filter size={20} />
        </motion.button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { light(); setCategory(cat.id); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              category === cat.id
                ? "bg-green-500 text-white"
                : "bg-white/5 text-zinc-400"
            }`}
          >
            <span>{cat.emoji}</span>
            <span className="text-sm">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {loading ? "Buscando..." : `${results.length} resultados`}
        </p>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Database size={12} />
          <span>Base de datos local</span>
        </div>
      </div>

      {/* Results list */}
      <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="text-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-8 h-8 border-4 border-white/20 border-t-green-500 rounded-full mx-auto"
            />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-8">
            <Search size={48} className="mx-auto mb-3 text-zinc-600" />
            <p className="text-zinc-400">No se encontraron resultados</p>
            <p className="text-sm text-zinc-500">Prueba con otro término de búsqueda</p>
          </div>
        ) : (
          results.map((food) => (
            <motion.button
              key={food.id}
              onClick={() => handleSelect(food)}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{food.name}</p>
                  {food.brand && (
                    <p className="text-xs text-zinc-500">{food.brand}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-400">{food.calories}</p>
                  <p className="text-xs text-zinc-500">kcal</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mb-2">{food.servingSize}</p>
              <div className="flex gap-3 text-xs">
                <span className="text-blue-400">P: {food.protein}g</span>
                <span className="text-yellow-400">C: {food.carbs}g</span>
                <span className="text-red-400">G: {food.fat}g</span>
                {food.fiber && <span className="text-green-400">F: {food.fiber}g</span>}
              </div>
            </motion.button>
          ))
        )}
      </div>

      {/* Offline notice */}
      <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
        💡 Base de datos local: {LOCAL_FOODS.length} alimentos. Para buscar más productos, conecta a internet para acceder a OpenFoodFacts.
      </div>
    </div>
  );
}
