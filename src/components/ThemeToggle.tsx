"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Palette } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface ThemeToggleProps {
  initialTheme?: "dark" | "light" | "auto";
}

export function ThemeToggle({ initialTheme = "dark" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"dark" | "light" | "auto">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme-preference");
      if (saved === "dark" || saved === "light" || saved === "auto") return saved;
    }
    return initialTheme;
  });
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("dark");
  const { light } = useHaptic();

  const applyTheme = useCallback((nextTheme: "dark" | "light") => {
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  }, []);

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
  }, [theme, applyTheme]);

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
        <div 
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--accent-gradient)' }}
        >
          <Palette size={12} className="text-white" />
        </div>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Tema</h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {themes.map(({ value, label, icon: Icon }) => {
          const isActive = theme === value;
          return (
            <motion.button
              key={value}
              onClick={() => handleThemeChange(value as "dark" | "light" | "auto")}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-colors ${
                isActive
                  ? value === "dark"
                    ? "bg-[var(--bg-tertiary)] border-[var(--border-accent)]"
                    : value === "light"
                    ? "bg-white/20 border-white/30"
                    : "border-[var(--border-accent)]"
                  : "bg-[var(--bg-secondary)] border-[var(--border-secondary)]"
              }`}
              style={{
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`p-2 rounded-xl ${
                isActive
                  ? value === "dark"
                    ? "bg-[var(--bg-primary)]"
                    : value === "light"
                    ? "bg-white/20"
                    : ""
                  : "bg-[var(--bg-secondary)]"
              }`}>
                <Icon size={20} style={{ color: isActive && value !== "auto" ? 'var(--text-primary)' : 'inherit' }} />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          );
        })}
      </div>

      <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
        {currentTheme === "dark" ? "🌙 Modo oscuro activo" : "☀️ Modo claro activo"}
      </p>
    </div>
  );
}
