"use client";

import { memo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useHaptic } from "@/hooks/useHaptic";
import { Apple, Flame, Zap, Wheat, Droplets, Check, Loader2 } from "lucide-react";

interface ManualEntryTabProps {
  mealType: string;
  onFoodAdded: () => void;
  onClose: () => void;
}

function ManualEntryTabComponent({ mealType, onFoodAdded, onClose }: ManualEntryTabProps) {
  const { success } = useHaptic();

  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!description || !calories) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/food-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal_type: mealType,
          description,
          calories: Number(calories),
          protein_g: Number(protein) || 0,
          carbs_g: Number(carbs) || 0,
          fat_g: Number(fat) || 0,
          source: "manual",
        }),
      });

      if (response.ok) {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#22c55e", "#4ade80", "#86efac"],
        });
        success();
        onFoodAdded();
        setTimeout(() => onClose(), 800);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [description, calories, protein, carbs, fat, mealType, success, onFoodAdded, onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="¿Qué has comido?"
          className="w-full p-4 pl-12 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-green-500/50 text-white"
        />
        <Apple size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-zinc-400 block mb-1.5">Calorías (kcal)</label>
          <div className="relative">
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="0"
              className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-orange-500/50 text-white"
            />
            <Flame size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400/70" />
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-400 block mb-1.5">Proteínas (g)</label>
          <div className="relative">
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="0"
              className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-blue-500/50 text-white"
            />
            <Zap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/70" />
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-400 block mb-1.5">Carbos (g)</label>
          <div className="relative">
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="0"
              className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-yellow-500/50 text-white"
            />
            <Wheat size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400/70" />
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-400 block mb-1.5">Grasas (g)</label>
          <div className="relative">
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="0"
              className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-red-500/50 text-white"
            />
            <Droplets size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400/70" />
          </div>
        </div>
      </div>

      <motion.button
        onClick={handleSave}
        disabled={!description || !calories || isSaving}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg shadow-green-500/30 disabled:opacity-50"
        whileTap={{ scale: 0.98 }}
      >
        {isSaving ? (
          <span className="flex items-center justify-center gap-2">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
              <Loader2 size={20} />
            </motion.div>
            Guardando...
          </span>
        ) : (
          <>
            <Check size={20} className="inline mr-2" />
            Guardar comida
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

export const ManualEntryTab = memo(ManualEntryTabComponent);
