"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useHaptic } from "@/hooks/useHaptic";

interface MacroData {
  protein: number;
  carbs: number;
  fat: number;
}

interface MacronutrientChartProps {
  userId: string;
  macroData?: MacroData;
}

export function MacronutrientChart({ userId, macroData }: MacronutrientChartProps) {
  const [data] = useState<MacroData>(macroData || { protein: 85, carbs: 180, fat: 65 });
  const { light } = useHaptic();

  const total = data.protein + data.carbs + data.fat;
  const proteinPercent = Math.round((data.protein / total) * 100);
  const carbsPercent = Math.round((data.carbs / total) * 100);
  const fatPercent = Math.round((data.fat / total) * 100);

  const chartData = [
    { name: "Proteína", value: data.protein, color: "#3b82f6", percent: proteinPercent },
    { name: "Carbos", value: data.carbs, color: "#f59e0b", percent: carbsPercent },
    { name: "Grasa", value: data.fat, color: "#ef4444", percent: fatPercent },
  ];

  const proteinCalories = data.protein * 4;
  const carbsCalories = data.carbs * 4;
  const fatCalories = data.fat * 9;
  const totalCalories = proteinCalories + carbsCalories + fatCalories;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Distribución de macros</h3>
        <span className="text-sm text-zinc-500">{totalCalories} kcal</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {chartData.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-2 rounded-xl bg-white/5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.value}g</span>
                <span className="text-xs text-zinc-500">({item.percent}%)</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
        <p className="text-xs text-zinc-500 mb-2">Calorías por macro</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-lg font-bold text-blue-400">{proteinCalories}</p>
            <p className="text-xs text-zinc-500">Proteína</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-yellow-400">{carbsCalories}</p>
            <p className="text-xs text-zinc-500">Carbos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-400">{fatCalories}</p>
            <p className="text-xs text-zinc-500">Grasa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
