"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Inicio", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" },
  { href: "/weekly-plan", label: "Plan", icon: "M4 4h16v16H4V4zm0 6h16M8 2v4m8-4v4" },
  { href: "/recipes", label: "Recetas", icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z M8 7h8 M8 11h6" },
  { href: "/shopping", label: "Lista", icon: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6 M9 21a1 1 0 1 0 2 0 1 1 0 1 0-2 0 M20 21a1 1 0 1 0 2 0 1 1 0 1 0-2 0" },
  { href: "/profile", label: "Perfil", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z" },
];

export function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Handle scroll visibility
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

  const handleNavClick = (href: string) => {
    // Simple haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (e) {
        // Ignore haptic errors
      }
    }
    router.push(href);
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Glass background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(10, 10, 15, 0.98) 0%, rgba(10, 10, 15, 0.95) 60%, rgba(10, 10, 15, 0.8) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      />
      
      {/* Top border */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.1) 80%, transparent 100%)',
        }}
      />
      
      {/* Navigation items */}
      <div className="relative flex items-center justify-around h-16 px-2 pb-2">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="relative flex flex-col items-center justify-center flex-1 py-2 px-1 group"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active background pill */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-1 top-1 bottom-1 rounded-2xl bg-green-500/10 border border-green-500/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              
              {/* Icon */}
              <div className={`relative z-10 w-6 h-6 mb-1 transition-colors duration-200 ${
                isActive ? 'text-green-400' : 'text-zinc-500 group-hover:text-zinc-300'
              }`}>
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="w-full h-full"
                >
                  <path d={item.icon} fill={isActive ? "currentColor" : "none"} />
                </svg>
              </div>
              
              {/* Label */}
              <span className={`relative z-10 text-[10px] font-medium transition-colors duration-200 ${
                isActive ? 'text-green-400' : 'text-zinc-500 group-hover:text-zinc-300'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* iOS home indicator */}
      <div className="h-1 w-full flex items-center justify-center pb-1">
        <div className="w-32 h-1 bg-white/20 rounded-full" />
      </div>
    </motion.nav>
  );
}
