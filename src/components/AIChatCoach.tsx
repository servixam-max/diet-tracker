"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, RefreshCw, Lightbulb } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatCoachProps {
  userId?: string;
}

const INITIAL_SUGGESTIONS = [
  "Analiza mi ingesta de hoy",
  "Dame consejos para aumentar proteína",
  "¿Qué recetas saludables me recomiendas?",
  "Tengo hambre a las 10pm, ¿qué como?",
];

const SAMPLE_RESPONSES = [
  "Basándome en tu registro de hoy, has consumido 1,450 kcal con solo 65g de proteína. Te sugiero añadir una porción de yogur griego o un puñado de almendras como merienda para alcanzar tu objetivo de 120g de proteína.",
  "💡 *Tip del día:* Distribuir tu proteína a lo largo del día (25-30g por comida) maximiza la síntesis muscular. Intenta añadir huevos o tofu a tu desayuno.",
  "Para cenas ligeras pero nutritivas, te recomiendo: salmón con verduras al vapor (400 kcal, 35g proteína) o una ensalada César con atún (320 kcal, 28g proteína).",
  "Si tienes hambre de noche, evita carbohidratos simples. Prueba: requesón con frutos secos (150 kcal, 20g proteína) o un huevo cocido con aguacate (200 kcal, 8g proteína).",
];

export function AIChatCoach({ userId }: AIChatCoachProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { light, success } = useHaptic();

  useEffect(() => {
    // Welcome message
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "¡Hola! Soy tu coach nutricional con IA 🤖. Puedo analizar tu ingesta, sugerir recetas y darte consejos personalizados. ¿En qué puedo ayudarte hoy?",
        timestamp: new Date(),
      },
    ]);
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowSuggestions(false);
    setIsTyping(true);
    light();

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const randomResponse = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: randomResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
    success();
  }

  function handleSuggestion(suggestion: string) {
    setInput(suggestion);
    handleSend();
  }

  function clearChat() {
    light();
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "¡Hola! Soy tu coach nutricional con IA 🤖. Puedo analizar tu ingesta, sugerir recetas y darte consejos personalizados. ¿En qué puedo ayudarte hoy?",
        timestamp: new Date(),
      },
    ]);
    setShowSuggestions(true);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold">AI Coach</p>
            <p className="text-xs text-zinc-400">En línea</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-xl hover:bg-white/10 text-zinc-400"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                message.role === "user"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-md"
                  : "bg-white/5 border border-white/10 rounded-bl-md"
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === "assistant" && (
                  <Bot size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <p
                className={`text-xs mt-1 ${
                  message.role === "user" ? "text-white/60" : "text-zinc-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 rounded-bl-md">
              <div className="flex gap-1">
                <motion.span
                  className="w-2 h-2 rounded-full bg-zinc-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  className="w-2 h-2 rounded-full bg-zinc-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.span
                  className="w-2 h-2 rounded-full bg-zinc-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {showSuggestions && messages.length === 1 && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <Lightbulb size={12} />
              Sugerencias
            </p>
            <div className="flex flex-wrap gap-2">
              {INITIAL_SUGGESTIONS.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  onClick={() => handleSuggestion(suggestion)}
                  className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 hover:bg-white/10"
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe tu pregunta..."
            className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-500/50"
          />
          <motion.button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white disabled:opacity-50"
            whileTap={{ scale: 0.95 }}
          >
            <Send size={20} />
          </motion.button>
        </div>
        <p className="text-xs text-zinc-500 mt-2 text-center">
          <Sparkles size={10} className="inline mr-1" />
          Alimentado por IA - No es consejo médico profesional
        </p>
      </div>
    </div>
  );
}
