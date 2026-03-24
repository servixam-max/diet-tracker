"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Check, Trash2, Copy, Share2 } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
  quantity: string;
}

interface ShoppingListProps {
  userId: string;
}

export function ShoppingList({ userId }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: "1", name: "Pechuga de pollo", category: "Proteína", checked: false, quantity: "500g" },
    { id: "2", name: "Arroz integral", category: "Carbos", checked: false, quantity: "1kg" },
    { id: "3", name: "Brócoli", category: "Vegetales", checked: false, quantity: "2 unidades" },
    { id: "4", name: "Huevos", category: "Proteína", checked: true, quantity: "12" },
    { id: "5", name: "Aguacate", category: "Grasas", checked: false, quantity: "3 unidades" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", category: "Otros" });
  const { light, success } = useHaptic();

  function toggleItem(id: string) {
    light();
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  }

  function addItem() {
    if (!newItem.name.trim()) return;
    
    light();
    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category,
      checked: false,
      quantity: newItem.quantity || "1",
    };
    setItems([...items, item]);
    setNewItem({ name: "", quantity: "", category: "Otros" });
    setShowAdd(false);
    success();
  }

  function removeItem(id: string) {
    light();
    setItems(items.filter(item => item.id !== id));
  }

  function copyList() {
    light();
    const text = items
      .filter(item => !item.checked)
      .map(item => `☐ ${item.name} (${item.quantity})`)
      .join("\n");
    navigator.clipboard.writeText(text);
    success();
  }

  const categories = [...new Set(items.map(item => item.category))];
  const uncheckedCount = items.filter(item => !item.checked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-emerald-400" />
          <h3 className="font-semibold">Lista de la compra</h3>
        </div>
        <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
          {uncheckedCount} pendientes
        </span>
      </div>

      <div className="space-y-3">
        {categories.map(category => (
          <div key={category}>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{category}</p>
            <div className="space-y-1">
              <AnimatePresence>
                {items
                  .filter(item => item.category === category)
                  .map((item, index) => (
                    <motion.div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        item.checked 
                          ? "bg-green-500/5 border border-green-500/20" 
                          : "bg-white/5 border border-white/5"
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
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
                        <p className="text-xs text-zinc-500">{item.quantity}</p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              type="text"
              placeholder="Nombre del producto"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Cantidad"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50"
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-emerald-500/50"
              >
                <option value="Proteína">Proteína</option>
                <option value="Carbos">Carbos</option>
                <option value="Vegetales">Vegetales</option>
                <option value="Frutas">Frutas</option>
                <option value="Lácteos">Lácteos</option>
                <option value="Grasas">Grasas</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => { light(); setShowAdd(false); }}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400"
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>
              <motion.button
                onClick={addItem}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium"
                whileTap={{ scale: 0.98 }}
              >
                Añadir
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-2">
        <motion.button
          onClick={() => { light(); setShowAdd(true); }}
          className="py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium flex items-center justify-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          Añadir item
        </motion.button>
        <motion.button
          onClick={copyList}
          className="py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-medium flex items-center justify-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          <Copy size={18} />
          Copiar lista
        </motion.button>
      </div>
    </div>
  );
}
