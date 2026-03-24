"use client";

import { memo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useHaptic } from "@/hooks/useHaptic";
import {
  Barcode, Search, Loader2, RotateCcw, X, Check,
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
  const [scannedProduct, setScannedProduct] = useState<FoodResult | null>(null);

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
        const result: FoodResult = {
          description: data.name,
          calories: data.calories,
          protein_g: data.protein,
          carbs_g: data.carbs,
          fat_g: data.fat,
          meal_type: mealType,
          confidence: data.found ? 1 : 0.5,
        };
        setScannedProduct(result);
        success();
      }
    } catch (error) {
      console.error("Barcode search error:", error);
    } finally {
      setIsScanning(false);
    }
  }, [barcodeInput, mealType, success]);

  const handleAddToLog = useCallback(() => {
    if (scannedProduct) {
      onResult(scannedProduct);
      setScannedProduct(null);
      setBarcodeInput("");
    }
  }, [scannedProduct, onResult]);

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

      {/* Product info after scan */}
      {scannedProduct && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-green-500/20 border border-green-500/30"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-green-400 text-sm font-medium">Producto detectado</p>
              <p className="text-white font-semibold">{scannedProduct.description}</p>
            </div>
            <Check size={20} className="text-green-400" />
          </div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="text-center p-2 rounded-xl bg-white/5">
              <p className="text-xs text-zinc-400">Cal</p>
              <p className="text-sm font-bold text-white">{scannedProduct.calories}</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/5">
              <p className="text-xs text-zinc-400">Prot</p>
              <p className="text-sm font-bold text-blue-400">{scannedProduct.protein_g}g</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/5">
              <p className="text-xs text-zinc-400">Carb</p>
              <p className="text-sm font-bold text-yellow-400">{scannedProduct.carbs_g}g</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/5">
              <p className="text-xs text-zinc-400">Gras</p>
              <p className="text-sm font-bold text-red-400">{scannedProduct.fat_g}g</p>
            </div>
          </div>
          <motion.button
            onClick={handleAddToLog}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold"
            whileTap={{ scale: 0.98 }}
          >
            Añadir al registro
          </motion.button>
        </motion.div>
      )}

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
