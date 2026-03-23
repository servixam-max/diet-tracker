"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Home, BookOpen, ShoppingCart, User } from "lucide-react";

const navItems = [
  { 
    href: "/dashboard", 
    icon: Home, 
    label: "Inicio",
    activeIcon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    )
  },
  { 
    href: "/recipes", 
    icon: BookOpen, 
    label: "Recetas",
    activeIcon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    )
  },
  { 
    href: "/shopping", 
    icon: ShoppingCart, 
    label: "Lista",
    activeIcon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    )
  },
  { 
    href: "/profile", 
    icon: User, 
    label: "Perfil",
    activeIcon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    )
  },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around px-2 z-50 safe-area-bottom">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
              isActive ? "text-green-400" : "text-zinc-500"
            }`}
          >
            <AnimatePresence mode="wait">
              {isActive ? (
                <motion.div
                  key="active"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full" />
                  <item.activeIcon />
                </motion.div>
              ) : (
                <motion.div
                  key="inactive"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1 }}
                >
                  <Icon size={22} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>
            
            <span className={`text-[10px] font-medium transition-all ${
              isActive ? "text-green-400" : "text-zinc-500"
            }`}>
              {item.label}
            </span>
            
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full"
                style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
