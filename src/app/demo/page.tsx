"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { DemoBanner } from "@/components/DemoBanner";

export default function DemoPage() {
  const router = useRouter();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    localStorage.setItem("demo-mode", "true");
    document.cookie = "demo-mode=true; path=/; max-age=86400";
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      {!bannerDismissed && <DemoBanner onDismiss={() => setBannerDismissed(true)} />}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-6xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🍽️
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">Diet Tracker</h1>
        <p className="text-zinc-400 mb-4">Cargando modo demo...</p>
        <motion.div className="w-48 h-1 mx-auto rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
