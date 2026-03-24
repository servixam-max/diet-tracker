"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, Loader2, Sparkles, Flame } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface FoodAnalysisResult {
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  suggestions: string[];
}

interface FoodAnalysisProps {
  onFoodLogged?: (food: FoodAnalysisResult) => void;
}

export function FoodAnalysis({ onFoodLogged }: FoodAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { light, success } = useHaptic();

  async function analyzeImage(file: File) {
    setIsAnalyzing(true);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    
    // Simulated AI analysis (would call Ollama llava-llama3 in production)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock result based on filename/random
    const mockResults: FoodAnalysisResult[] = [
      {
        name: "Ensalada Mediterránea",
        confidence: 0.92,
        calories: 280,
        protein: 12,
        carbs: 24,
        fat: 16,
        servingSize: "1 bowl (300g)",
        suggestions: ["Añade pollo para más proteína", "Sirve con pan integral"],
      },
      {
        name: "Tostada con Aguacate",
        confidence: 0.88,
        calories: 320,
        protein: 8,
        carbs: 35,
        fat: 18,
        servingSize: "2 tostadas",
        suggestions: ["Añade huevo para más proteína", "Usa pan integral"],
      },
      {
        name: "Bowl de Frutas con Yogur",
        confidence: 0.95,
        calories: 250,
        protein: 15,
        carbs: 40,
        fat: 6,
        servingSize: "1 bowl (250g)",
        suggestions: ["Añade granola para más fibra", "Usa yogur griego para más proteína"],
      },
    ];
    
    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    setResult(randomResult);
    setIsAnalyzing(false);
    success();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      light();
      analyzeImage(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      light();
      analyzeImage(file);
    }
  }

  function handleConfirm() {
    if (result && onFoodLogged) {
      success();
      onFoodLogged(result);
      setResult(null);
      setImagePreview(null);
    }
  }

  function handleClear() {
    light();
    setResult(null);
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera size={18} className="text-violet-400" />
          <h3 className="font-semibold">Análisis de comida</h3>
        </div>
        <span className="px-2 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium">
          IA Vision
        </span>
      </div>

      <div
        className={`relative rounded-2xl border-2 border-dashed transition-colors ${
          isAnalyzing ? "border-violet-500/50 bg-violet-500/5" : "border-white/10 hover:border-violet-500/30"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          disabled={isAnalyzing}
        />

        <AnimatePresence mode="wait">
          {imagePreview ? (
            <motion.div
              key="preview"
              className="relative aspect-video overflow-hidden rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <img
                src={imagePreview}
                alt="Food preview"
                className="w-full h-full object-cover"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 size={32} className="animate-spin mx-auto mb-2 text-violet-400" />
                    <p className="text-sm text-white">Analizando imagen...</p>
                    <p className="text-xs text-zinc-400 mt-1">Detectando alimentos</p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              className="p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Camera size={40} className="mx-auto mb-3 text-zinc-600" />
              <p className="text-zinc-400 mb-2">Toma una foto o arrastra una imagen</p>
              <p className="text-xs text-zinc-500">La IA identificará los alimentos automáticamente</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-lg">{result.name}</h4>
                <p className="text-sm text-zinc-400">{result.servingSize}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-violet-400" />
                <span className="text-sm text-violet-400">{Math.round(result.confidence * 100)}% conf.</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center p-2 rounded-xl bg-white/5">
                <Flame size={16} className="mx-auto mb-1 text-orange-400" />
                <p className="text-lg font-bold">{result.calories}</p>
                <p className="text-xs text-zinc-500">kcal</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-white/5">
                <p className="text-lg font-bold text-blue-400">{result.protein}g</p>
                <p className="text-xs text-zinc-500">Proteína</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-white/5">
                <p className="text-lg font-bold text-yellow-400">{result.carbs}g</p>
                <p className="text-xs text-zinc-500">Carbos</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-white/5">
                <p className="text-lg font-bold text-red-400">{result.fat}g</p>
                <p className="text-xs text-zinc-500">Grasa</p>
              </div>
            </div>

            {result.suggestions.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-zinc-500 mb-2">Sugerencias:</p>
                <div className="flex flex-wrap gap-2">
                  {result.suggestions.map((suggestion, i) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-white/5 text-xs text-zinc-400">
                      {suggestion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <motion.button
                onClick={handleClear}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-medium"
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>
              <motion.button
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium"
                whileTap={{ scale: 0.98 }}
              >
                Registrar comida
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !isAnalyzing && (
        <div className="flex gap-2">
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-medium flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Camera size={18} />
            Tomar foto
          </motion.button>
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-medium flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Upload size={18} />
            Subir imagen
          </motion.button>
        </div>
      )}
    </div>
  );
}
