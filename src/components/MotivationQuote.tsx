"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Quote, RefreshCw, Heart, Share2 } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface QuoteData {
  text: string;
  author: string;
  category: string;
}

const quotes: QuoteData[] = [
  { text: "El único mal entrenamiento es el que no hiciste.", author: "Desconocido", category: "fitness" },
  { text: "Tu cuerpo puede hacer cualquier cosa. Es tu mente la que tienes que convencer.", author: "Desconocido", category: "mindset" },
  { text: "La disciplina es el puente entre metas y logros.", author: "Jim Rohn", category: "motivation" },
  { text: "No cuentes los días, haz que los días cuenten.", author: "Muhammad Ali", category: "motivation" },
  { text: "El éxito no es definitivo, el fracaso no es fatal: es el coraje de continuar lo que cuenta.", author: "Winston Churchill", category: "perseverance" },
  { text: "Cada comida es una oportunidad de nutrir tu cuerpo.", author: "Desconocido", category: "nutrition" },
  { text: "La salud no es todo, pero sin ella todo es nada.", author: "Schopenhauer", category: "health" },
  { text: "El dolor que sientes hoy será la fuerza que sentirás mañana.", author: "Desconocido", category: "fitness" },
  { text: "Pequeños pasos cada día llevan a grandes resultados.", author: "Desconocido", category: "progress" },
  { text: "Tu única competencia eres tú mismo de ayer.", author: "Desconocido", category: "mindset" },
];

interface MotivationQuoteProps {
  userId: string;
}

export function MotivationQuote({ userId }: MotivationQuoteProps) {
  const [quote, setQuote] = useState<QuoteData>(quotes[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liked, setLiked] = useState(false);
  const { light, success } = useHaptic();

  function getNewQuote() {
    setIsRefreshing(true);
    light();
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
      setQuote(randomQuote);
      setLiked(false);
      setIsRefreshing(false);
      success();
    }, 500);
  }

  function toggleLike() {
    light();
    setLiked(!liked);
  }

  function shareQuote() {
    light();
    const text = `${quote.text} - ${quote.author}\n\n#DietTracker #Motivation`;
    navigator.clipboard.writeText(text);
    success();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Quote size={18} className="text-pink-400" />
          <h3 className="font-semibold">Motivación del día</h3>
        </div>
        <motion.button
          onClick={getNewQuote}
          disabled={isRefreshing}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 transition-colors"
          whileTap={{ scale: 0.95 }}
          animate={isRefreshing ? { rotate: 360 } : {}}
        >
          <RefreshCw size={16} />
        </motion.button>
      </div>

      <motion.div
        className="p-5 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/5 border border-pink-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={quote.text}
      >
        <div className="absolute top-4 left-4 text-4xl text-pink-500/20">&quot;</div>
        
        <blockquote className="relative">
          <p className="text-lg font-medium leading-relaxed mb-3">
            {quote.text}
          </p>
          <footer className="text-sm text-zinc-400">
            — {quote.author}
          </footer>
        </blockquote>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <span className="px-2 py-1 rounded-full bg-white/5 text-xs text-zinc-400 capitalize">
            {quote.category}
          </span>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleLike}
              className={`p-2 rounded-lg transition-colors ${
                liked 
                  ? "bg-pink-500/20 text-pink-400" 
                  : "bg-white/5 text-zinc-400 hover:bg-white/10"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={16} className={liked ? "fill-current" : ""} />
            </motion.button>
            
            <motion.button
              onClick={shareQuote}
              className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <Share2 size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
