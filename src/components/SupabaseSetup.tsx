"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Check, ExternalLink, Copy, Settings } from "lucide-react";

interface SupabaseSetupProps {
  onComplete?: () => void;
}

export function SupabaseSetup({ onComplete }: SupabaseSetupProps) {
  const [copied, setCopied] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  const sql = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  weight_kg DECIMAL,
  height_cm INTEGER,
  target_calories INTEGER DEFAULT 2000,
  target_protein_g INTEGER DEFAULT 150,
  target_carbs_g INTEGER DEFAULT 200,
  target_fat_g INTEGER DEFAULT 65,
  water_goal INTEGER DEFAULT 8,
  dietary_restrictions TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food log table
CREATE TABLE IF NOT EXISTS food_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL,
  description TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein_g DECIMAL DEFAULT 0,
  carbs_g DECIMAL DEFAULT 0,
  fat_g DECIMAL DEFAULT 0,
  image_url TEXT,
  source TEXT DEFAULT 'manual',
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly plans table
CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  plan_data JSONB NOT NULL,
  target_calories INTEGER DEFAULT 2000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Weight history table
CREATE TABLE IF NOT EXISTS weight_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  weight_kg DECIMAL NOT NULL,
  recorded_at DATE DEFAULT CURRENT_DATE
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth_id = auth.uid());
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth_id = auth.uid());
CREATE POLICY "Users can insert own food log" ON food_log FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
CREATE POLICY "Users can view own food log" ON food_log FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
`;

  function copySQL() {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleComplete() {
    setSetupComplete(true);
    onComplete?.();
  }

  if (setupComplete) {
    return (
      <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <Check size={32} className="text-green-400" />
        </motion.div>
        <h3 className="text-xl font-bold mb-2">¡Configuración completa!</h3>
        <p className="text-zinc-400">Tu base de datos está lista para usar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Database size={20} className="text-green-400" />
        <h3 className="font-semibold">Configurar Supabase</h3>
      </div>

      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30">
        <p className="text-sm text-blue-300">
          <strong>Paso 1:</strong> Ve al panel de Supabase y ejecuta este SQL en el SQL Editor:
        </p>
      </div>

      <div className="relative">
        <pre className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs overflow-x-auto max-h-64">
          <code className="text-green-400">{sql}</code>
        </pre>
        <motion.button
          onClick={copySQL}
          className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20"
          whileTap={{ scale: 0.95 }}
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-zinc-400" />}
        </motion.button>
      </div>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-sm text-zinc-400 mb-2">
          <strong>Paso 2:</strong> Configura las variables de entorno en Vercel:
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <code className="px-2 py-1 rounded bg-white/10 text-green-400">NEXT_PUBLIC_SUPABASE_URL</code>
            <span className="text-zinc-500">Tu URL de Supabase</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="px-2 py-1 rounded bg-white/10 text-green-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
            <span className="text-zinc-500">Tu anon key</span>
          </div>
        </div>
      </div>

      <motion.button
        onClick={handleComplete}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold"
        whileTap={{ scale: 0.98 }}
      >
        Ya he configurado la base de datos
      </motion.button>
    </div>
  );
}
