"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, MessageCircle } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";
import { showToast } from "./ToastProvider";

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  variant?: "button" | "icon";
  className?: string;
}

export function ShareButton({ url, title, text, variant = "button", className = "" }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { light } = useHaptic();

  const handleShare = async () => {
    light();
    
    // Try Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url,
        });
        showToast.success("¡Compartido exitosamente!");
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share error:', err);
        }
      }
    }
    
    // Fallback: show share options
    setIsOpen(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast.success("Enlace copiado al portapapeles");
      setIsOpen(false);
    } catch (err) {
      showToast.error("Error al copiar");
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text || title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
    setIsOpen(false);
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
    setIsOpen(false);
  };

  if (variant === "icon") {
    return (
      <>
        <motion.button
          onClick={handleShare}
          className={`p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors ${className}`}
          whileTap={{ scale: 0.9 }}
          aria-label="Compartir"
        >
          <Share2 size={18} className="text-white" />
        </motion.button>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-[#0a0a0f] rounded-t-3xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Compartir</h3>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-white/5">
                  <span className="text-xl">×</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <ShareOption icon={Copy} label="Copiar" onClick={copyToClipboard} />
                <ShareOption icon={Copy} label="Twitter" onClick={shareToTwitter} />
                <ShareOption icon={Copy} label="Facebook" onClick={shareToFacebook} />
                <ShareOption icon={MessageCircle} label="WhatsApp" onClick={() => {
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text || title)} ${encodeURIComponent(url)}`;
                  window.open(whatsappUrl, '_blank');
                  setIsOpen(false);
                }} />
              </div>
            </motion.div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <motion.button
        onClick={handleShare}
        className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Share2 size={18} className="text-white" />
        <span className="text-sm font-medium">Compartir</span>
      </motion.button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-[#0a0a0f] rounded-3xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Compartir</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-white/5">
                <span className="text-xl">×</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <ShareOption icon={Copy} label="Copiar" onClick={copyToClipboard} />
              <ShareOption icon={Copy} label="Twitter" onClick={shareToTwitter} />
              <ShareOption icon={Copy} label="Facebook" onClick={shareToFacebook} />
              <ShareOption icon={MessageCircle} label="WhatsApp" onClick={() => {
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text || title)} ${encodeURIComponent(url)}`;
                window.open(whatsappUrl, '_blank');
                setIsOpen(false);
              }} />
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}

interface ShareOptionProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

function ShareOption({ icon: Icon, label, onClick }: ShareOptionProps) {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={24} className="text-white" />
      <span className="text-xs text-zinc-400">{label}</span>
    </motion.button>
  );
}
