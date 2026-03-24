"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, ShoppingCart, Check, Trash2, Share2, Plus, GripVertical } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";
import { Reorder } from "framer-motion";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  supermarket: string;
  category: string;
  checked: boolean;
  recipeId?: string;
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
  "pollo": { name: "Peachuga de pollo", quantity: "600", unit: "g", category: "Proteínas", supermarket: "Mercadona" },
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
  "pavo": { name: "Peachuga de pavo", quantity: "300", unit: "g", category: "Proteínas", supermarket: "Lidl" },
  "arroz integral": { name: "Arroz integral", quantity: "400", unit: "g", category: "Cereales", supermarket: "Lidl" },
};

interface CustomItemInput {
  name: string;
  quantity: string;
  unit: string;
  supermarket: string;
  category: string;
}

export function GenerateShoppingList({ onGenerated }: GenerateShoppingListProps) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [showCustomItem, setShowCustomItem] = useState(false);
  const [customItem, setCustomItem] = useState<CustomItemInput>({
    name: "",
    quantity: "",
    unit: "",
    supermarket: "Mercadona",
    category: "Otros",
  });
  const { success, light } = useHaptic();

  async function generateFromPlan() {
    light();
    setGenerating(true);

    try {
      const response = await fetch("/api/generate-plan");
      if (!response.ok) throw new Error("Error fetching plan");
      
      const data = await response.json();
      const plan = data.plan;

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

      const summedItems: ShoppingItem[] = [];
      let id = 1;

      for (const [ingredient, count] of Object.entries(ingredientCounts)) {
        const mapping = ingredientMapping[ingredient];
        if (mapping) {
          const qty = count > 1 ? String(parseInt(mapping.quantity) * count) : mapping.quantity;
          summedItems.push({
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

      summedItems.sort((a, b) => {
        const aIdx = supermarketPriority.indexOf(a.supermarket);
        const bIdx = supermarketPriority.indexOf(b.supermarket);
        return aIdx - bIdx;
      });

      success();
      setGenerated(true);
      setItems(summedItems);
      onGenerated(summedItems);
    } catch (error) {
      console.error("Error generating shopping list:", error);
    } finally {
      setGenerating(false);
    }
  }

  function toggleItem(id: string) {
    light();
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  }

  function deleteItem(id: string) {
    light();
    setItems(items.filter(item => item.id !== id));
  }

  function addCustomItem() {
    if (!customItem.name.trim()) return;
    
    light();
    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: customItem.name,
      quantity: customItem.quantity || "1",
      unit: customItem.unit || "ud",
      supermarket: customItem.supermarket,
      category: customItem.category,
      checked: false,
    };
    setItems([...items, item]);
    setCustomItem({ name: "", quantity: "", unit: "", supermarket: "Mercadona", category: "Otros" });
    setShowCustomItem(false);
    success();
  }

  async function shareList() {
    light();
    const text = items.map(i => `${i.checked ? '✓' : '○'} ${i.name} (${i.quantity} ${i.unit})`).join('\n');
    
    if (navigator.share) {
      try {
        await navigator.share({ 
          title: 'Mi lista de compra', 
          text,
        });
        success();
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      await navigator.clipboard.writeText(text);
      success();
    }
  }

  function groupBySupermarket() {
    const grouped: Record<string, ShoppingItem[]> = {};
    items.forEach(item => {
      if (!grouped[item.supermarket]) {
        grouped[item.supermarket] = [];
      }
      grouped[item.supermarket].push(item);
    });
    return grouped;
  }

  function sumDuplicates() {
    const summed: Record<string, ShoppingItem> = {};
    items.forEach(item => {
      const key = `${item.name.toLowerCase()}-${item.supermarket}`;
      if (summed[key]) {
        const currentQty = parseInt(summed[key].quantity);
        const newQty = parseInt(item.quantity);
        summed[key].quantity = String(currentQty + newQty);
      } else {
        summed[key] = { ...item };
      }
    });
    return Object.values(summed);
  }

  const groupedItems = groupBySupermarket();
  const summedItems = sumDuplicates();
  const uncheckedCount = items.filter(item => !item.checked).length;

  return (
    <div className="space-y-4">
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

      <AnimatePresence>
        {generated && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-emerald-400" />
                <h3 className="font-semibold">Lista de la compra</h3>
              </div>
              <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                {uncheckedCount} pendientes
              </span>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={shareList}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-medium flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
              >
                <Share2 size={18} />
                Compartir
              </motion.button>
              <motion.button
                onClick={() => { light(); setShowCustomItem(true); }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={18} />
                Añadir
              </motion.button>
            </div>

            <AnimatePresence>
              {showCustomItem && (
                <motion.div
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={customItem.name}
                    onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Cantidad"
                      value={customItem.quantity}
                      onChange={(e) => setCustomItem({ ...customItem, quantity: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50"
                    />
                    <input
                      type="text"
                      placeholder="Unidad"
                      value={customItem.unit}
                      onChange={(e) => setCustomItem({ ...customItem, unit: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={customItem.supermarket}
                      onChange={(e) => setCustomItem({ ...customItem, supermarket: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50"
                    >
                      {supermarketPriority.map(sm => (
                        <option key={sm} value={sm}>{sm}</option>
                      ))}
                    </select>
                    <select
                      value={customItem.category}
                      onChange={(e) => setCustomItem({ ...customItem, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50"
                    >
                      <option value="Proteínas">Proteínas</option>
                      <option value="Cereales">Cereales</option>
                      <option value="Verduras">Verduras</option>
                      <option value="Frutas">Frutas</option>
                      <option value="Lácteos">Lácteos</option>
                      <option value="Panadería">Panadería</option>
                      <option value="Legumbres">Legumbres</option>
                      <option value="Frutos secos">Frutos secos</option>
                      <option value="Suplementos">Suplementos</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => { light(); setShowCustomItem(false); }}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400"
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      onClick={addCustomItem}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium"
                      whileTap={{ scale: 0.98 }}
                    >
                      Añadir
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {supermarketPriority
                .filter(sm => groupedItems[sm] && groupedItems[sm].length > 0)
                .map(supermarket => (
                  <div key={supermarket}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <p className="text-sm font-semibold text-emerald-400">{supermarket}</p>
                      <span className="text-xs text-zinc-500">
                        ({groupedItems[supermarket].filter(i => !i.checked).length} pendientes)
                      </span>
                    </div>
                    <Reorder.Group
                      axis="y"
                      values={groupedItems[supermarket]}
                      onReorder={(newItems) => {
                        const updated = [...items];
                        const smItems = groupedItems[supermarket];
                        const otherItems = updated.filter(i => i.supermarket !== supermarket);
                        const newSmItems = newItems.map(r => {
                          const orig = smItems.find(i => i.id === r.id);
                          return orig ? { ...orig, ...r } : r;
                        });
                        setItems([...otherItems, ...newSmItems]);
                      }}
                      className="space-y-1"
                    >
                      {groupedItems[supermarket].map((item, index) => (
                        <Reorder.Item
                          key={item.id}
                          value={item}
                          id={item.id}
                          className="relative"
                        >
                          <motion.div
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                              item.checked 
                                ? "bg-green-500/5 border border-green-500/20" 
                                : "bg-white/5 border border-white/5"
                            }`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="cursor-grab active:cursor-grabbing text-zinc-600">
                              <GripVertical size={16} />
                            </div>
                            
                            <button
                              onClick={() => toggleItem(item.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                item.checked 
                                  ? "bg-green-500 border-green-500" 
                                  : "border-zinc-600 hover:border-green-500"
                              }`}
                            >
                              {item.checked && <Check size={14} className="text-white" />}
                            </button>
                            
                            <div className="flex-1">
                              <p className={`font-medium ${item.checked ? "line-through text-zinc-500" : ""}`}>
                                {item.name}
                              </p>
                              <p className="text-xs text-zinc-500">{item.quantity} {item.unit}</p>
                            </div>

                            <motion.button
                              onClick={() => deleteItem(item.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          </motion.div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
