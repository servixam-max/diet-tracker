"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

interface IconProps {
  isActive?: boolean;
  className?: string;
}

const navItems = [
  { 
    href: "/dashboard", 
    label: "Inicio",
    icon: (props: IconProps) => (
      <svg viewBox="0 0 24 24" {...( ({ isActive, ...o }) => o )(props)}>
        <path 
          d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" 
          fill={props.isActive ? "currentColor" : "none"}
          stroke="currentColor" 
          strokeWidth={props.isActive ? "0" : "1.5"}
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <polyline 
          points="9 22 9 12 15 12 15 22" 
          fill={props.isActive ? "currentColor" : "none"}
          stroke="currentColor" 
          strokeWidth={props.isActive ? "0" : "1.5"}
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  { 
    href: "/weekly-plan", 
    label: "Plan",
    icon: (props: IconProps) => (
      <svg viewBox="0 0 24 24" {...props}>
        <rect 
          x="3" 
          y="4" 
          width="18" 
          height="18" 
          rx="2" 
          ry="2"
          fill={props.isActive ? "currentColor" : "none"}
          stroke="currentColor" 
          strokeWidth={props.isActive ? "0" : "1.5"}
        />
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  { 
    href: "/recipes", 
    label: "Recetas",
    icon: (props: IconProps) => (
      <svg viewBox="0 0 24 24" {...props}>
        <path 
          d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" 
          fill={props.isActive ? "currentColor" : "none"}
          stroke="currentColor" 
          strokeWidth={props.isActive ? "0" : "1.5"}
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  { 
    href: "/shopping", 
    label: "Lista",
    icon: (props: IconProps) => (
      <svg viewBox="0 0 24 24" {...props}>
        <circle cx="9" cy="21" r="1" fill="currentColor" />
        <circle cx="20" cy="21" r="1" fill="currentColor" />
        <path 
          d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  { 
    href: "/profile", 
    label: "Perfil",
    icon: (props: IconProps) => (
      <svg viewBox="0 0 24 24" {...props}>
        <path 
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <circle 
          cx="12" 
          cy="7" 
          r="4" 
          fill={props.isActive ? "currentColor" : "none"}
          stroke="currentColor" 
          strokeWidth={props.isActive ? "0" : "1.5"}
        />
      </svg>
    ),
  },
];

// Haptic feedback helper
const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    };
    navigator.vibrate(patterns[type]);
  }
};

function NavItem({ item, isActive, index }: { item: typeof navItems[0], isActive: boolean, index: number }) {
  const router = useRouter();
  const ref = useRef<HTMLButtonElement>(null);
  
  const springConfig = { stiffness: 400, damping: 25 };
  const scale = useSpring(1, springConfig);
  const y = useSpring(0, springConfig);
  
  const handlePressStart = () => {
    scale.set(0.85);
    y.set(2);
    triggerHaptic('light');
  };
  
  const handlePressEnd = () => {
    scale.set(1);
    y.set(0);
  };
  
  const handleClick = () => {
    triggerHaptic('medium');
    router.push(item.href);
  };

  const Icon = item.icon;

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center flex-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <motion.button
        ref={ref}
        onClick={handleClick}
        onTapStart={handlePressStart}
        onTap={handlePressEnd}
        onTapCancel={handlePressEnd}
        style={{ scale, y }}
        className="relative flex flex-col items-center justify-center w-full py-2"
        aria-label={`Ir a ${item.label}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Active indicator pill */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              layoutId="activePill"
              className="absolute inset-x-2 top-1 bottom-1 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </AnimatePresence>
        
        {/* Glow effect for active state */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
                filter: 'blur(8px)',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Icon container */}
        <motion.div
          className={`relative z-10 w-7 h-7 transition-colors duration-300 ${
            isActive ? 'text-green-400' : 'text-zinc-500'
          }`}
          animate={{
            scale: isActive ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Icon isActive={isActive} />
        </motion.div>
        
        {/* Label */}
        <motion.span
          className={`relative z-10 text-[11px] font-medium mt-1 transition-colors duration-300 ${
            isActive ? 'text-green-400' : 'text-zinc-500'
          }`}
          animate={{
            y: isActive ? -1 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {item.label}
        </motion.span>
        
        {/* Active dot indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute -bottom-0.5 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <div 
                className="w-1 h-1 rounded-full bg-green-400"
                style={{
                  boxShadow: '0 0 6px rgba(34, 197, 94, 0.8), 0 0 12px rgba(34, 197, 94, 0.4)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

export function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Hide/show on scroll (iOS-style behavior)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Glass background with blur */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(10, 10, 15, 0.98) 0%, rgba(10, 10, 15, 0.95) 60%, rgba(10, 10, 15, 0.8) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      />
      
      {/* Top border line */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.1) 80%, transparent 100%)',
        }}
      />
      
      {/* Notification bell button */}
      <motion.button
        onClick={() => router.push("/dashboard")}
        className="absolute right-4 top-2 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
        whileTap={{ scale: 0.9 }}
        aria-label="Notificaciones"
      >
        <Bell size={18} className="text-white" />
      </motion.button>
      
      {/* Navigation content */}
      <div className="relative flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={pathname.startsWith(item.href)}
            index={index}
          />
        ))}
      </div>
      
      {/* Home indicator area for iOS */}
      <div className="h-2 w-full flex items-center justify-center">
        <div className="w-32 h-1 bg-white/20 rounded-full" />
      </div>
    </motion.nav>
  );
}
