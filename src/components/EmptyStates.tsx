"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Calendar, ShoppingCart, Plus, Sparkles, BookOpen, Camera } from "lucide-react";

interface EmptyStateProps {
  type: "dashboard" | "recipes" | "shopping" | "weekly-plan";
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const configs = {
    dashboard: {
      icon: UtensilsCrossed,
      gradient: "from-orange-500/20 to-red-500/10",
      border: "border-orange-500/30",
      title: "Sin comidas registradas",
      description: "Empieza a registrar lo que comes para seguir tu nutrición",
      action: "Añadir comida",
      actionIcon: Plus,
    },
    recipes: {
      icon: BookOpen,
      gradient: "from-green-500/20 to-emerald-500/10",
      border: "border-green-500/30",
      title: "Explora recetas",
      description: "Descubre recipes saludables y añade las que más te gusten",
      action: "Ver recetas",
      actionIcon: Sparkles,
    },
    shopping: {
      icon: ShoppingCart,
      gradient: "from-blue-500/20 to-cyan-500/10",
      border: "border-blue-500/30",
      title: "Lista de compra vacía",
      description: "Genera tu lista desde el plan semanal o añádela manualmente",
      action: "Crear lista",
      actionIcon: Plus,
    },
    "weekly-plan": {
      icon: Calendar,
      gradient: "from-purple-500/20 to-pink-500/10",
      border: "border-purple-500/30",
      title: "Sin plan semanal",
      description: "Crea tu primer plan semanal personalizado",
      action: "Generar plan",
      actionIcon: Sparkles,
    },
  };

  const config = configs[type];
  const Icon = config.icon;
  const ActionIcon = config.actionIcon;

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated icon container */}
      <motion.div
        className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${config.gradient} border ${config.border} flex items-center justify-center mb-6`}
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon size={40} className="text-white/80" />
      </motion.div>

      {/* Text content */}
      <h3 className="text-xl font-bold mb-2">{config.title}</h3>
      <p className="text-zinc-400 mb-6 max-w-xs">{config.description}</p>

      {/* Action button */}
      {onAction && (
        <motion.button
          onClick={onAction}
          className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${config.gradient} border ${config.border} text-white font-medium flex items-center gap-2 shadow-lg`}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
        >
          <ActionIcon size={20} />
          {config.action}
        </motion.button>
      )}

      {/* Decorative dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white/20"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Camera empty state
export function CameraEmptyState({ hasPermission, onRequestPermission }: { hasPermission: boolean; onRequestPermission: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full py-12 px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center mb-6"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Camera size={40} className="text-cyan-400" />
      </motion.div>

      {!hasPermission ? (
        <>
          <h3 className="text-xl font-bold mb-2">Activa la cámara</h3>
          <p className="text-zinc-400 mb-6">
            Permite el acceso a la cámara para fotografiar tus comidas
          </p>
          <motion.button
            onClick={onRequestPermission}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium flex items-center gap-2 shadow-lg shadow-cyan-500/30"
            whileTap={{ scale: 0.95 }}
          >
            <Camera size={20} />
            Activar cámara
          </motion.button>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-2">Cámara lista</h3>
          <p className="text-zinc-400 mb-6">
            Apunta a la comida y pulsa el botón para analizar
          </p>
        </>
      )}
    </motion.div>
  );
}
