"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Palette } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface ThemeToggleProps {
  initialTheme?: "dark" | "light" | "auto";
}

export function ThemeToggle({ initialTheme = "dark" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"dark" | "light" | "auto">(initialTheme);
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("dark");
  const { light } = useHaptic();

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "auto") {
        setCurrentTheme(e.matches ? "dark" : "light");
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    
    // Apply initial theme
    if (theme === "auto") {
      const systemIsDark = mediaQuery.matches;
      setCurrentTheme(systemIsDark ? "dark" : "light");
      applyTheme(systemIsDark ? "dark" : "light");
    } else {
      setCurrentTheme(theme);
      applyTheme(theme);
    }

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  function applyTheme(theme: "dark" | "light") {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("theme", theme);
  }

  function handleThemeChange(newTheme: "dark" | "light" | "auto") {
    light();
    setTheme(newTheme);
    localStorage.setItem("theme-preference", newTheme);
    
    if (newTheme !== "auto") {
      setCurrentTheme(newTheme);
      applyTheme(newTheme);
    } else {
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setCurrentTheme(systemIsDark ? "dark" : "light");
      applyTheme(systemIsDark ? "dark" : "light");
    }
  }

  const themes = [
    { value: "dark", label: "Oscuro", icon: Moon },
    { value: "light", label: "Claro", icon: Sun },
    { value: "auto", label: "Automático", icon: Palette },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Palette size={12} className="text-white" />
        </div>
        <h3 className="font-semibold">Tema</h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {themes.map(({ value, label, icon: Icon }) => {
          const isActive = theme === value;
          return (
            <motion.button
              key={value}
              onClick={() => handleThemeChange(value as any)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-colors ${
                isActive
                  ? value === "dark"
                    ? "bg-zinc-800 border-zinc-700 text-white"
                    : value === "light"
                    ? "bg-white/20 border-white/30 text-white"
                    : "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 text-white"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`p-2 rounded-xl ${
                isActive
                  ? value === "dark"
                    ? "bg-zinc-900"
                    : value === "light"
                    ? "bg-white/20"
                    : "bg-gradient-to-br from-purple-500 to-pink-500"
                  : "bg-white/5"
              }`}>
                <Icon size={20} className={isActive && value !== "auto" ? "text-white" : ""} />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          );
        })}
      </div>

      <p className="text-xs text-zinc-500 text-center">
        {currentTheme === "dark" ? "🌙 Modo oscuro activo" : "☀️ Modo claro activo"}
      </p>
    </div>
  );
}
