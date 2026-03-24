"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useHaptic } from "@/hooks/useHaptic";
import { 
  X, Camera, Search, Loader2, Sparkles, Check, ChevronRight, 
  Flame, Zap, Heart, Apple, Wheat, Droplets, Barcode, 
  Utensils, Star, Clock, Filter, Grid3X3, Image, FolderOpen,
  AlertCircle, Wifi, WifiOff, RotateCcw
} from "lucide-react";

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodAdded: () => void;
}

interface FoodResult {
  description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meal_type: string;
  confidence?: number;
}

interface PresetMeal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type: string;
  emoji: string;
  isFavorite?: boolean;
}

const mealTypes = [
  { value: "breakfast", label: "Desayuno", emoji: "🌅", color: "from-orange-400 to-yellow-500" },
  { value: "lunch", label: "Almuerzo", emoji: "☀️", color: "from-green-400 to-emerald-500" },
  { value: "snack", label: "Merienda", emoji: "🍂", color: "from-purple-400 to-pink-500" },
  { value: "dinner", label: "Cena", emoji: "🌙", color: "from-blue-400 to-indigo-500" },
];

type TabType = "camera" | "manual" | "presets" | "barcode";
type CameraFacing = "environment" | "user";

export function AddFoodModal({ isOpen, onClose, onFoodAdded }: AddFoodModalProps) {
  const [step, setStep] = useState<"input" | "photo" | "result">("input");
  const { light, success, warning } = useHaptic();
  const [activeTab, setActiveTab] = useState<TabType>("camera");
  const [mealType, setMealType] = useState("breakfast");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [presets, setPresets] = useState<PresetMeal[]>([]);
  const [presetsLoading, setPresetsLoading] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<CameraFacing>("environment");
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // Manual entry
  const [manualDescription, setManualDescription] = useState("");
  const [manualCalories, setManualCalories] = useState("");
  const [manualProtein, setManualProtein] = useState("");
  const [manualCarbs, setManualCarbs] = useState("");
  const [manualFat, setManualFat] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (isOpen && activeTab === "presets") {
      fetchPresets();
    }
  }, [isOpen, activeTab]);

  function resetForm() {
    setStep("input");
    setActiveTab("camera");
    setImageBase64(null);
    setResult(null);
    setMealType("breakfast");
    setBarcodeInput("");
    setManualDescription("");
    setManualCalories("");
    setManualProtein("");
    setManualCarbs("");
    setManualFat("");
    setCameraError(null);
    setAiError(null);
    stopCamera();
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }

  async function startCamera(facing: CameraFacing = "environment") {
    setCameraError(null);
    
    // Check if we're in a secure context (HTTPS or localhost)
    const isSecureContext = window.isSecureContext || (window.location.protocol === 'https:') || (window.location.hostname === 'localhost') || (window.location.hostname === '127.0.0.1');
    
    if (!isSecureContext) {
      setCameraError("La cámara requiere HTTPS. Usa localhost o accede via HTTPS.");
      return;
    }
    
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("La API de cámara no está disponible en este navegador. Usa la opción de galería.");
      return;
    }
    
    try {
      stopCamera();
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setFacingMode(facing);
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("No se pudo acceder a la cámara. Permisos denegados.");
    }
  }

  function switchCamera() {
    const newFacing = facingMode === "environment" ? "user" : "environment";
    startCamera(newFacing);
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    light();
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setImageBase64(dataUrl);
      stopCamera();
      analyzeImage(dataUrl);
    }
  }

  async function fetchPresets() {
    setPresetsLoading(true);
    try {
      const response = await fetch(`/api/weekly-meals?type=${mealType}`);
      if (response.ok) {
        const data = await response.json();
        setPresets(data.meals || []);
      }
    } catch (error) {
      console.error("Error fetching presets:", error);
    } finally {
      setPresetsLoading(false);
    }
  }

  async function handlePhotoCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImageBase64(base64);
      setStep("photo");
      await analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  }

  async function analyzeImage(base64: string) {
    setIsAnalyzing(true);
    setAnalyzingProgress(0);
    setAiError(null);

    const progressInterval = setInterval(() => {
      setAnalyzingProgress(prev => Math.min(prev + 5, 90));
    }, 200);

    try {
      const response = await fetch("/api/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      clearInterval(progressInterval);
      setAnalyzingProgress(100);

      if (response.ok) {
        const data = await response.json();
        setResult({
          description: data.name || "Alimento detectado",
          calories: data.calories || 200,
          protein_g: data.protein || 10,
          carbs_g: data.carbs || 25,
          fat_g: data.fat || 8,
          meal_type: mealType,
          confidence: data.confidence || 0.8,
        });
        setStep("result");
        
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8 },
          colors: ["#22c55e", "#4ade80", "#86efac"],
        });
      } else {
        setAiError("Error al conectar con el servicio de IA. Inténtalo de nuevo.");
        setStep("input");
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Analysis error:", error);
      setAiError("No se pudo conectar con la IA. Verifica tu conexión a internet.");
      setStep("input");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleBarcodeSearch() {
    if (!barcodeInput.trim()) return;

    setIsScanning(true);
    try {
      const response = await fetch(`/api/barcode-lookup?barcode=${barcodeInput}`);
      if (response.ok) {
        const data = await response.json();
        setResult({
          description: data.name,
          calories: data.calories,
          protein_g: data.protein,
          carbs_g: data.carbs,
          fat_g: data.fat,
          meal_type: mealType,
          confidence: data.found ? 1 : 0.5,
        });
        success();
        setStep("result");
      }
    } catch (error) {
      console.error("Barcode search error:", error);
    } finally {
      setIsScanning(false);
    }
  }

  function selectPreset(preset: PresetMeal) {
    setResult({
      description: preset.name,
      calories: preset.calories,
      protein_g: preset.protein,
      carbs_g: preset.carbs,
      fat_g: preset.fat,
      meal_type: mealType,
      confidence: 1,
    });
    setStep("result");
  }

  async function handleSaveFood() {
    if (!result) return;

    setIsSaving(true);

    try {
      const response = await fetch("/api/food-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal_type: mealType,
          description: result.description,
          calories: Number(result.calories),
          protein_g: Number(result.protein_g),
          carbs_g: Number(result.carbs_g),
          fat_g: Number(result.fat_g),
          source: imageBase64 ? "photo" : "preset",
          image_url: imageBase64,
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
        setTimeout(() => onClose(), 800);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleManualSave() {
    if (!manualDescription || !manualCalories) return;

    setIsSaving(true);

    try {
      const response = await fetch("/api/food-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal_type: mealType,
          description: manualDescription,
          calories: Number(manualCalories),
          protein_g: Number(manualProtein) || 0,
          carbs_g: Number(manualCarbs) || 0,
          fat_g: Number(manualFat) || 0,
          source: "manual",
        }),
      });

      if (response.ok) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#22c55e", "#4ade80", "#86efac"],
        });
        success();
        onFoodAdded();
        setTimeout(() => onClose(), 800);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  }

  function updateResult(field: keyof FoodResult, value: string | number) {
    if (result) {
      setResult({ ...result, [field]: value });
    }
  }

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
            onClick={onClose}
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
                    onClick={onClose}
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
                <div className="flex gap-1 mt-4 p-1 bg-white/5 rounded-xl">
                  {[
                    { id: "camera", icon: Camera, label: "Cámara" },
                    { id: "presets", icon: Utensils, label: "Comidas" },
                    { id: "barcode", icon: Barcode, label: "Código" },
                    { id: "manual", icon: Edit3, label: "Manual" },
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
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
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* CAMERA TAB */}
                {activeTab === "camera" && step === "input" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* Camera preview area */}
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
                      {isCameraActive ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          {/* Camera controls overlay */}
                          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex items-center justify-center gap-6">
                              {/* Switch camera */}
                              <motion.button
                                onClick={switchCamera}
                                className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
                                whileTap={{ scale: 0.9 }}
                              >
                                <RotateCcw size={24} className="text-white" />
                              </motion.button>
                              
                              {/* Capture button */}
                              <motion.button
                                onClick={capturePhoto}
                                className="p-4 rounded-full bg-white shadow-lg"
                                whileTap={{ scale: 0.9 }}
                              >
                                <div className="w-12 h-12 rounded-full bg-green-500 border-4 border-white" />
                              </motion.button>
                              
                              {/* Gallery */}
                              <motion.button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
                                whileTap={{ scale: 0.9 }}
                              >
                                <Image size={24} className="text-white" />
                              </motion.button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-6">
                          {cameraError ? (
                            <>
                              <AlertCircle size={48} className="text-red-400 mb-4" />
                              <p className="text-red-400 text-center mb-4">{cameraError}</p>
                              <motion.button
                                onClick={() => startCamera()}
                                className="px-6 py-3 bg-green-500 rounded-xl text-white font-medium"
                                whileTap={{ scale: 0.95 }}
                              >
                                Reintentar
                              </motion.button>
                            </>
                          ) : (
                            <>
                              <Camera size={48} className="text-zinc-500 mb-4" />
                              <p className="text-zinc-400 text-center mb-4">
                                Activa la cámara para hacer una foto de tu comida
                              </p>
                              <motion.button
                                onClick={() => startCamera()}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold shadow-lg"
                                whileTap={{ scale: 0.95 }}
                              >
                                Activar cámara
                              </motion.button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Hidden file input for gallery */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e: any) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = async (event) => {
                            const base64 = event.target?.result as string;
                            setImageBase64(base64);
                            setStep("photo");
                            await analyzeImage(base64);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />

                    {/* AI Error message */}
                    {aiError && (
                      <motion.div
                        className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                        <p className="text-red-300 text-sm">{aiError}</p>
                      </motion.div>
                    )}

                    <p className="text-center text-sm text-zinc-500">
                      O usa otra opción ↑ (comidas, código de barras, manual)
                    </p>
                  </motion.div>
                )}

                {/* Analyzing state */}
                {step === "photo" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="relative w-40 h-40 mx-auto mb-8">
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-green-500/30"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      {imageBase64 && (
                        <motion.img
                          src={imageBase64}
                          alt="Food"
                          className="w-full h-full object-cover rounded-2xl shadow-2xl"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        />
                      )}
                      {isAnalyzing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles size={48} className="text-green-400" />
                          </motion.div>
                        </div>
                      )}
                    </div>

                    <p className="text-xl font-semibold mb-3">
                      {isAnalyzing ? "Analizando con IA..." : "¡Listo!"}
                    </p>

                    {isAnalyzing && (
                      <div className="max-w-xs mx-auto space-y-3">
                        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${analyzingProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-zinc-400 animate-pulse">
                          Identificando alimentos y calculando nutrientes...
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* PRESETS TAB */}
                {activeTab === "presets" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {presetsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Loader2 size={32} className="text-green-400" />
                        </motion.div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-zinc-400">
                          {presets.length} comidas disponibles
                        </p>

                        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                          {presets.map((preset, i) => (
                            <motion.button
                              key={preset.name}
                              onClick={() => selectPreset(preset)}
                              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all text-left"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{preset.emoji}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{preset.name}</p>
                                  <p className="text-xs text-zinc-500">
                                    P: {preset.protein}g · C: {preset.carbs}g · G: {preset.fat}g
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-orange-400">{preset.calories}</p>
                                  <p className="text-xs text-zinc-500">kcal</p>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* BARCODE TAB */}
                {activeTab === "barcode" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* Barcode scanner with camera */}
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
                      {isCameraActive && activeTab === "barcode" ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          {/* Scanline overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3/4 h-1 bg-green-400 shadow-lg shadow-green-400/50 animate-pulse" />
                          </div>
                          {/* Controls */}
                          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex items-center justify-center gap-4">
                              <motion.button
                                onClick={switchCamera}
                                className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
                                whileTap={{ scale: 0.9 }}
                              >
                                <RotateCcw size={20} className="text-white" />
                              </motion.button>
                              <p className="text-white text-sm">Apunta al código de barras</p>
                              <motion.button
                                onClick={() => {
                                  stopCamera();
                                  setActiveTab("barcode");
                                }}
                                className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
                                whileTap={{ scale: 0.9 }}
                              >
                                <X size={20} className="text-white" />
                              </motion.button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-6">
                          <Barcode size={48} className="text-zinc-500 mb-4" />
                          <p className="text-zinc-400 text-center mb-4">
                            Escanea el código de barras de un producto
                          </p>
                          <motion.button
                            onClick={() => startCamera()}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white font-bold shadow-lg"
                            whileTap={{ scale: 0.95 }}
                          >
                            Activar cámara
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Manual barcode input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        placeholder="O ingresa el código manualmente"
                        className="flex-1 p-3 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-blue-500/50 text-white font-mono"
                        onKeyDown={(e) => e.key === "Enter" && handleBarcodeSearch()}
                      />
                      <motion.button
                        onClick={handleBarcodeSearch}
                        disabled={!barcodeInput.trim() || isScanning}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white font-medium disabled:opacity-50"
                        whileTap={{ scale: 0.95 }}
                      >
                        {isScanning ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                            <Loader2 size={20} />
                          </motion.div>
                        ) : (
                          <Search size={20} />
                        )}
                      </motion.button>
                    </div>

                    <p className="text-xs text-zinc-500 text-center">
                      Usa la cámara o ingresa el código manualmente (Ej: 8410525800129)
                    </p>
                  </motion.div>
                )}

                {/* MANUAL TAB */}
                {activeTab === "manual" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        value={manualDescription}
                        onChange={(e) => setManualDescription(e.target.value)}
                        placeholder="¿Qué has comido?"
                        className="w-full p-4 pl-12 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-green-500/50 text-white"
                      />
                      <Apple size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1.5">Calorías (kcal)</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={manualCalories}
                            onChange={(e) => setManualCalories(e.target.value)}
                            placeholder="0"
                            className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-orange-500/50 text-white"
                          />
                          <Flame size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400/70" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1.5">Proteínas (g)</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={manualProtein}
                            onChange={(e) => setManualProtein(e.target.value)}
                            placeholder="0"
                            className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-blue-500/50 text-white"
                          />
                          <Zap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/70" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1.5">Carbos (g)</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={manualCarbs}
                            onChange={(e) => setManualCarbs(e.target.value)}
                            placeholder="0"
                            className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-yellow-500/50 text-white"
                          />
                          <Wheat size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400/70" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1.5">Grasas (g)</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={manualFat}
                            onChange={(e) => setManualFat(e.target.value)}
                            placeholder="0"
                            className="w-full p-3 pl-10 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-red-500/50 text-white"
                          />
                          <Droplets size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400/70" />
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={handleManualSave}
                      disabled={!manualDescription || !manualCalories || isSaving}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg shadow-green-500/30 disabled:opacity-50"
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSaving ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                            <Loader2 size={20} />
                          </motion.div>
                          Guardando...
                        </span>
                      ) : (
                        <>
                          <Check size={20} className="inline mr-2" />
                          Guardar comida
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}

                {/* RESULT STEP */}
                {step === "result" && result && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {imageBase64 && (
                      <motion.div
                        className="relative rounded-2xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <img src={imageBase64} alt="Food" className="w-full h-36 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {result.confidence && result.confidence < 1 && (
                          <span className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/90 text-white flex items-center gap-1.5">
                            <Sparkles size={12} />
                            {Math.round(result.confidence * 100)}% seguro
                          </span>
                        )}
                      </motion.div>
                    )}

                    <input
                      type="text"
                      value={result.description}
                      onChange={(e) => updateResult("description", e.target.value)}
                      className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-green-500/50 text-white text-xl font-semibold"
                    />

                    {/* Calorie card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/5 border border-orange-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                          <Flame size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="text-orange-400 font-semibold">Calorías</p>
                          <p className="text-xs text-zinc-400">kcal</p>
                        </div>
                      </div>
                      <input
                        type="number"
                        value={result.calories}
                        onChange={(e) => updateResult("calories", e.target.value)}
                        className="w-full p-2 bg-white/5 rounded-xl border border-orange-500/30 outline-none focus:border-orange-500/50 text-white text-3xl font-bold text-center"
                      />
                    </div>

                    {/* Macros */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Proteínas", value: result.protein_g, setter: (v: any) => updateResult("protein_g", v), color: "blue", icon: Zap },
                        { label: "Carbos", value: result.carbs_g, setter: (v: any) => updateResult("carbs_g", v), color: "yellow", icon: Wheat },
                        { label: "Grasas", value: result.fat_g, setter: (v: any) => updateResult("fat_g", v), color: "red", icon: Droplets },
                      ].map((macro, i) => (
                        <div
                          key={macro.label}
                          className={`p-4 rounded-2xl bg-${macro.color}-500/10 border border-${macro.color}-500/30 text-center`}
                        >
                          <macro.icon size={18} className={`text-${macro.color}-400 mx-auto mb-1`} />
                          <input
                            type="number"
                            value={macro.value}
                            onChange={(e) => macro.setter(e.target.value)}
                            className="w-full bg-transparent text-2xl font-bold text-white text-center outline-none"
                          />
                          <p className="text-xs text-zinc-400">{macro.label}</p>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      onClick={handleSaveFood}
                      disabled={isSaving || !result.description}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-xl shadow-green-500/30 disabled:opacity-50"
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSaving ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                            <Loader2 size={20} />
                          </motion.div>
                          Guardando...
                        </span>
                      ) : (
                        <>
                          <Check size={20} className="inline mr-2" />
                          Añadir al diario
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {/* Hidden canvas for photo capture */}
              <canvas ref={canvasRef} className="hidden" />

              <div className="h-8" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
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
