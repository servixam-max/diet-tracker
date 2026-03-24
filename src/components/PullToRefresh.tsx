"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}

export function PullToRefresh({ onRefresh, children, threshold = 80 }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const { success } = useHaptic();

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 0) {
      const resisted = Math.min(diff * 0.5, threshold * 1.5);
      setPullDistance(resisted);
    }
  }, [isPulling, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      controls.start({ rotate: 360 });
      success(); // Haptic feedback
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        controls.start({ rotate: 0 });
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, threshold, onRefresh, controls, success]);

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto no-scrollbar"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator with progress */}
      <motion.div
        className="sticky top-0 z-10 flex items-center justify-center pointer-events-none"
        style={{ 
          height: pullDistance > 0 ? pullDistance : undefined,
        }}
      >
        {isPulling && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
          >
            <motion.div
              animate={controls}
              className={`p-2 rounded-full transition-colors ${
                isRefreshing 
                  ? "bg-green-500 text-white" 
                  : pullDistance >= threshold 
                    ? "bg-green-500/80 text-white" 
                    : "bg-white/20 text-white"
              }`}
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
            </motion.div>
            <span className="text-sm text-white">
              {isRefreshing ? "Actualizando..." : pullDistance >= threshold ? "¡Suelta!" : "Desliza para actualizar"}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Content */}
      {children}
    </div>
  );
}
