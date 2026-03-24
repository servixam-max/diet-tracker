"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, ShoppingCart, Check } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  supermarket: string;
  category: string;
  checked: boolean;
}

interface GenerateShoppingListProps {
  onGenerated: (items: ShoppingItem[]) => void;
}

const supermarketPriority = ["Mercadona", "Lidl", "Aldi", "Family Cash"];

const ingredientMapping: Record<string, { name: string; quantity: string; unit: string; category: string; supermarket: string }> = {
  "avena": { name: "Avena", quantity: "500", unit: "g", category: "Cereales", supermarket: "Mercadona" },
  "plátano": { name: "Plátano", quantity: "3", unit: "ud", category: "Frutas", supermarket: "Mercadona" },
  "miel": { name: "Miel", quantity: "250", unit: "g", category: "Dulces", supermarket: "Mercadona" },
  "yogur griego": { name: "Yogur griego", quantity: "4", unit: "ud", category: "Lácteos", supermarket: "Mercadona" },
  "granola": { name: "Granola", quantity: "300", unit: "g", category: "Cereales", supermarket: "Lidl" },
  "pan integral": { name: "Pan integral", quantity: "1", unit: "ud", category: "Panadería", supermarket: "Mercadona" },
  "aguacate": { name: "Aguacate", quantity: "2", unit: "ud", category: "Frutas", supermarket: "Lidl" },
  "huevos": { name: "Huevos", quantity: "12", unit: "ud", category: "Proteínas", supermarket: "Mercadona" },
  "jamón": { name: "Jamón york", quantity: "200", unit: "g", category: "Proteínas", supermarket: "Mercadona" },
  "frutos rojos": { name: "Frutos rojos", quantity: "250", unit: "g", category: "Frutas", supermarket: "Lidl" },
  "tomate": { name: "Tomate", quantity: "4", unit: "ud", category: "Verduras", supermarket: "Mercadona" },
  "pollo": { name: "Pechuga de pollo", quantity: "600", unit: "g", category: "Proteínas", supermarket: "Mercadona" },
  "quinoa": { name: "Quinoa", quantity: "400", unit: "g", category: "Cereales", supermarket: "Lidl" },
  "salmón": { name: "Salmón", quantity: "400", unit: "g", category: "Proteínas", supermarket: "Lidl" },
  "verduras": { name: "Verduras variadas", quantity: "500", unit: "g", category: "Verduras", supermarket: "Mercadona" },
  "lechuga": { name: "Lechuga", quantity: "1", unit: "ud", category: "Verduras", supermarket: "Mercadona" },
  "queso": { name: "Queso parmesano", quantity: "100", unit: "g", category: "Lácteos", supermarket: "Lidl" },
  "pasta integral": { name: "Pasta integral", quantity: "400", unit: "g", category: "Cereales", supermarket: "Mercadona" },
  "atún": { name: "Atún fresco", quantity: "300", unit: "g", category: "Proteínas", supermarket: "Mercadona" },
  "arroz": { name: "Arroz", quantity: "500", unit: "g", category: "Cereales", supermarket: "Mercadona" },
  "tofu": { name: "Tofu", quantity: "300", unit: "g", category: "Proteínas", supermarket: "Lidl" },
  "lentejas": { name: "Lentejas", quantity: "500", unit: "g", category: "Legumbres", supermarket: "Mercadona" },
  "manzana": { name: "Manzana", quantity: "4", unit: "ud", category: "Frutas", supermarket: "Mercadona" },
  "almendras": { name: "Almendras", quantity: "150", unit: "g", category: "Frutos secos", supermarket: "Aldi" },
  "nueces": { name: "Nueces", quantity: "100", unit: "g", category: "Frutos secos", supermarket: "Aldi" },
  "zanahoria": { name: "Zanahoria", quantity: "500", unit: "g", category: "Verduras", supermarket: "Mercadona" },
  "proteína": { name: "Proteína en polvo", quantity: "1", unit: "ud", category: "Suplementos", supermarket: "Family Cash" },
  "leche": { name: "Leche", quantity: "1", unit: "L", category: "Lácteos", supermarket: "Mercadona" },
  "brócoli": { name: "Brócoli", quantity: "1", unit: "ud", category: "Verduras", supermarket: "Mercadona" },
  "patatas": { name: "Patatas", quantity: "1", unit: "kg", category: "Verduras", supermarket: "Mercadona" },
  "merluza": { name: "Merluza", quantity: "400", unit: "g", category: "Proteínas", supermarket: "Lidl" },
  "gambas": { name: "Gambas", quantity: "300", unit: "g", category: "Proteínas", supermarket: "Mercadona" },
  "calabacín": { name: "Calabacín", quantity: "2", unit: "ud", category: "Verduras", supermarket: "Mercadona" },
  "pan": { name: "Pan", quantity: "1", unit: "ud", category: "Panadería", supermarket: "Mercadona" },
  "pavo": { name: "Pechuga de pavo", quantity: "300", unit: "g", category: "Proteínas", supermarket: "Lidl" },
  "arroz integral": { name: "Arroz integral", quantity: "400", unit: "g", category: "Cereales", supermarket: "Lidl" },
};

export function GenerateShoppingList({ onGenerated }: GenerateShoppingListProps) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const { success, light } = useHaptic();

  async function generateFromPlan() {
    light();
    setGenerating(true);

    try {
      // Fetch the weekly plan
      const response = await fetch("/api/generate-plan");
      if (!response.ok) throw new Error("Error fetching plan");
      
      const data = await response.json();
      const plan = data.plan;

      // Extract ingredients from plan
      const ingredientCounts: Record<string, number> = {};
      
      plan?.forEach((day: any) => {
        day.meals?.forEach((meal: any) => {
          meal.ingredients?.forEach((ingredient: string) => {
            const normalized = ingredient.toLowerCase();
            if (ingredientCounts[normalized]) {
              ingredientCounts[normalized]++;
            } else {
              ingredientCounts[normalized] = 1;
            }
          });
        });
      });

      // Map to shopping items
      const items: ShoppingItem[] = [];
      let id = 1;

      for (const [ingredient, count] of Object.entries(ingredientCounts)) {
        const mapping = ingredientMapping[ingredient];
        if (mapping) {
          // Scale quantity based on count
          const qty = count > 1 ? String(parseInt(mapping.quantity) * count) : mapping.quantity;
          items.push({
            id: String(id++),
            name: mapping.name,
            quantity: qty,
            unit: mapping.unit,
            supermarket: mapping.supermarket,
            category: mapping.category,
            checked: false,
          });
        }
      }

      // Sort by supermarket
      items.sort((a, b) => {
        const aIdx = supermarketPriority.indexOf(a.supermarket);
        const bIdx = supermarketPriority.indexOf(b.supermarket);
        return aIdx - bIdx;
      });

      success();
      setGenerated(true);
      onGenerated(items);
    } catch (error) {
      console.error("Error generating shopping list:", error);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <motion.button
      onClick={generateFromPlan}
      disabled={generating || generated}
      className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
        generated 
          ? "bg-green-500/20 text-green-400 border border-green-500/30" 
          : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
      }`}
      whileTap={{ scale: 0.98 }}
    >
      {generating ? (
        <>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
            <Loader2 size={22} />
          </motion.div>
          Generando...
        </>
      ) : generated ? (
        <>
          <Check size={22} />
          Generado ✓
        </>
      ) : (
        <>
          <Sparkles size={22} />
          Generar desde plan semanal
        </>
      )}
    </motion.button>
  );
}
