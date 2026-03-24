"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Image, Plus, ChevronRight, Trash2, Check } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface ProgressPhoto {
  id: string;
  date: string;
  imageUrl: string;
  note?: string;
  weight?: number;
}

interface ProgressPhotosProps {
  userId: string;
}

export function ProgressPhotos({ userId }: ProgressPhotosProps) {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const { light } = useHaptic();

  useEffect(() => {
    const saved = localStorage.getItem(`progress-photos-${userId}`);
    if (saved) {
      setPhotos(JSON.parse(saved));
    } else {
      // Sample data
      setPhotos([
        { id: "1", date: "2024-01-01", imageUrl: "", note: "Inicio del programa", weight: 85 },
        { id: "2", date: "2024-02-01", imageUrl: "", note: "Primer mes", weight: 82 },
        { id: "3", date: "2024-03-01", imageUrl: "", note: "Dos meses", weight: 79 },
      ]);
    }
  }, [userId]);

  function addPhoto() {
    light();
    setShowCamera(true);
    // In a real app, this would open the camera
    // For demo, simulate adding a photo
    const newPhoto: ProgressPhoto = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      imageUrl: "",
      note: "",
      weight: 75,
    };
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    localStorage.setItem(`progress-photos-${userId}`, JSON.stringify(updated));
    setShowCamera(false);
  }

  function deletePhoto(id: string) {
    light();
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    localStorage.setItem(`progress-photos-${userId}`, JSON.stringify(updated));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera size={18} className="text-purple-400" />
          <h3 className="font-semibold">Fotos de progreso</h3>
        </div>
        <motion.button
          onClick={addPhoto}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium flex items-center gap-2"
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={16} />
          Añadir
        </motion.button>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8">
          <Image size={48} className="mx-auto mb-3 text-zinc-600" />
          <p className="text-zinc-400">No hay fotos de progreso</p>
          <p className="text-sm text-zinc-500">Añade fotos para ver tu evolución</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className="relative aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
              whileTap={{ scale: 0.95 }}
            >
              {photo.imageUrl ? (
                <img src={photo.imageUrl} alt={photo.date} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera size={24} className="text-zinc-600" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80">
                <p className="text-xs font-medium">{new Date(photo.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</p>
                {photo.weight && <p className="text-xs text-zinc-400">{photo.weight} kg</p>}
              </div>
              <button
                onClick={() => deletePhoto(photo.id)}
                className="absolute top-1 right-1 p-1 rounded-full bg-red-500/80"
              >
                <Trash2 size={12} className="text-white" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-sm text-zinc-400 mb-2">Evolución de peso</p>
          <div className="flex items-end gap-1 h-16">
            {photos.map((photo, i) => {
              const weights = photos.map((p) => p.weight || 0);
              const maxW = Math.max(...weights);
              const minW = Math.min(...weights);
              const range = maxW - minW || 1;
              const height = ((maxW - (photo.weight || 0)) / range) * 100;
              return (
                <div
                  key={photo.id}
                  className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
                  style={{ height: `${Math.max(20, 100 - height)}%` }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-zinc-500">
            <span>{photos[photos.length - 1]?.weight} kg</span>
            <span>{photos[0]?.weight} kg</span>
          </div>
        </div>
      )}
    </div>
  );
}
