"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { X, Camera, Utensils, Barcode } from "lucide-react";
import {
  CameraTab,
  ManualEntryTab,
  PresetsTab,
  BarcodeTab,
  FoodResultView,
  mealTypes,
} from "./add-food";
import type { FoodResult, TabType } from "./add-food";

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodAdded: () => void;
}

// Missing icon - Edit3
function Edit3({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

const tabs = [
  { id: "camera" as const, icon: Camera, label: "Cámara" },
  { id: "presets" as const, icon: Utensils, label: "Comidas" },
  { id: "barcode" as const, icon: Barcode, label: "Código" },
  { id: "manual" as const, icon: Edit3, label: "Manual" },
];

export function AddFoodModal({ isOpen, onClose, onFoodAdded }: AddFoodModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("camera");
  const [mealType, setMealType] = useState("breakfast");
  const [result, setResult] = useState<FoodResult | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Reset state when modal opens
  const handleClose = useCallback(() => {
    setActiveTab("camera");
    setMealType("breakfast");
    setResult(null);
    setImageBase64(null);
    setShowResult(false);
    onClose();
  }, [onClose]);

  // Camera tab callback — receives result + image
  const handleCameraResult = useCallback((foodResult: FoodResult, img: string) => {
    setResult(foodResult);
    setImageBase64(img);
    setShowResult(true);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ["#22c55e", "#4ade80", "#86efac"],
    });
  }, []);

  // Presets / Barcode callback — receives result only
  const handleTabResult = useCallback((foodResult: FoodResult) => {
    setResult(foodResult);
    setImageBase64(null);
    setShowResult(true);
  }, []);

  const handleUpdateResult = useCallback((updated: FoodResult) => {
    setResult(updated);
  }, []);

  const handleSaveResult = useCallback(
    async (foodResult: FoodResult, img: string | null) => {
      const response = await fetch("/api/food-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal_type: mealType,
          description: foodResult.description,
          calories: Number(foodResult.calories),
          protein_g: Number(foodResult.protein_g),
          carbs_g: Number(foodResult.carbs_g),
          fat_g: Number(foodResult.fat_g),
          source: img ? "photo" : "preset",
          image_url: img,
        }),
      });

      if (response.ok) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#22c55e", "#4ade80", "#86efac", "#fbbf24"],
        });
        onFoodAdded();
        setTimeout(() => handleClose(), 800);
      }
    },
    [mealType, onFoodAdded, handleClose]
  );

  // Memoize active content to avoid unnecessary re-renders
  const activeContent = useMemo(() => {
    if (showResult && result) {
      return (
        <FoodResultView
          result={result}
          imageBase64={imageBase64}
          onSave={handleSaveResult}
          onUpdateResult={handleUpdateResult}
        />
      );
    }

    switch (activeTab) {
      case "camera":
        return <CameraTab mealType={mealType} onResult={handleCameraResult} />;
      case "presets":
        return <PresetsTab mealType={mealType} onResult={handleTabResult} />;
      case "barcode":
        return <BarcodeTab mealType={mealType} onResult={handleTabResult} />;
      case "manual":
        return <ManualEntryTab mealType={mealType} onFoodAdded={onFoodAdded} onClose={handleClose} />;
      default:
        return null;
    }
  }, [activeTab, mealType, showResult, result, imageBase64, handleCameraResult, handleTabResult, handleSaveResult, handleUpdateResult, onFoodAdded, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-[#0a0a0f] h-full overflow-y-auto">
              {/* Glowing orb */}
              <motion.div
                className="absolute top-20 right-10 w-48 h-48 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Header */}
              <div className="sticky top-0 bg-[#0a0a0f]/95 backdrop-blur-xl z-10 px-5 pt-4 pb-3 border-b border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <motion.h2
                    className="text-xl font-bold"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    Añadir comida
                  </motion.h2>
                  <motion.button
                    onClick={handleClose}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} className="text-zinc-400" />
                  </motion.button>
                </div>

                {/* Meal type selector */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {mealTypes.map((type) => (
                    <motion.button
                      key={type.value}
                      onClick={() => setMealType(type.value)}
                      className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                        mealType === type.value
                          ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                          : "bg-white/5 border border-white/10 text-zinc-400"
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-1.5">{type.emoji}</span>
                      {type.label}
                    </motion.button>
                  ))}
                </div>

                {/* Tab selector */}
                {!showResult && (
                  <div className="flex gap-1 mt-4 p-1 bg-white/5 rounded-xl">
                    {tabs.map((tab) => (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          activeTab === tab.id
                            ? "bg-white/10 text-white"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <tab.icon size={16} />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">{activeContent}</div>

              <div className="h-8" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
