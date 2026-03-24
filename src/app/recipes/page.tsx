"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/ParticleBackground";
import { RecipeBook } from "@/components/RecipeBook";
import { BottomNavBar } from "@/components/BottomNavBar";

export default function RecipesPage() {
  const [userId] = useState("demo-user");

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-24">
      <ParticleBackground />
      
      <motion.header 
        className="relative z-10 px-5 pt-8 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">Recetas</h1>
        <p className="text-zinc-400 text-sm mt-1">Recetas reales por supermercado</p>
      </motion.header>

      <main className="relative z-10 px-5">
        <RecipeBook userId={userId} />
      </main>

      <BottomNavBar />
    </div>
  );
}
