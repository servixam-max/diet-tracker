"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Check, Trash2, Copy, Share2, Pencil } from "lucide-react";
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
  const { light, medium, warning } = useHaptic();

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
                    <SwipeableShoppingItem
                      key={item.id}
                      item={item}
                      index={index}
                      onToggle={() => toggleItem(item.id)}
                      onEdit={() => {}}
                      onDelete={() => removeItem(item.id)}
                      light={light}
                      medium={medium}
                      warning={warning}
                    />
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

function SwipeableShoppingItem({ item, index, onToggle, onEdit, onDelete, light, medium, warning }: {
  item: ShoppingItem;
  index: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  light: () => void;
  medium: () => void;
  warning: () => void;
}) {
  const [dragOffset, setDragOffset] = useState(0);

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Swipe actions background */}
      <div className="absolute inset-0 flex">
        {/* Edit action (right swipe - blue) */}
        <motion.div 
          className="flex-1 bg-blue-500/20 flex items-center justify-start pl-4"
          initial={{ x: "-100%" }}
        >
          <motion.button
            className="flex items-center gap-2 text-blue-400 text-sm"
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); medium(); onEdit(); }}
          >
            <Pencil size={16} />
            Editar
          </motion.button>
        </motion.div>
        
        {/* Delete action (left swipe - red) */}
        <motion.div 
          className="flex-1 bg-red-500/20 flex items-center justify-end pr-4"
          initial={{ x: "100%" }}
        >
          <motion.button
            className="flex items-center gap-2 text-red-400 text-sm"
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); warning(); onDelete(); }}
          >
            Eliminar
            <Trash2 size={16} />
          </motion.button>
        </motion.div>
      </div>

      {/* Main item content */}
      <motion.div
        className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-grab active:cursor-grabbing ${
          item.checked 
            ? "bg-green-500/5 border border-green-500/20" 
            : "bg-white/5 border border-white/5"
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ delay: index * 0.05 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={(e, info) => setDragOffset(info.offset.x)}
        onDragEnd={(e, info) => {
          if (info.offset.x > 80) {
            medium();
            onEdit();
          } else if (info.offset.x < -80) {
            warning();
            onDelete();
          }
          setDragOffset(0);
        }}
        style={{ x: dragOffset }}
      >
        <button
          onClick={() => { light(); onToggle(); }}
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
          onClick={(e) => { e.stopPropagation(); light(); removeItem(item.id); }}
          className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </motion.div>
    </div>
  );
}

function removeItem(id: string) {
  // This is handled by the parent component
}
