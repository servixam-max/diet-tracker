"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { GoalsSettings } from "@/components/GoalsSettings";
import { MacroCalculator } from "@/components/MacroCalculator";
import { NotificationSettings } from "@/components/NotificationSettings";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UnitsToggle } from "@/components/UnitsToggle";
import { DataExport } from "@/components/DataExport";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"goals" | "calculator" | "notifications" | "appearance">("goals");
  const router = useRouter();
  const { user, loading } = useAuth();

  if (!loading && !user) {
    router.push("/login");
    return null;
  }

  const tabs = [
    { id: "goals", label: "Objetivos" },
    { id: "calculator", label: "Calculadora" },
    { id: "notifications", label: "Notificaciones" },
    { id: "appearance", label: "Apariencia" },
  ];

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
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? "bg-green-500 text-white" : "bg-white/5 text-zinc-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
          {activeTab === "goals" && <GoalsSettings userId={user?.id || ""} />}
          {activeTab === "calculator" && <MacroCalculator onSave={(macros) => console.log("Macros saved:", macros)} />}
          {activeTab === "notifications" && <><NotificationSettings userId={user?.id || ""} /><div className="mt-4"><DataExport userId={user?.id || ""} /></div></>}
          {activeTab === "appearance" && <><ThemeToggle /><UnitsToggle /></>}
        </div>
      </div>
    </div>
  );
}
