// Sistema de animaciones consistente
// Duraciones y easing functions estandarizadas

export const durations = {
  fast: 0.2,    // Para micro-interacciones (hover, tap)
  normal: 0.4,  // Para transiciones estándar
  slow: 0.8,    // Para animaciones de entrada/salida
  verySlow: 1.2, // Para animaciones complejas
};

export const easing = {
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 20,
  },
  bounce: {
    type: "spring",
    stiffness: 500,
    damping: 15,
  },
};

// Variantes de animación reutilizables
export const variants = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: durations.normal, ease: easing.easeOut }
    },
  },
  scaleIn: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: durations.normal, ...easing.spring }
    },
  },
  slideInLeft: {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: durations.normal, ease: easing.easeOut }
    },
  },
  slideInRight: {
    hidden: { x: 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: durations.normal, ease: easing.easeOut }
    },
  },
  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
};
