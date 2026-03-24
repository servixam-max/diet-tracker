"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Check, Loader2 } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface DataExportProps {
  userId: string;
}

export function DataExport({ userId }: DataExportProps) {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const { light, success } = useHaptic();

  async function exportData() {
    light();
    setExporting(true);

    try {
      // Fetch all user's data
      const [foodLogRes, profileRes, weeklyPlanRes] = await Promise.all([
        fetch("/api/food-log"),
        fetch("/api/profile"),
        fetch("/api/generate-plan"),
      ]);

      const foodLogs = await foodLogRes.json();
      const profile = await profileRes.json();
      const weeklyPlan = await weeklyPlanRes.json();

      // Create CSV content
      const csvRows = ["Fecha,Comida,Descripción,Calorías,Proteínas,Carbos,Grasas"];
      
      foodLogs.forEach((log: any) => {
        csvRows.push([
          log.date || "",
          log.meal_type || "",
          log.description || "",
          log.calories || 0,
          log.protein_g || 0,
          log.carbs_g || 0,
          log.fat_g || 0,
        ].join(","));
      });

      const csvContent = csvRows.join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `diet-tracker-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      success();
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Download size={18} className="text-green-400" />
        <h3 className="font-semibold">Exportar datos</h3>
      </div>

      <motion.button
        onClick={exportData}
        disabled={exporting || exported}
        className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
          exported
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10"
        }`}
        whileTap={{ scale: 0.98 }}
      >
        {exporting ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
              <Loader2 size={22} />
            </motion.div>
            Exportando...
          </>
        ) : exported ? (
          <>
            <Check size={22} />
            Exportado ✓
          </>
        ) : (
          <>
            <FileText size={22} />
            Exportar a CSV
          </>
        )}
      </motion.button>

      <p className="text-xs text-zinc-500 text-center">
        Descarga tu historial de comidas en formato CSV
      </p>
    </div>
  );
}
