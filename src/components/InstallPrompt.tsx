'use client';

import { useState, useEffect } from 'react';
import { X, Download, Share, Plus, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InstallPromptProps {
  onDismiss?: () => void;
}

export default function InstallPrompt({ onDismiss }: InstallPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed previously
    const dismissed = localStorage.getItem('install-prompt-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissal = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissal < 30) return; // Don't show again for 30 days
    }

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      setShowPrompt(false);
      localStorage.setItem('install-prompt-dismissed', new Date().toISOString());
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('install-prompt-dismissed', new Date().toISOString());
    onDismiss?.();
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a2e] border-t border-[#2a2a3e] p-4 safe-area-inset-bottom"
      >
        <div className="max-w-lg mx-auto">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">
                {isIOS ? 'Instalar Diet Tracker' : 'Añadir a pantalla de inicio'}
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                {isIOS 
                  ? 'Para instalar esta app en tu iPhone, usa el botón Compartir y selecciona "Añadir a pantalla de inicio"'
                  : 'Instala la app para acceso rápido y notificaciones push'}
              </p>
              
              {isIOS && (
                <div className="bg-[#0a0a0f] rounded-lg p-3 text-sm text-gray-300">
                  <p className="font-medium text-white mb-2">Pasos para iOS:</p>
                  <ol className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full" />
                      <span>Toca el botón Compartir</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Plus size={16} className="text-emerald-500" />
                      <span>Selecciona "Añadir a pantalla de inicio"</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full" />
                      <span>Confirma en Safari</span>
                    </li>
                  </ol>
                </div>
              )}
            </div>
            
            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
          
          {!isIOS && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Ahora no
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
