"use client";

import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame, Zap, Wheat, Droplets, Check, Loader2, Sparkles,
} from "lucide-react";
import type { FoodResult } from "./types";

interface FoodResultViewProps {
  result: FoodResult;
  imageBase64: string | null;
  onSave: (result: FoodResult, imageBase64: string | null) => Promise<void>;
  onUpdateResult: (updated: FoodResult) => void;
}

function FoodResultViewComponent({ result, imageBase64, onSave, onUpdateResult }: FoodResultViewProps) {
  const [isSaving, setIsSaving] = useState(false);

  const updateField = useCallback(
    (field: keyof FoodResult, value: string | number) => {
      onUpdateResult({ ...result, [field]: value });
    },
    [result, onUpdateResult]
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave(result, imageBase64);
    } finally {
      setIsSaving(false);
    }
  }, [result, imageBase64, onSave]);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {imageBase64 && (
        <motion.div className="relative rounded-2xl overflow-hidden" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <img src={imageBase64} alt="Food" className="w-full h-36 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {result.confidence != null && result.confidence < 1 && (
            <span className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/90 text-white flex items-center gap-1.5">
              <Sparkles size={12} />
              {Math.round(result.confidence * 100)}% seguro
            </span>
          )}
        </motion.div>
      )}

      <input
        type="text"
        value={result.description}
        onChange={(e) => updateField("description", e.target.value)}
        className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-green-500/50 text-white text-xl font-semibold"
      />

      {/* Calorie card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/5 border border-orange-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <Flame size={20} className="text-white" />
          </div>
          <div>
            <p className="text-orange-400 font-semibold">Calorías</p>
            <p className="text-xs text-zinc-400">kcal</p>
          </div>
        </div>
        <input
          type="number"
          value={result.calories}
          onChange={(e) => updateField("calories", e.target.value)}
          className="w-full p-2 bg-white/5 rounded-xl border border-orange-500/30 outline-none focus:border-orange-500/50 text-white text-3xl font-bold text-center"
        />
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Proteínas", value: result.protein_g, field: "protein_g" as const, color: "blue", icon: Zap },
          { label: "Carbos", value: result.carbs_g, field: "carbs_g" as const, color: "yellow", icon: Wheat },
          { label: "Grasas", value: result.fat_g, field: "fat_g" as const, color: "red", icon: Droplets },
        ].map((macro) => (
          <div
            key={macro.label}
            className={`p-4 rounded-2xl bg-${macro.color}-500/10 border border-${macro.color}-500/30 text-center`}
          >
            <macro.icon size={18} className={`text-${macro.color}-400 mx-auto mb-1`} />
            <input
              type="number"
              value={macro.value}
              onChange={(e) => updateField(macro.field, e.target.value)}
              className="w-full bg-transparent text-2xl font-bold text-white text-center outline-none"
            />
            <p className="text-xs text-zinc-400">{macro.label}</p>
          </div>
        ))}
      </div>

      <motion.button
        onClick={handleSave}
        disabled={isSaving || !result.description}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-xl shadow-green-500/30 disabled:opacity-50"
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
            Añadir al diario
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

export const FoodResultView = memo(FoodResultViewComponent);
