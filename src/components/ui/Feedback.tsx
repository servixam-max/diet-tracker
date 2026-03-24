"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, ReactNode } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast["type"], duration?: number) => void;
}

let toastListeners: ((toast: Toast) => void)[] = [];

export function showToast(message: string, type: Toast["type"] = "info", duration = 3000) {
  const toast: Toast = {
    id: Math.random().toString(36).substr(2, 9),
    message,
    type,
    duration,
  };
  toastListeners.forEach((listener) => listener(toast));
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`
                px-6 py-3 rounded-2xl backdrop-blur-xl border shadow-lg
                ${
                  toast.type === "success"
                    ? "bg-green-500/20 border-green-500/30 text-green-400"
                    : toast.type === "error"
                    ? "bg-red-500/20 border-red-500/30 text-red-400"
                    : toast.type === "warning"
                    ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                    : "bg-white/10 border-white/20 text-white"
                }
              `}
            >
              <div className="flex items-center gap-2">
                {toast.type === "success" && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {toast.type === "error" && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="font-medium text-sm">{toast.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

// Confetti effect
export function triggerConfetti() {
  const colors = ["#22c55e", "#4ade80", "#16a34a", "#ffffff", "#fbbf24"];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: 50%;
      top: 50%;
      border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
      pointer-events: none;
      z-index: 9999;
    `;
    
    const angle = (Math.random() * 360 * Math.PI) / 180;
    const velocity = Math.random() * 300 + 100;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    document.body.appendChild(confetti);
    
    confetti.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        { 
          transform: `translate(${vx}px, ${vy + 400}px) rotate(${Math.random() * 720}deg)`,
          opacity: 0 
        },
      ],
      {
        duration: Math.random() * 1000 + 1000,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }
    ).onfinish = () => confetti.remove();
  }
}

// Haptic feedback
export function triggerHaptic(type: "light" | "medium" | "heavy" = "light") {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 50, 30],
    };
    navigator.vibrate(patterns[type]);
  }
}

// Skeleton loading components
export function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-6 animate-pulse">
      <div className="h-6 w-1/3 bg-white/10 rounded-lg mb-4" />
      <div className="h-4 w-2/3 bg-white/10 rounded-lg mb-2" />
      <div className="h-4 w-1/2 bg-white/10 rounded-lg" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-white/10 rounded animate-pulse"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

// Pull to refresh indicator
export function PullToRefreshIndicator({ 
  isRefreshing, 
  pullProgress 
}: { 
  isRefreshing: boolean; 
  pullProgress: number;
}) {
  return (
    <motion.div
      className="absolute top-0 left-0 right-0 flex justify-center items-center py-4"
      style={{ opacity: Math.min(pullProgress * 2, 1) }}
    >
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : { rotate: pullProgress * 180 }}
        transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
        className="w-6 h-6"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-green-400">
          <path
            d="M12 2v4m0 12v4M2 12h4m12 0h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// Badge with animation
export function AnimatedBadge({ 
  children, 
  count 
}: { 
  children: ReactNode; 
  count?: number;
}) {
  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {count && count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1"
          >
            {count > 99 ? "99+" : count}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Ripple effect button
export function RippleButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
    
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        />
      ))}
      {children}
    </button>
  );
}
