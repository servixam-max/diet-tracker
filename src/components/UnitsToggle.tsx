"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, Ruler, TrendingUp } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface UnitsToggleProps {
  initialUnits?: "metric" | "imperial";
  onUnitsChange?: (units: "metric" | "imperial") => void;
}

export function UnitsToggle({ initialUnits = "metric", onUnitsChange }: UnitsToggleProps) {
  const [units, setUnits] = useState<"metric" | "imperial">(initialUnits);
  const { light } = useHaptic();

  useEffect(() => {
    const saved = localStorage.getItem("units-preference");
    if (saved === "metric" || saved === "imperial") {
      setUnits(saved);
      onUnitsChange?.(saved);
    }
  }, []);

  function handleUnitsChange(newUnits: "metric" | "imperial") {
    light();
    setUnits(newUnits);
    localStorage.setItem("units-preference", newUnits);
    onUnitsChange?.(newUnits);
  }

  const unitOptions = [
    { value: "metric", label: "Métrico", description: "kg, cm", icon: Scale },
    { value: "imperial", label: "Imperial", description: "lb, in", icon: Ruler },
  ];

  const conversionExamples = {
    metric: { weight: "75 kg", height: "175 cm", calories: "kcal" },
    imperial: { weight: "165 lb", height: "5'9\"", calories: "kcal" },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <TrendingUp size={12} className="text-white" />
        </div>
        <h3 className="font-semibold">Unidades</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {unitOptions.map(({ value, label, description, icon: Icon }) => {
          const isActive = units === value;
          return (
            <motion.button
              key={value}
              onClick={() => handleUnitsChange(value as any)}
              className={`flex flex-col gap-2 p-4 rounded-2xl border transition-colors ${
                isActive
                  ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-white"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isActive ? "bg-blue-500/20" : "bg-white/5"
              }`}>
                <Icon size={20} className={isActive ? "text-blue-400" : "text-zinc-500"} />
              </div>
              <div className="text-left">
                <p className="font-medium">{label}</p>
                <p className="text-xs text-zinc-500">{description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-sm text-zinc-300 mb-2">Ejemplo con tus datos:</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">Peso:</span>
            <span className="font-medium">{conversionExamples[units].weight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Altura:</span>
            <span className="font-medium">{conversionExamples[units].height}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Calorías:</span>
            <span className="font-medium">{conversionExamples[units].calories}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-500 text-center">
        Los valores se convertirán automáticamente
      </p>
    </div>
  );
}
