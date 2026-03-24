"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Minus, Award, Target, Flame, Droplets } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface WeeklyReportProps {
  userId: string;
}

interface WeekData {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  totalExercise: number;
  avgWater: number;
  avgSleep: number;
  streak: number;
  daysOnTarget: number;
  comparison: {
    calories: number;
    weight: number;
    exercise: number;
  };
}

export function WeeklyReport({ userId }: WeeklyReportProps) {
  const [report, setReport] = useState<WeekData | null>(null);
  const { light } = useHaptic();

  useEffect(() => {
    // Generate sample report
    const sample: WeekData = {
      avgCalories: 1850,
      avgProtein: 95,
      avgCarbs: 180,
      avgFat: 65,
      totalExercise: 240,
      avgWater: 2100,
      avgSleep: 7.2,
      streak: 12,
      daysOnTarget: 5,
      comparison: {
        calories: -8,
        weight: -1.2,
        exercise: 15,
      },
    };
    setReport(sample);
  }, [userId]);

  if (!report) return null;

  const StatCard = ({ icon: Icon, label, value, unit, change, color }: any) => (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={18} className={color} />
        <span className="text-sm text-zinc-400">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}<span className="text-sm text-zinc-500 ml-1">{unit}</span></p>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-1 text-sm ${change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "text-zinc-400"}`}>
          {change > 0 ? <TrendingUp size={14} /> : change < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
          <span>{Math.abs(change)}% vs semana anterior</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 size={18} className="text-green-400" />
        <h3 className="font-semibold">Informe semanal</h3>
      </div>

      {/* Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-zinc-400">Resumen de la semana</p>
            <p className="text-xl font-bold">Semana del 1-7 Marzo</p>
          </div>
          <div className="text-right">
            <p className="text-3xl">🔥</p>
            <p className="text-sm font-bold text-orange-400">{report.streak} días</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
          <Award size={20} className="text-yellow-400" />
          <div className="flex-1">
            <p className="font-medium">{report.daysOnTarget}/7 días en objetivo</p>
            <p className="text-xs text-zinc-400">kcal, macros y agua</p>
          </div>
          <span className="text-2xl font-bold text-green-400">{Math.round((report.daysOnTarget/7)*100)}%</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Flame} label="Calorías promedio" value={report.avgCalories} unit="kcal" change={report.comparison.calories} color="text-orange-400" />
        <StatCard icon={Target} label="Proteína promedio" value={report.avgProtein} unit="g" color="text-blue-400" />
        <StatCard icon={Droplets} label="Agua promedio" value={report.avgWater} unit="ml" change={5} color="text-cyan-400" />
        <StatCard icon={BarChart3} label="Ejercicio total" value={report.totalExercise} unit="min" change={report.comparison.exercise} color="text-purple-400" />
      </div>

      {/* Macros breakdown */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-sm text-zinc-400 mb-3">Desglose de macronutrientes</p>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Proteína</span>
              <span className="text-blue-400">{report.avgProtein}g</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(report.avgProtein / 150) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Carbohidratos</span>
              <span className="text-yellow-400">{report.avgCarbs}g</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-yellow-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(report.avgCarbs / 250) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Grasas</span>
              <span className="text-red-400">{report.avgFat}g</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(report.avgFat / 80) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-sm text-zinc-400 mb-3">🏆 Logros de la semana</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2">
            <span className="text-xl">🎯</span>
            <span className="text-sm">5 días consecutivos en objetivo calórico</span>
          </div>
          <div className="flex items-center gap-3 p-2">
            <span className="text-xl">💪</span>
            <span className="text-sm">240 minutos de ejercicio (meta: 150)</span>
          </div>
          <div className="flex items-center gap-3 p-2">
            <span className="text-xl">😴</span>
            <span className="text-sm">Promedio de sueño: 7.2h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
