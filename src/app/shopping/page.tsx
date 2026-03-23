"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Check, ShoppingCart, Plus } from "lucide-react";

const sampleList = [
  { id: "1", name: "Huevos", quantity: "12", unit: "ud", supermarket: "Mercadona", checked: false, category: "Proteínas" },
  { id: "2", name: "Patatas", quantity: "1", unit: "kg", supermarket: "Mercadona", checked: false, category: "Verduras" },
  { id: "3", name: "Cebolla", quantity: "2", unit: "ud", supermarket: "Mercadona", checked: true, category: "Verduras" },
  { id: "4", name: "Pollo", quantity: "500", unit: "g", supermarket: "Lidl", checked: false, category: "Proteínas" },
  { id: "5", name: "Lechuga", quantity: "1", unit: "ud", supermarket: "Lidl", checked: false, category: "Verduras" },
  { id: "6", name: "Yogur", quantity: "4", unit: "ud", supermarket: "Aldi", checked: false, category: "Lácteos" },
  { id: "7", name: "Arroz", quantity: "500", unit: "g", supermarket: "Family Cash", checked: true, category: "Cereales" },
];

const supermarkets = ["Todos", "Mercadona", "Lidl", "Aldi", "Family Cash"];

const supermarketColors: Record<string, string> = {
  Mercadona: "bg-red-500",
  Lidl: "bg-blue-500",
  Aldi: "bg-yellow-500",
  "Family Cash": "bg-purple-500",
};

export default function ShoppingPage() {
  const [items, setItems] = useState(sampleList);
  const [activeSupermarket, setActiveSupermarket] = useState("Todos");
  const [showShareModal, setShowShareModal] = useState(false);

  const filtered = activeSupermarket === "Todos" 
    ? items 
    : items.filter((i) => i.supermarket === activeSupermarket);

  const pendingItems = filtered.filter((i) => !i.checked);
  const checkedItems = filtered.filter((i) => i.checked);
  const pending = items.filter((i) => !i.checked).length;

  function toggleItem(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  }

  async function share() {
    const text = items
      .filter((i) => !i.checked)
      .map((i) => `• ${i.name} - ${i.quantity}${i.unit} (${i.supermarket})`)
      .join("\n");

    if (navigator.share) {
      await navigator.share({ title: "🛒 Lista de la compra", text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("¡Lista copiada al portapapeles!");
    }
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
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold">Lista</h1>
            <motion.button
              onClick={share}
              className="p-3 rounded-2xl glass-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={20} className="text-green-400" />
            </motion.button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>{pending} artículos pendientes</span>
          </div>
        </motion.header>

        {/* Filters */}
        <div className="px-5 pb-4">
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
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
          {/* Pending items */}
          <AnimatePresence mode="popLayout">
            {pendingItems.map((item, i) => (
              <motion.button
                key={item.id}
                layout
                onClick={() => toggleItem(item.id)}
                className="w-full mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="relative p-4 rounded-2xl glass-card">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        false ? "border-green-400 bg-green-400" : "border-zinc-600"
                      }`}
                    >
                      <Check size={14} className="text-black opacity-0" />
                    </motion.div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-zinc-500">
                        {item.quantity}{item.unit} • {item.supermarket}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${supermarketColors[item.supermarket]}`} />
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Checked items */}
          {checkedItems.length > 0 && (
            <>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-4 mb-2">Completados</p>
              <AnimatePresence>
                {checkedItems.map((item) => (
                  <motion.button
                    key={item.id}
                    layout
                    onClick={() => toggleItem(item.id)}
                    className="w-full mb-2 opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="relative p-4 rounded-2xl glass-card">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-6 h-6 rounded-full border-2 border-green-400 bg-green-400 flex items-center justify-center"
                        >
                          <Check size={14} className="text-black" />
                        </motion.div>
                        <div className="flex-1 text-left">
                          <p className="font-medium line-through">{item.name}</p>
                          <p className="text-xs text-zinc-500">
                            {item.quantity}{item.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Generate button */}
        <div className="px-5 pb-6">
          <motion.button
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCart size={20} />
            <span>Generar desde plan</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
