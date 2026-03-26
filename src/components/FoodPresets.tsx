"use client";

import { memo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHaptic } from "@/hooks/useHaptic";
import { Heart, Plus, Edit2, Trash2, X, Save, Utensils } from "lucide-react";
import type { FoodResult } from "./add-food/types";

interface FoodPresetsProps {
  mealType: string;
  onAddFood: (result: FoodResult) => void;
  userId?: string;
}

interface CustomPreset {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
  isFavorite: boolean;
  createdAt: number;
}

function FoodPresetsComponent({ mealType, onAddFood, userId }: FoodPresetsProps) {
  const { medium, light } = useHaptic();
  const [presets, setPresets] = useState<CustomPreset[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPreset, setNewPreset] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    emoji: "🍽️",
  });

  // Load presets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`food-presets-${userId || 'default'}`);
    if (saved) {
      try {
        setPresets(JSON.parse(saved));
      } catch {
        // Ignore parse errors
      }
    }
  }, [userId]);

  // Save presets to localStorage
  const savePresets = useCallback((newPresets: CustomPreset[]) => {
    setPresets(newPresets);
    localStorage.setItem(`food-presets-${userId || 'default'}`, JSON.stringify(newPresets));
  }, [userId]);

  const handleAddPreset = useCallback((preset: CustomPreset) => {
    medium();
    onAddFood({
      description: preset.name,
      calories: preset.calories,
      protein_g: preset.protein,
      carbs_g: preset.carbs,
      fat_g: preset.fat,
      meal_type: mealType,
      confidence: 1,
    });
  }, [mealType, onAddFood, medium]);

  const handleCreatePreset = useCallback(() => {
    if (!newPreset.name.trim()) return;
    
    light();
    const preset: CustomPreset = {
      id: Date.now().toString(),
      ...newPreset,
      isFavorite: false,
      createdAt: Date.now(),
    };
    
    savePresets([preset, ...presets]);
    setNewPreset({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0, emoji: "🍽️" });
    setIsCreating(false);
  }, [newPreset, presets, savePresets, light]);

  const handleDeletePreset = useCallback((id: string) => {
    light();
    savePresets(presets.filter(p => p.id !== id));
  }, [presets, savePresets, light]);

  const handleToggleFavorite = useCallback((id: string) => {
    savePresets(presets.map(p => {
      if (p.id === id) {
        return { ...p, isFavorite: !p.isFavorite };
      }
      return p;
    }));
  }, [presets, savePresets]);

  const emojiOptions = ["🍽️", "🥗", "🍳", "🥪", "🍜", "🍕", "🥙", "🍱", "🥘", "🍔", "🥤", "🍎", "🍌", "🥚", "🥛"];

  return (
    <>
      {/* Presets Button */}
      <motion.button
        onClick={() => {
          setIsOpen(true);
          medium();
        }}
        className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Heart size={20} className="text-purple-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">Mis comidas guardadas</p>
            <p className="text-xs text-zinc-400">{presets.length} presets • Añade con un toque</p>
          </div>
          <Plus size={20} className="text-zinc-400" />
        </div>
      </motion.button>

      {/* Presets Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-zinc-900 border-t border-white/10 p-6 max-h-[80vh] overflow-y-auto safe-area-inset-bottom"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20">
                    <Utensils size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Comidas guardadas</h2>
                    <p className="text-sm text-zinc-400">{presets.length} comidas personalizadas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setIsCreating(true)}
                    className="p-2 rounded-full bg-green-500/20"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus size={20} className="text-green-400" />
                  </motion.button>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full bg-white/10"
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} className="text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Create new preset form */}
              <AnimatePresence>
                {isCreating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <p className="text-sm font-medium text-white mb-3">Nueva comida personalizada</p>
                    
                    <input
                      type="text"
                      value={newPreset.name}
                      onChange={(e) => setNewPreset({ ...newPreset, name: e.target.value })}
                      placeholder="Nombre (ej: Batido proteico)"
                      className="w-full p-3 mb-3 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 text-white"
                    />
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-zinc-400 mb-1 block">Calorías</label>
                        <input
                          type="number"
                          value={newPreset.calories}
                          onChange={(e) => setNewPreset({ ...newPreset, calories: parseInt(e.target.value) || 0 })}
                          className="w-full p-2 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 mb-1 block">Proteína (g)</label>
                        <input
                          type="number"
                          value={newPreset.protein}
                          onChange={(e) => setNewPreset({ ...newPreset, protein: parseInt(e.target.value) || 0 })}
                          className="w-full p-2 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-blue-500/50 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 mb-1 block">Carbs (g)</label>
                        <input
                          type="number"
                          value={newPreset.carbs}
                          onChange={(e) => setNewPreset({ ...newPreset, carbs: parseInt(e.target.value) || 0 })}
                          className="w-full p-2 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-yellow-500/50 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 mb-1 block">Grasas (g)</label>
                        <input
                          type="number"
                          value={newPreset.fat}
                          onChange={(e) => setNewPreset({ ...newPreset, fat: parseInt(e.target.value) || 0 })}
                          className="w-full p-2 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-red-500/50 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="text-xs text-zinc-400 mb-2 block">Emoji</label>
                      <div className="flex gap-2 flex-wrap">
                        {emojiOptions.map((emoji) => (
                          <motion.button
                            key={emoji}
                            onClick={() => setNewPreset({ ...newPreset, emoji })}
                            className={`p-2 rounded-xl text-lg ${newPreset.emoji === emoji ? "bg-purple-500/30 border border-purple-500/50" : "bg-white/5 border border-white/10"}`}
                            whileTap={{ scale: 0.9 }}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => setIsCreating(false)}
                        className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium"
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancelar
                      </motion.button>
                      <motion.button
                        onClick={handleCreatePreset}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold"
                        whileTap={{ scale: 0.98 }}
                      >
                        <Save size={16} className="inline mr-2" />
                        Guardar
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Favorites section */}
              {presets.some(p => p.isFavorite) && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-zinc-400 mb-3">Favoritos</p>
                  <div className="space-y-2">
                    {presets.filter(p => p.isFavorite).map((preset) => (
                      <motion.div
                        key={preset.id}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <motion.button
                          onClick={() => handleToggleFavorite(preset.id)}
                          className="p-2 rounded-full"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart size={18} className="text-red-400 fill-red-400" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleAddPreset(preset)}
                          className="flex-1 flex items-center gap-3"
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-2xl">{preset.emoji}</span>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-white">{preset.name}</p>
                            <p className="text-xs text-zinc-400">{preset.calories} cal • {preset.protein}p {preset.carbs}c {preset.fat}g</p>
                          </div>
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeletePreset(preset.id)}
                          className="p-2 rounded-full hover:bg-red-500/20"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* All presets */}
              {presets.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-zinc-400 mb-3">
                    {presets.some(p => p.isFavorite) ? "Otras comidas" : "Todas las comidas"}
                  </p>
                  <div className="space-y-2">
                    {presets.filter(p => !p.isFavorite || !isCreating).map((preset) => (
                      <motion.div
                        key={preset.id}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <motion.button
                          onClick={() => handleToggleFavorite(preset.id)}
                          className="p-2 rounded-full"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart size={18} className={preset.isFavorite ? "text-red-400 fill-red-400" : "text-zinc-400"} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleAddPreset(preset)}
                          className="flex-1 flex items-center gap-3"
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-2xl">{preset.emoji}</span>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-white">{preset.name}</p>
                            <p className="text-xs text-zinc-400">{preset.calories} cal • {preset.protein}p {preset.carbs}c {preset.fat}g</p>
                          </div>
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeletePreset(preset.id)}
                          className="p-2 rounded-full hover:bg-red-500/20"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {presets.length === 0 && (
                <div className="text-center py-8">
                  <Utensils size={48} className="text-zinc-500 mx-auto mb-4" />
                  <p className="text-zinc-400 mb-4">No tienes comidas guardadas</p>
                  <motion.button
                    onClick={() => setIsCreating(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white font-bold"
                    whileTap={{ scale: 0.95 }}
                  >
                    Crear primera comida
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export const FoodPresets = memo(FoodPresetsComponent);
