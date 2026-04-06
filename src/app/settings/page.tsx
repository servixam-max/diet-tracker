"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { GoalsSettings } from "@/components/GoalsSettings";
import { MacroCalculator } from "@/components/MacroCalculator";
import { NotificationManager } from "@/components/NotificationManager";
import { WeeklyReport } from "@/components/WeeklyReport";
import { OfflineManager } from "@/components/OfflineManager";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DataExport } from "@/components/DataExport";
import { Bell, BarChart3, Wifi, Calculator, Target, Palette } from "lucide-react";

function getIsDemo(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("demo-mode") === "true";
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"goals" | "calculator" | "notifications" | "analytics" | "offline" | "appearance">("goals");
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isDemo] = useState(() => getIsDemo());

  if (!loading && !user && !isDemo) {
    router.push("/login");
    return null;
  }

  const tabs = [
    { id: "goals", label: "Objetivos", icon: Target },
    { id: "calculator", label: "Calculadora", icon: Calculator },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "analytics", label: "Reportes", icon: BarChart3 },
    { id: "offline", label: "Offline", icon: Wifi },
    { id: "appearance", label: "Apariencia", icon: Palette },
  ] as const;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <motion.header className="px-5 pt-8 pb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-4">Ajustes</h1>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? "bg-green-500 text-white" : "bg-white/5 text-zinc-400"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
          {activeTab === "goals" && <GoalsSettings userId={user?.id || ""} />}
          {activeTab === "calculator" && <MacroCalculator onSave={(macros) => console.log("Macros saved:", macros)} />}
          {activeTab === "notifications" && <NotificationManager userId={user?.id || ""} />}
          {activeTab === "analytics" && <WeeklyReport userId={user?.id || ""} />}
          {activeTab === "offline" && <OfflineManager userId={user?.id || ""} />}
          {activeTab === "appearance" && (
            <div className="space-y-4">
              <ThemeToggle />
              <DataExport userId={user?.id || ""} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
