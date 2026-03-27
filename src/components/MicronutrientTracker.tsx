"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, ChevronDown } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Micronutrient {
  id: string;
  name: string;
  unit: string;
  current: number;
  target: number;
  foods: string[];
  status: "low" | "ok" | "good";
  color: string;
}

interface MicronutrientTrackerProps {
  userId?: string;
}

const MICRONUTRIENTS: Omit<Micronutrient, "current" | "status">[] = [
  { id: "vitd", name: "Vitamina D", unit: "µg", target: 20, foods: ["Salmón", "Huevos", "Champiñones"], color: "from-yellow-500 to-amber-500" },
  { id: "vitb12", name: "Vitamina B12", unit: "µg", target: 2.4, foods: ["Carne", "Pescado", "Lácteos"], color: "from-red-500 to-pink-500" },
  { id: "iron", name: "Hierro", unit: "mg", target: 18, foods: ["Carne roja", "Espinacas", "Lentejas"], color: "from-red-600 to-red-400" },
  { id: "calcium", name: "Calcio", unit: "mg", target: 1000, foods: ["Leche", "Queso", "Brócoli"], color: "from-blue-400 to-cyan-400" },
  { id: "magnesium", name: "Magnesio", unit: "mg", target: 400, foods: ["Nueces", "Aguacate", "Plátano"], color: "from-purple-500 to-indigo-500" },
  { id: "zinc", name: "Zinc", unit: "mg", target: 11, foods: ["Ostras", "Carne", "Semillas"], color: "from-gray-400 to-gray-500" },
  { id: "potassium", name: "Potasio", unit: "mg", target: 3500, foods: ["Plátano", "Patata", "Espinacas"], color: "from-green-500 to-emerald-500" },
  { id: "omega3", name: "Omega-3", unit: "g", target: 1.6, foods: ["Salmón", "Nueces", "Semillas de chía"], color: "from-cyan-500 to-blue-500" },
];

export function MicronutrientTracker({ userId }: MicronutrientTrackerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { light } = useHaptic();

  const stableRatio = (id: string) => {
    let hash = 0;
    const key = `${userId ?? "anon"}-${id}`;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % 10000;
    }
    return 0.3 + (hash / 10000) * 0.8;
  };

  // Simulated current values (in real app, calculate from food log)
  const nutrients: Micronutrient[] = MICRONUTRIENTS.map((m) => {
    const current = m.target * stableRatio(m.id);
    const pct = (current / m.target) * 100;
    let status: Micronutrient["status"] = "low";
    if (pct >= 100) status = "good";
    else if (pct >= 60) status = "ok";
    return { ...m, current, status };
  });

  const lowNutrients = nutrients.filter((n) => n.status === "low");
  const okNutrients = nutrients.filter((n) => n.status === "ok");
  const goodNutrients = nutrients.filter((n) => n.status === "good");

  function toggleExpand(id: string) {
    light();
    setExpanded(expanded === id ? null : id);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield size={18} className="text-green-400" />
        <h3 className="font-semibold">Micronutrientes</h3>
      </div>

      {/* Summary badges */}
      <div className="flex gap-2">
        {lowNutrients.length > 0 && (
          <div className="px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-xs">
            <span className="text-red-400 font-medium">{lowNutrients.length}</span>
            <span className="text-zinc-400 ml-1">bajos</span>
          </div>
        )}
        {okNutrients.length > 0 && (
          <div className="px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs">
            <span className="text-yellow-400 font-medium">{okNutrients.length}</span>
            <span className="text-zinc-400 ml-1">ok</span>
          </div>
        )}
        {goodNutrients.length > 0 && (
          <div className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-xs">
            <span className="text-green-400 font-medium">{goodNutrients.length}</span>
            <span className="text-zinc-400 ml-1">bien</span>
          </div>
        )}
      </div>

      {/* Nutrient list */}
      <div className="space-y-2">
        {nutrients.map((nutrient) => {
          const pct = Math.min(100, (nutrient.current / nutrient.target) * 100);
          const isExpanded = expanded === nutrient.id;

          return (
            <motion.div
              key={nutrient.id}
              className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={() => toggleExpand(nutrient.id)}
                className="w-full p-4 flex items-center gap-3"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${nutrient.color} flex items-center justify-center flex-shrink-0`}>
                  {nutrient.status === "low" ? (
                    <AlertTriangle size={18} className="text-white" />
                  ) : nutrient.status === "good" ? (
                    <CheckCircle size={18} className="text-white" />
                  ) : (
                    <span className="text-white text-sm font-bold">{Math.round(pct)}</span>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <p className="font-medium">{nutrient.name}</p>
                  <p className="text-xs text-zinc-500">
                    {nutrient.current.toFixed(1)}{nutrient.unit} / {nutrient.target}{nutrient.unit}
                  </p>
                </div>

                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={18} className="text-zinc-500" />
                </motion.div>
              </button>

              {/* Progress bar */}
              <div className="px-4 pb-2">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      nutrient.status === "low"
                        ? "bg-red-500"
                        : nutrient.status === "good"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <motion.div
                  className="px-4 pb-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <p className="text-sm text-zinc-400 mb-2">Fuentes alimentarias:</p>
                  <div className="flex flex-wrap gap-2">
                    {nutrient.foods.map((food) => (
                      <span
                        key={food}
                        className="px-3 py-1 rounded-full bg-white/5 text-xs text-zinc-300"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
