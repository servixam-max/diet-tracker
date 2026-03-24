"use client";

import { memo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useHaptic } from "@/hooks/useHaptic";
import {
  Barcode, Search, Loader2, RotateCcw, X,
} from "lucide-react";
import type { FoodResult, CameraFacing } from "./types";

interface BarcodeTabProps {
  mealType: string;
  onResult: (result: FoodResult) => void;
}

function BarcodeTabComponent({ mealType, onResult }: BarcodeTabProps) {
  const { success } = useHaptic();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [barcodeInput, setBarcodeInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<CameraFacing>("environment");
  const [isCameraActive, setIsCameraActive] = useState(false);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  const startCamera = useCallback(async (facing: CameraFacing = "environment") => {
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
      console.error("Camera error for barcode");
    }
  }, [stopCamera]);

  const switchCamera = useCallback(() => {
    startCamera(facingMode === "environment" ? "user" : "environment");
  }, [facingMode, startCamera]);

  const handleBarcodeSearch = useCallback(async () => {
    if (!barcodeInput.trim()) return;

    setIsScanning(true);
    try {
      const response = await fetch(`/api/barcode-lookup?barcode=${barcodeInput}`);
      if (response.ok) {
        const data = await response.json();
        onResult({
          description: data.name,
          calories: data.calories,
          protein_g: data.protein,
          carbs_g: data.carbs,
          fat_g: data.fat,
          meal_type: mealType,
          confidence: data.found ? 1 : 0.5,
        });
        success();
      }
    } catch (error) {
      console.error("Barcode search error:", error);
    } finally {
      setIsScanning(false);
    }
  }, [barcodeInput, mealType, onResult, success]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Barcode scanner with camera */}
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
        {isCameraActive ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {/* Scanline overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-1 bg-green-400 shadow-lg shadow-green-400/50 animate-pulse" />
            </div>
            {/* Controls */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-center gap-4">
                <motion.button onClick={switchCamera} className="p-3 rounded-full bg-white/20 backdrop-blur-sm" whileTap={{ scale: 0.9 }}>
                  <RotateCcw size={20} className="text-white" />
                </motion.button>
                <p className="text-white text-sm">Apunta al código de barras</p>
                <motion.button
                  onClick={() => {
                    stopCamera();
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
            <p className="text-zinc-400 text-center mb-4">Escanea el código de barras de un producto</p>
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
  );
}

export const BarcodeTab = memo(BarcodeTabComponent);
