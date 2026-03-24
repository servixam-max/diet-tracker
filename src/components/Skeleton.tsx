"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string;
  height?: string;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({ 
  className = "", 
  variant = "rectangular",
  width,
  height,
  animation = "pulse"
}: SkeletonProps) {
  const baseClasses = "bg-zinc-800/50 overflow-hidden relative";
  const variantClasses = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded",
    rounded: "rounded-xl",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
    none: "",
  };

  const style = {
    width: width || "100%",
    height: height || (variant === "text" ? "1rem" : "4rem"),
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}

interface SkeletonCardProps {
  lines?: number;
  showImage?: boolean;
  showHeader?: boolean;
}

export function SkeletonCard({ lines = 3, showImage = false, showHeader = false }: SkeletonCardProps) {
  return (
    <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
      {showImage && (
        <Skeleton variant="rounded" height="120px" className="w-full" />
      )}
      
      {showHeader && (
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width="40px" height="40px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} variant="text" width={`${100 - i * 10}%`} />
        ))}
      </div>
    </div>
  );
}

interface SkeletonListProps {
  items?: number;
  showImage?: boolean;
}

export function SkeletonList({ items = 4, showImage = false }: SkeletonListProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard 
          key={i} 
          lines={2} 
          showImage={showImage}
          showHeader={false}
        />
      ))}
    </div>
  );
}
