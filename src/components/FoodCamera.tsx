"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Flashlight, Image, RotateCcw, Check, Loader2 } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface FoodCameraProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

export function FoodCamera({ isOpen, onClose, onCapture }: FoodCameraProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { light, success } = useHaptic();

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setCameraError(null);
    } catch (err: any) {
      console.error("Camera error:", err);
      setHasPermission(false);
      if (err.name === "NotAllowedError") {
        setCameraError("Por favor, permite el acceso a la cámara");
      } else if (err.name === "NotFoundError") {
        setCameraError("No se encontró cámara en este dispositivo");
      } else {
        setCameraError("Error al iniciar la cámara");
      }
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }

  function capturePhoto() {
    light();
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      setCapturedImage(imageData);
      success();
    }
  }

  function retakePhoto() {
    light();
    setCapturedImage(null);
  }

  async function analyzePhoto() {
    setIsAnalyzing(true);
    light();
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsAnalyzing(false);
    success();
    onCapture(capturedImage!);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        <button onClick={onClose} className="p-2 rounded-full bg-black/50 text-white">
          <X size={24} />
        </button>
        <h2 className="text-white font-medium">Fotografiar comida</h2>
        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`p-2 rounded-full ${flashOn ? "bg-yellow-500 text-black" : "bg-black/50 text-white"}`}
        >
          <Flashlight size={24} />
        </button>
      </div>

      {/* Camera view */}
      <div className="relative w-full h-full flex items-center justify-center">
        {hasPermission === null && (
          <div className="text-white text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 border-4 border-white/20 border-t-green-500 rounded-full mx-auto mb-4"
            />
            <p>Iniciando cámara...</p>
          </div>
        )}

        {hasPermission === false && (
          <div className="text-white text-center p-6">
            <Camera size={48} className="mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-bold mb-2">Sin acceso a la cámara</h3>
            <p className="text-zinc-400 mb-4">{cameraError}</p>
            <button onClick={startCamera} className="px-6 py-3 rounded-xl bg-green-500 text-white font-medium">
              Reintentar
            </button>
          </div>
        )}

        {hasPermission === true && !capturedImage && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Capture button */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8">
              <button className="p-4 rounded-full bg-white/20">
                <Image size={24} className="text-white" />
              </button>
              <motion.button
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full bg-white border-8 border-green-500"
                whileTap={{ scale: 0.9 }}
              />
              <button className="p-4 rounded-full bg-white/20">
                <RotateCcw size={24} className="text-white" />
              </button>
            </div>

            {/* Overlay guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-dashed border-white/50 rounded-3xl" />
            </div>
          </>
        )}

        {/* Captured image preview */}
        {capturedImage && (
          <div className="relative w-full h-full">
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            
            {/* Analysis overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center text-white">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 border-4 border-white/20 border-t-green-500 rounded-full mx-auto mb-4"
                  />
                  <p className="text-xl font-bold mb-2">Analizando comida...</p>
                  <p className="text-zinc-400">Identificando alimentos y calculando macronutrientes</p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="absolute bottom-8 left-4 right-4 flex gap-3">
              <motion.button
                onClick={retakePhoto}
                className="flex-1 py-4 rounded-2xl bg-white/20 text-white font-bold"
                whileTap={{ scale: 0.98 }}
              >
                Repetir foto
              </motion.button>
              <motion.button
                onClick={analyzePhoto}
                disabled={isAnalyzing}
                className="flex-1 py-4 rounded-2xl bg-green-500 text-white font-bold disabled:opacity-50"
                whileTap={{ scale: 0.98 }}
              >
                Analizar
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}
