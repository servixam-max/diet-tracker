"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Check, ShoppingCart, Plus, Trash2, Edit3 } from "lucide-react";
import { GenerateShoppingList } from "@/components/GenerateShoppingList";
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

const supermarketColors: Record<string, string> = {
  Mercadona: "bg-red-500",
  Lidl: "bg-blue-500",
  Aldi: "bg-yellow-500",
  "Family Cash": "bg-purple-500",
};

const supermarketBadgeColors: Record<string, string> = {
  Mercadona: "bg-red-500/20 text-red-400 border-red-500/30",
  Lidl: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Aldi: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Family Cash": "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function ShoppingPage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [activeSupermarket, setActiveSupermarket] = useState("Todos");
  const { light, success } = useHaptic();

  const supermarkets = ["Todos", "Mercadona", "Lidl", "Aldi", "Family Cash"];

  const filtered = activeSupermarket === "Todos" 
    ? items 
    : items.filter((i) => i.supermarket === activeSupermarket);

  const pendingItems = filtered.filter((i) => !i.checked);
  const checkedItems = filtered.filter((i) => i.checked);
  const pending = items.filter((i) => !i.checked).length;

  function toggleItem(id: string) {
    light();
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  }

  function deleteItem(id: string) {
    light();
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function addItem(item: ShoppingItem) {
    success();
    setItems((prev) => [...prev, item]);
  }

  async function share() {
    const text = items
      .filter((i) => !i.checked)
      .map((i) => `• ${i.name} - ${i.quantity}${i.unit} (${i.supermarket})`)
      .join("\n");

    if (navigator.share) {
      await navigator.share({ title: "🛒 Lista de la compra", text });
    }
  }

  function handleGenerated(newItems: ShoppingItem[]) {
    setItems(newItems);
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header 
          className="px-5 pt-6 pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center">
                <ShoppingCart size={24} className="text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Lista de la compra</h1>
                <p className="text-sm text-zinc-400">{pending} artículos pendientes</p>
              </div>
            </div>
            
            {items.length > 0 && (
              <motion.button
                onClick={share}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={20} className="text-zinc-400" />
              </motion.button>
            )}
          </div>
          
          {/* Supermarket filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {supermarkets.map((s) => (
              <motion.button
                key={s}
                onClick={() => setActiveSupermarket(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeSupermarket === s 
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30" 
                    : "bg-white/5 border border-white/10 text-zinc-400"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </motion.header>

        {/* Generate from plan */}
        <div className="px-5 mb-4">
          <GenerateShoppingList onGenerated={handleGenerated} />
        </div>

        {/* Items list - scroll enabled */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          {items.length === 0 ? (
            <motion.div
              className="py-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <ShoppingCart size={36} className="text-zinc-500" />
              </div>
              <p className="text-zinc-400 mb-2">Tu lista está vacía</p>
              <p className="text-sm text-zinc-500">Genera desde tu plan semanal o añade artículos manualmente</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Pending items by supermarket */}
              {pendingItems.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                    Pendiente ({pendingItems.length})
                  </h3>
                  {pendingItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      className="group flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <motion.button
                        onClick={() => toggleItem(item.id)}
                        className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                          item.checked 
                            ? "bg-green-500 border-green-500" 
                            : "border-zinc-500/30 hover:border-green-500/50"
                        }`}
                        whileTap={{ scale: 0.9 }}
                      >
                        {item.checked && <Check size={16} className="text-white" />}
                      </motion.button>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-zinc-500">{item.quantity}{item.unit}</p>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${supermarketBadgeColors[item.supermarket] || "bg-white/10 text-zinc-400 border-white/20"}`}>
                        {item.supermarket}
                      </div>
                      
                      <motion.button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Checked items */}
              {checkedItems.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                    Comprados ({checkedItems.length})
                  </h3>
                  {checkedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 opacity-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                    >
                      <motion.button
                        onClick={() => toggleItem(item.id)}
                        className="w-8 h-8 rounded-xl border-2 bg-green-500/20 border-green-500/50 flex items-center justify-center"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Check size={16} className="text-green-400" />
                      </motion.button>
                      
                      <div className="flex-1 min-w-0 line-through">
                        <p className="font-medium text-zinc-400">{item.name}</p>
                        <p className="text-sm text-zinc-500">{item.quantity}{item.unit}</p>
                      </div>
                      
                      <motion.button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 rounded-xl hover:bg-red-500/20"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={16} className="text-zinc-500" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
