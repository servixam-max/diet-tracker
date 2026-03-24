"use client";

import { memo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHaptic } from "@/hooks/useHaptic";
import {
  Camera, RotateCcw, Image, AlertCircle, Sparkles, Loader2, ScanLine,
} from "lucide-react";
import type { FoodResult, CameraFacing } from "./types";

interface CameraTabProps {
  mealType: string;
  onResult: (result: FoodResult, imageBase64: string) => void;
}

function CameraTabComponent({ mealType, onResult }: CameraTabProps) {
  const { light } = useHaptic();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<CameraFacing>("environment");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  const startCamera = useCallback(async (facing: CameraFacing = "environment") => {
    setCameraError(null);

    const isSecureContext =
      window.isSecureContext ||
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (!isSecureContext) {
      setCameraError("La cámara requiere HTTPS. Usa localhost o accede via HTTPS.");
      return;
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError("La API de cámara no está disponible en este navegador. Usa la opción de galería.");
      return;
    }

    try {
      stopCamera();
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setFacingMode(facing);
      setIsCameraActive(true);
    } catch {
      setCameraError("No se pudo acceder a la cámara. Permisos denegados.");
    }
  }, [stopCamera]);

  const switchCamera = useCallback(() => {
    startCamera(facingMode === "environment" ? "user" : "environment");
  }, [facingMode, startCamera]);

  const analyzeImage = useCallback(async (base64: string) => {
    setIsAnalyzing(true);
    setAnalyzingProgress(0);
    setAiError(null);
    setShowPreview(true);

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
        onResult(
          {
            description: data.name || "Alimento detectado",
            calories: data.calories || 200,
            protein_g: data.protein || 10,
            carbs_g: data.carbs || 25,
            fat_g: data.fat || 8,
            meal_type: mealType,
            confidence: data.confidence || 0.8,
          },
          base64
        );
      } else {
        setAiError("Error al conectar con el servicio de IA. Inténtalo de nuevo.");
        setShowPreview(false);
      }
    } catch {
      clearInterval(progressInterval);
      setAiError("No se pudo conectar con la IA. Verifica tu conexión a internet.");
      setShowPreview(false);
    } finally {
      setIsAnalyzing(false);
    }
  }, [mealType, onResult]);

  const capturePhoto = useCallback(() => {
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
  }, [light, stopCamera, analyzeImage]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImageBase64(base64);
      await analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  }, [analyzeImage]);

  // Analyzing state (preview)
  if (showPreview) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
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
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <Sparkles size={48} className="text-green-400" />
              </motion.div>
            </div>
          )}
        </div>

        <p className="text-xl font-semibold mb-3">{isAnalyzing ? "Analizando con IA..." : "¡Listo!"}</p>

        {isAnalyzing && (
          <div className="max-w-xs mx-auto space-y-3">
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${analyzingProgress}%` }}
              />
            </div>
            <p className="text-sm text-zinc-400 animate-pulse">Identificando alimentos y calculando nutrientes...</p>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Camera preview area with guides */}
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
        {isCameraActive ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            
            {/* Center alignment guides */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border-2 border-white/20 rounded-2xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-1/2 border-2 border-white/30 rounded-xl" />
              </div>
              <div className="absolute inset-x-0 top-1/3 border-t border-white/10" />
              <div className="absolute inset-x-0 bottom-1/3 border-b border-white/10" />
            </div>
            
            <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center justify-center gap-2">
                <ScanLine size={16} className="text-green-400" />
                <p className="text-white text-sm font-medium">Centra la comida en el marco</p>
              </div>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-center gap-6">
                <motion.button 
                  onClick={switchCamera} 
                  className="p-3 rounded-full bg-white/20 backdrop-blur-sm" 
                  whileTap={{ scale: 0.9 }}
                >
                  <RotateCcw size={24} className="text-white" />
                </motion.button>
                
                {/* Animated capture button */}
                <motion.button 
                  onClick={capturePhoto} 
                  className="relative p-4 rounded-full bg-white shadow-lg"
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90" />
                  </div>
                </motion.button>
                
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
                <motion.button onClick={() => startCamera()} className="px-6 py-3 bg-green-500 rounded-xl text-white font-medium" whileTap={{ scale: 0.95 }}>
                  Reintentar
                </motion.button>
              </>
            ) : (
              <>
                <div className="relative mb-6">
                  <Camera size={64} className="text-zinc-500" />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-green-400/30" />
                  </motion.div>
                </div>
                <p className="text-zinc-400 text-center mb-4">Activa la cámara para hacer una foto de tu comida</p>
                <motion.button onClick={() => startCamera()} className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold shadow-lg" whileTap={{ scale: 0.95 }}>
                  Activar cámara
                </motion.button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input for gallery */}
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />

      {/* AI Error message */}
      {aiError && (
        <motion.div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{aiError}</p>
        </motion.div>
      )}

      <p className="text-center text-sm text-zinc-500">O usa otra opción ↑ (comidas, código de barras, manual)</p>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}

export const CameraTab = memo(CameraTabComponent);
