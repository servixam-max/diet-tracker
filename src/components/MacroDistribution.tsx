"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Target, AlertCircle } from "lucide-react";

interface MacroData {
  protein: number;
  carbs: number;
  fat: number;
}

interface MacroDistributionProps {
  protein: number;
  carbs: number;
  fat: number;
  targetCalories: number;
}

export function MacroDistribution({ protein, carbs, fat, targetCalories }: MacroDistributionProps) {
  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatCals = fat * 9;
  const totalCals = proteinCals + carbsCals + fatCals;

  const proteinPct = totalCals > 0 ? (proteinCals / totalCals) * 100 : 33;
  const carbsPct = totalCals > 0 ? (carbsCals / totalCals) * 100 : 40;
  const fatPct = totalCals > 0 ? (fatCals / totalCals) * 100 : 27;

  // Target ratios (typical balanced diet)
  const targetProtein = 25;
  const targetCarbs = 45;
  const targetFat = 30;

  const proteinDiff = proteinPct - targetProtein;
  const carbsDiff = carbsPct - targetCarbs;
  const fatDiff = fatPct - targetFat;

  const isBalanced = Math.abs(proteinDiff) < 10 && Math.abs(carbsDiff) < 10 && Math.abs(fatDiff) < 10;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <PieChart size={18} className="text-purple-400" />
        <h3 className="font-semibold">Distribución de macros</h3>
      </div>

      {/* Pie chart visualization */}
      <div className="relative p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Protein (blue) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="12"
                strokeDasharray={`${proteinPct * 2.51} 251`}
                strokeLinecap="round"
              />
              {/* Carbs (yellow) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#eab308"
                strokeWidth="12"
                strokeDasharray={`${carbsPct * 2.51} 251`}
                strokeDashoffset={`-${proteinPct * 2.51}`}
                strokeLinecap="round"
              />
              {/* Fat (red) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray={`${fatPct * 2.51} 251`}
                strokeDashoffset={`-${(proteinPct + carbsPct) * 2.51}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold">{totalCals}</p>
              <p className="text-xs text-zinc-400">kcal</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mx-auto mb-1" />
            <p className="text-sm font-medium">{Math.round(proteinPct)}%</p>
            <p className="text-xs text-zinc-500">Proteína</p>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mx-auto mb-1" />
            <p className="text-sm font-medium">{Math.round(carbsPct)}%</p>
            <p className="text-xs text-zinc-500">Carbos</p>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mx-auto mb-1" />
            <p className="text-sm font-medium">{Math.round(fatPct)}%</p>
            <p className="text-xs text-zinc-500">Grasas</p>
          </div>
        </div>
      </div>

      {/* Balance indicator */}
      <div className={`p-4 rounded-2xl border ${isBalanced ? "bg-green-500/10 border-green-500/30" : "bg-orange-500/10 border-orange-500/30"}`}>
        <div className="flex items-center gap-3">
          {isBalanced ? (
            <>
              <span className="text-2xl">⚖️</span>
              <div>
                <p className="font-medium text-green-400">Distribución equilibrada</p>
                <p className="text-sm text-zinc-400">Estás得很好 en tus macros</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle size={24} className="text-orange-400" />
              <div>
                <p className="font-medium text-orange-400">Ajustes sugeridos</p>
                <p className="text-sm text-zinc-400">
                  {proteinDiff > 10 ? "+Proteína " : carbsDiff > 10 ? "+Carbos " : fatDiff > 10 ? "+Grasas " : ""}
                  para equilibrar
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detailed breakdown */}
      <div className="space-y-2">
        <div className="p-3 rounded-xl bg-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              Proteína
            </span>
            <span className="font-medium">{protein}g</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, proteinPct)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-1">{proteinCals} kcal ({(protein * 4).toFixed(0)}%)</p>
        </div>

        <div className="p-3 rounded-xl bg-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              Carbohidratos
            </span>
            <span className="font-medium">{carbs}g</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-yellow-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, carbsPct)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-1">{carbsCals} kcal ({(carbs * 4).toFixed(0)}%)</p>
        </div>

        <div className="p-3 rounded-xl bg-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              Grasas
            </span>
            <span className="font-medium">{fat}g</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-red-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, fatPct)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-1">{fatCals} kcal ({(fat * 9).toFixed(0)}%)</p>
        </div>
      </div>
    </div>
  );
}
