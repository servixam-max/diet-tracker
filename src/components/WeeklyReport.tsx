"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Download, Calendar, FileText, Share2, 
  BarChart3, PieChart, LineChart, ChevronLeft, ChevronRight,
  Printer, Check
} from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface WeeklyReportProps {
  userId: string;
}

interface WeekData {
  week: string;
  calories: number[];
  avgCalories: number;
  protein: number[];
  carbs: number[];
  fat: number[];
  weight: number[];
  workouts: number;
  daysTracked: number;
}

export function WeeklyReport({ userId }: WeeklyReportProps) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [weeksData, setWeeksData] = useState<WeekData[]>([]);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const { light, success } = useHaptic();

  // Generate sample data
  useEffect(() => {
    const weeks: WeekData[] = [];
    const today = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - today.getDay());
      
      const weekData: WeekData = {
        week: weekStart.toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
        calories: Array.from({ length: 7 }, () => 1800 + Math.random() * 600),
        avgCalories: 0,
        protein: Array.from({ length: 7 }, () => 80 + Math.random() * 60),
        carbs: Array.from({ length: 7 }, () => 150 + Math.random() * 100),
        fat: Array.from({ length: 7 }, () => 40 + Math.random() * 40),
        weight: Array.from({ length: 7 }, (_, idx) => 75 - (i * 0.2) - (idx * 0.05)),
        workouts: Math.floor(Math.random() * 5) + 2,
        daysTracked: 7,
      };
      
      weekData.avgCalories = weekData.calories.reduce((a, b) => a + b, 0) / 7;
      weeks.push(weekData);
    }
    
    setWeeksData(weeks);
  }, []);

  const currentData = weeksData[currentWeek];

  const stats = useMemo(() => {
    if (!currentData) return null;
    
    const avgProtein = currentData.protein.reduce((a, b) => a + b, 0) / 7;
    const avgCarbs = currentData.carbs.reduce((a, b) => a + b, 0) / 7;
    const avgFat = currentData.fat.reduce((a, b) => a + b, 0) / 7;
    const avgWeight = currentData.weight.reduce((a, b) => a + b, 0) / 7;
    const weightChange = currentData.weight[6] - currentData.weight[0];
    
    return {
      avgCalories: Math.round(currentData.avgCalories),
      avgProtein: Math.round(avgProtein),
      avgCarbs: Math.round(avgCarbs),
      avgFat: Math.round(avgFat),
      avgWeight: avgWeight.toFixed(1),
      weightChange: weightChange.toFixed(2),
      workouts: currentData.workouts,
      adherence: Math.round((currentData.daysTracked / 7) * 100),
    };
  }, [currentData]);

  function nextWeek() {
    light();
    if (currentWeek < weeksData.length - 1) {
      setCurrentWeek((prev) => prev + 1);
    }
  }

  function prevWeek() {
    light();
    if (currentWeek > 0) {
      setCurrentWeek((prev) => prev - 1);
    }
  }

  async function generatePDF() {
    setGeneratingPDF(true);
    light();
    
    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setGeneratingPDF(false);
    setPdfGenerated(true);
    success();
    
    setTimeout(() => setPdfGenerated(false), 3000);
  }

  function downloadCSV() {
    if (!stats) return;
    
    const csvContent = `
Semana,Calorías Promedio,Proteína Promedio,Carbs Promedio,Grasa Promedio,Peso Promedio,Cambio Peso
${currentData?.week},${stats.avgCalories},${stats.avgProtein},${stats.avgCarbs},${stats.avgFat},${stats.avgWeight},${stats.weightChange}
    `.trim();
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-semanal-${currentData?.week}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    success();
  }

  function printReport() {
    window.print();
    light();
  }

  if (!stats || !currentData) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-t-green-500 border-white/20 animate-spin" />
        <p className="text-zinc-400">Generando reporte...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header with week selector */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={prevWeek}
          disabled={currentWeek === 0}
          className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} />
        </motion.button>
        
        <div className="text-center">
          <p className="text-sm text-zinc-400">Semana del</p>
          <p className="font-bold text-lg">{currentData.week}</p>
        </div>
        
        <motion.button
          onClick={nextWeek}
          disabled={currentWeek === weeksData.length - 1}
          className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-amber-400" />
            <span className="text-sm text-zinc-400">Promedio cal</span>
          </div>
          <p className="text-2xl font-bold">{stats.avgCalories}</p>
          <p className="text-xs text-zinc-500">kcal/día</p>
        </motion.div>

        <motion.div
          className={`p-4 rounded-2xl border ${
            parseFloat(stats.weightChange) < 0
              ? "bg-green-500/10 border-green-500/20"
              : "bg-red-500/10 border-red-500/20"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <LineChart size={16} className={parseFloat(stats.weightChange) < 0 ? "text-green-400" : "text-red-400"} />
            <span className="text-sm text-zinc-400">Cambio peso</span>
          </div>
          <p className={`text-2xl font-bold ${parseFloat(stats.weightChange) < 0 ? "text-green-400" : "text-red-400"}`}>
            {parseFloat(stats.weightChange) > 0 ? "+" : ""}
            {stats.weightChange} kg
          </p>
          <p className="text-xs text-zinc-500">esta semana</p>
        </motion.div>

        <motion.div
          className="p-4 rounded-2xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-blue-400" />
            <span className="text-sm text-zinc-400">Adherencia</span>
          </div>
          <p className="text-2xl font-bold">{stats.adherence}%</p>
          <p className="text-xs text-zinc-500">{currentData.daysTracked}/7 días</p>
        </motion.div>

        <motion.div
          className="p-4 rounded-2xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-purple-400" />
            <span className="text-sm text-zinc-400">Entrenos</span>
          </div>
          <p className="text-2xl font-bold">{stats.workouts}</p>
          <p className="text-xs text-zinc-500">sessiones</p>
        </motion.div>
      </div>

      {/* Macros breakdown */}
      <motion.div
        className="p-4 rounded-2xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <PieChart size={18} className="text-amber-400" />
          <p className="font-semibold">Macronutrientes promedio</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
            <p className="text-xl font-bold text-blue-400">{stats.avgProtein}g</p>
            <p className="text-xs text-zinc-400 mt-1">Proteína</p>
            <p className="text-xs text-zinc-500">{Math.round((stats.avgProtein * 4 / stats.avgCalories) * 100)}%</p>
          </div>
          <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
            <p className="text-xl font-bold text-yellow-400">{stats.avgCarbs}g</p>
            <p className="text-xs text-zinc-400 mt-1">Carbos</p>
            <p className="text-xs text-zinc-500">{Math.round((stats.avgCarbs * 4 / stats.avgCalories) * 100)}%</p>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-xl font-bold text-red-400">{stats.avgFat}g</p>
            <p className="text-xs text-zinc-400 mt-1">Grasas</p>
            <p className="text-xs text-zinc-500">{Math.round((stats.avgFat * 9 / stats.avgCalories) * 100)}%</p>
          </div>
        </div>
      </motion.div>

      {/* Weight chart */}
      <motion.div
        className="p-4 rounded-2xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <LineChart size={18} className="text-green-400" />
          <p className="font-semibold">Evolución de peso</p>
        </div>

        <div className="h-32 flex items-end gap-1">
          {currentData.weight.map((w, i) => {
            const minW = Math.min(...currentData.weight);
            const maxW = Math.max(...currentData.weight);
            const range = maxW - minW || 1;
            const height = ((w - minW) / range) * 100;
            
            return (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-green-500/50 to-green-500/20 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(10, height)}%` }}
                transition={{ delay: i * 0.05 }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          <span>Lun</span>
          <span>Mar</span>
          <span>Mié</span>
          <span>Jue</span>
          <span>Vie</span>
          <span>Sáb</span>
          <span>Dom</span>
        </div>
      </motion.div>

      {/* Export buttons */}
      <div className="grid grid-cols-3 gap-2">
        <motion.button
          onClick={generatePDF}
          disabled={generatingPDF || pdfGenerated}
          className={`py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
            pdfGenerated
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-white/5 border border-white/10 hover:bg-white/10"
          }`}
          whileTap={{ scale: 0.98 }}
        >
          {generatingPDF ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FileText size={16} />
            </motion.div>
          ) : pdfGenerated ? (
            <><Check size={16} /> PDF</>
          ) : (
            <><FileText size={16} /> PDF</>
          )}
        </motion.button>

        <motion.button
          onClick={downloadCSV}
          className="py-3 rounded-xl font-medium bg-white/5 border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <Download size={16} />
          CSV
        </motion.button>

        <motion.button
          onClick={printReport}
          className="py-3 rounded-xl font-medium bg-white/5 border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <Printer size={16} />
          Imprimir
        </motion.button>
      </div>

      {/* Share button */}
      <motion.button
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: "Mi reporte semanal - Diet Tracker",
              text: `Semana ${currentData.week}: ${stats.avgCalories} kcal/día, ${stats.avgWeight}kg, ${stats.workouts} entrenos`,
            });
          }
          light();
        }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center justify-center gap-2"
        whileTap={{ scale: 0.98 }}
      >
        <Share2 size={18} />
        Compartir reporte
      </motion.button>
    </div>
  );
}
