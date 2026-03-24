"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Search, ChevronRight, Check, Apple, Flame } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface NutrientInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: string;
  category: string;
}

interface NutrientDatabaseProps {
  onSelect?: (item: NutrientInfo) => void;
}

const DATABASE: NutrientInfo[] = [
  // Fruits
  { name: "Manzana", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, servingSize: "1 mediana (182g)", category: "Frutas" },
  { name: "Plátano", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, servingSize: "1 mediano (118g)", category: "Frutas" },
  { name: "Naranja", calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12, servingSize: "1 mediana (131g)", category: "Frutas" },
  { name: "Fresas", calories: 49, protein: 1, carbs: 12, fat: 0.5, fiber: 3, sugar: 7, servingSize: "1 taza (152g)", category: "Frutas" },
  { name: "Aguacate", calories: 234, protein: 2.9, carbs: 12, fat: 21, fiber: 10, sugar: 1, servingSize: "1 medio (100g)", category: "Frutas" },
  
  // Proteins
  { name: "Pollo (pechuga)", calories: 165, protein: 31, carbs: 0, fat: 3.6, sodium: 74, servingSize: "100g cocido", category: "Proteínas" },
  { name: "Huevos", calories: 147, protein: 10, carbs: 1.1, fat: 11, sodium: 140, servingSize: "2 grandes (100g)", category: "Proteínas" },
  { name: "Salmón", calories: 208, protein: 20, carbs: 0, fat: 13, sodium: 59, servingSize: "100g", category: "Proteínas" },
  { name: "Atún", calories: 132, protein: 28, carbs: 0, fat: 1, sodium: 301, servingSize: "100g en lata", category: "Proteínas" },
  { name: "Carne roja (ternera)", calories: 250, protein: 26, carbs: 0, fat: 15, sodium: 72, servingSize: "100g", category: "Proteínas" },
  
  // Carbs
  { name: "Arroz blanco", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, sodium: 1, servingSize: "100g cocido", category: "Carbohidratos" },
  { name: "Arroz integral", calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, servingSize: "100g cocido", category: "Carbohidratos" },
  { name: "Pasta", calories: 131, protein: 5, carbs: 25, fat: 1.1, sodium: 1, servingSize: "100g cocida", category: "Carbohidratos" },
  { name: "Patata", calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, servingSize: "100g", category: "Carbohidratos" },
  { name: "Avena", calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, servingSize: "100g seca", category: "Carbohidratos" },
  
  // Vegetables
  { name: "Brócoli", calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, servingSize: "1 taza (156g)", category: "Verduras" },
  { name: "Espinacas", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, servingSize: "100g", category: "Verduras" },
  { name: "Zanahoria", calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, servingSize: "100g", category: "Verduras" },
  { name: "Tomate", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, servingSize: "100g", category: "Verduras" },
  { name: "Lechuga", calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3, servingSize: "100g", category: "Verduras" },
  
  // Dairy
  { name: "Leche entera", calories: 149, protein: 8, carbs: 12, fat: 8, sodium: 98, servingSize: "1 vaso (244ml)", category: "Lácteos" },
  { name: "Yogur griego", calories: 100, protein: 17, carbs: 6, fat: 0.7, sodium: 65, servingSize: "170g", category: "Lácteos" },
  { name: "Queso cheddar", calories: 403, protein: 25, carbs: 1.3, fat: 33, sodium: 621, servingSize: "100g", category: "Lácteos" },
  { name: "Requesón", calories: 98, protein: 11, carbs: 3.4, fat: 4.3, sodium: 364, servingSize: "100g", category: "Lácteos" },
  
  // Nuts
  { name: "Almendras", calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 13, servingSize: "100g", category: "Frutos secos" },
  { name: "Nueces", calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 7, servingSize: "100g", category: "Frutos secos" },
  { name: "Cacahuetes", calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 9, servingSize: "100g", category: "Frutos secos" },
];

const CATEGORIES = ["Todas", "Frutas", "Proteínas", "Carbohidratos", "Verduras", "Lácteos", "Frutos secos"];

export function NutrientDatabase({ onSelect }: NutrientDatabaseProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [selectedItem, setSelectedItem] = useState<NutrientInfo | null>(null);
  const { light } = useHaptic();

  const filteredItems = DATABASE.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "Todas" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  function handleSelect(item: NutrientInfo) {
    light();
    setSelectedItem(item);
  }

  function confirmSelect() {
    if (selectedItem) {
      light();
      onSelect?.(selectedItem);
      setSelectedItem(null);
      setSearch("");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Database size={18} className="text-green-400" />
        <h3 className="font-semibold">Base de datos nutricional</h3>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input
          type="text"
          placeholder="Buscar alimento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-500/50"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { light(); setCategory(cat); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              category === cat
                ? "bg-green-500 text-white"
                : "bg-white/5 text-zinc-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-zinc-500">{filteredItems.length} alimentos encontrados</p>

      {/* Items list */}
      <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
        {filteredItems.slice(0, 20).map((item) => (
          <motion.button
            key={item.name}
            onClick={() => handleSelect(item)}
            className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-colors ${
              selectedItem?.name === item.name
                ? "bg-green-500/20 border-green-500/30"
                : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <Apple size={24} className="text-green-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-zinc-500">{item.servingSize}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-orange-400">{item.calories}</p>
              <p className="text-xs text-zinc-500">kcal</p>
            </div>
            <ChevronRight size={18} className="text-zinc-600" />
          </motion.button>
        ))}
      </div>

      {/* Selected item detail */}
      {selectedItem && (
        <motion.div
          className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold">{selectedItem.name}</h4>
              <p className="text-sm text-zinc-400">{selectedItem.servingSize}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-400">{selectedItem.calories}</p>
              <p className="text-xs text-zinc-500">kcal</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 rounded-xl bg-white/5">
              <p className="text-sm font-bold text-blue-400">{selectedItem.protein}g</p>
              <p className="text-xs text-zinc-500">Proteína</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/5">
              <p className="text-sm font-bold text-yellow-400">{selectedItem.carbs}g</p>
              <p className="text-xs text-zinc-500">Carbos</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/5">
              <p className="text-sm font-bold text-red-400">{selectedItem.fat}g</p>
              <p className="text-xs text-zinc-500">Grasas</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/5">
              <p className="text-sm font-bold text-green-400">{selectedItem.fiber || 0}g</p>
              <p className="text-xs text-zinc-500">Fibra</p>
            </div>
          </div>

          <motion.button
            onClick={confirmSelect}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Check size={20} />
            Añadir a mi comida
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
