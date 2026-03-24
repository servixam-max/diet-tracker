"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Barcode, Loader2, X, Check, AlertCircle } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface ScannedProduct {
  barcode: string;
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  image?: string;
}

interface BarcodeScannerProps {
  onProductScanned?: (product: ScannedProduct) => void;
}

export function BarcodeScanner({ onProductScanned }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { light, success } = useHaptic();

  // Mock product database for demo
  const mockProducts: Record<string, ScannedProduct> = {
    "8410525010457": {
      barcode: "8410525010457",
      name: "Leche Semidesnatada",
      brand: "Mercadona",
      calories: 45,
      protein: 3.2,
      carbs: 4.8,
      fat: 1.5,
      servingSize: "200ml",
    },
    "5449000000996": {
      barcode: "5449000000996",
      name: "Coca-Cola",
      brand: "Coca-Cola",
      calories: 42,
      protein: 0,
      carbs: 10.6,
      fat: 0,
      servingSize: "100ml",
    },
    "8410088010289": {
      barcode: "8410088010289",
      name: "Yogur Griego Natural",
      brand: "Danone",
      calories: 97,
      protein: 9,
      carbs: 4,
      fat: 5,
      servingSize: "150g",
    },
  };

  async function searchProduct(barcode: string) {
    if (!barcode.trim()) return;
    
    setIsLoading(true);
    setError(null);
    light();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const product = mockProducts[barcode];
    if (product) {
      setScannedProduct(product);
      success();
    } else {
      setError("Producto no encontrado. ¿Quieres añadirlo manualmente?");
    }
    
    setIsLoading(false);
  }

  function handleManualSearch() {
    searchProduct(manualBarcode);
  }

  function confirmProduct() {
    if (scannedProduct && onProductScanned) {
      success();
      onProductScanned(scannedProduct);
      setScannedProduct(null);
    }
  }

  function clearProduct() {
    light();
    setScannedProduct(null);
    setError(null);
    setManualBarcode("");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Barcode size={18} className="text-cyan-400" />
          <h3 className="font-semibold">Escanear producto</h3>
        </div>
        <span className="px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium">
          OpenFoodFacts
        </span>
      </div>

      {/* Scanner area */}
      <motion.div
        className="relative aspect-video rounded-2xl overflow-hidden bg-black/50 border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {isScanning ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-1 bg-cyan-400 animate-pulse rounded-full" />
            </div>
            <button
              onClick={() => setIsScanning(false)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/50"
            >
              <X size={20} className="text-white" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Camera size={48} className="text-zinc-600 mb-3" />
            <p className="text-zinc-400 text-center mb-4">
              Escanea el código de barras<br />del producto
            </p>
            <motion.button
              onClick={() => { light(); setIsScanning(true); }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium"
              whileTap={{ scale: 0.98 }}
            >
              Activar cámara
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Manual barcode entry */}
      <div className="space-y-3">
        <p className="text-sm text-zinc-500 text-center">o introduce el código manualmente:</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Código de barras..."
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-cyan-500/50"
          />
          <motion.button
            onClick={handleManualSearch}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium disabled:opacity-50"
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Buscar"}
          </motion.button>
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium">{error}</p>
              <p className="text-sm text-zinc-400 mt-1">
                Productos disponibles: 8410525010457 (Leche), 5449000000996 (Coca-Cola), 8410088010289 (Yogur)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanned product */}
      <AnimatePresence>
        {scannedProduct && (
          <motion.div
            className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-lg">{scannedProduct.name}</p>
                <p className="text-sm text-zinc-400">{scannedProduct.brand}</p>
                <p className="text-xs text-zinc-500 mt-1">Código: {scannedProduct.barcode}</p>
              </div>
              <button
                onClick={clearProduct}
                className="p-1.5 rounded-lg hover:bg-white/10"
              >
                <X size={18} className="text-zinc-500" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center p-2 rounded-xl bg-white/5">
                <p className="text-lg font-bold text-orange-400">{scannedProduct.calories}</p>
                <p className="text-xs text-zinc-500">kcal</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-white/5">
                <p className="text-lg font-bold text-blue-400">{scannedProduct.protein}g</p>
                <p className="text-xs text-zinc-500">Proteína</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-white/5">
                <p className="text-lg font-bold text-yellow-400">{scannedProduct.carbs}g</p>
                <p className="text-xs text-zinc-500">Carbos</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-white/5">
                <p className="text-lg font-bold text-red-400">{scannedProduct.fat}g</p>
                <p className="text-xs text-zinc-500">Grasa</p>
              </div>
            </div>

            <p className="text-sm text-zinc-400 mb-4">
              Porción: {scannedProduct.servingSize}
            </p>

            <motion.button
              onClick={confirmProduct}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              <Check size={18} />
              Añadir al registro
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
