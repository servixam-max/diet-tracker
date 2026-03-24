"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ruler, Plus, Trash2, ChevronDown, Check } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface Measurement {
  id: string;
  date: string;
  chest?: number;
  waist?: number;
  hips?: number;
  arm?: number;
  thigh?: number;
  notes?: string;
}

interface BodyMeasurementsProps {
  userId: string;
}

export function BodyMeasurements({ userId }: BodyMeasurementsProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>([
    { id: "1", date: "2024-03-01", chest: 98, waist: 82, hips: 95, arm: 32, thigh: 55, notes: "Inicio del programa" },
    { id: "2", date: "2024-03-15", chest: 97, waist: 80, hips: 94, arm: 32.5, thigh: 54 },
  ]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newM, setNewM] = useState({ chest: "", waist: "", hips: "", arm: "", thigh: "", notes: "" });
  const { light, success } = useHaptic();

  function toggleExpand(id: string) {
    light();
    setExpandedId(expandedId === id ? null : id);
  }

  function addMeasurement() {
    light();
    const entry: Measurement = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      chest: newM.chest ? parseFloat(newM.chest) : undefined,
      waist: newM.waist ? parseFloat(newM.waist) : undefined,
      hips: newM.hips ? parseFloat(newM.hips) : undefined,
      arm: newM.arm ? parseFloat(newM.arm) : undefined,
      thigh: newM.thigh ? parseFloat(newM.thigh) : undefined,
      notes: newM.notes || undefined,
    };
    setMeasurements([...measurements, entry]);
    setNewM({ chest: "", waist: "", hips: "", arm: "", thigh: "", notes: "" });
    setShowAdd(false);
    success();
  }

  function deleteMeasurement(id: string) {
    light();
    setMeasurements(measurements.filter((m) => m.id !== id));
  }

  const latest = measurements[measurements.length - 1];
  const previous = measurements[measurements.length - 2];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler size={18} className="text-purple-400" />
          <h3 className="font-semibold">Medidas corporales</h3>
        </div>
        <motion.button
          onClick={() => { light(); setShowAdd(!showAdd); }}
          className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-400 text-sm font-medium flex items-center gap-1"
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={14} />
          Añadir
        </motion.button>
      </div>

      {/* Latest measurements summary */}
      {latest && (
        <motion.div
          className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-zinc-400 mb-3">Última medición: {latest.date}</p>
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: "Pecho", value: latest.chest, diff: latest.chest && previous?.chest ? latest.chest - previous.chest : undefined },
              { label: "Cintura", value: latest.waist, diff: latest.waist && previous?.waist ? latest.waist - previous.waist : undefined },
              { label: "Cadera", value: latest.hips, diff: latest.hips && previous?.hips ? latest.hips - previous.hips : undefined },
              { label: "Brazo", value: latest.arm, diff: latest.arm && previous?.arm ? latest.arm - previous.arm : undefined },
              { label: "Muslo", value: latest.thigh, diff: latest.thigh && previous?.thigh ? latest.thigh - previous.thigh : undefined },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-xs text-zinc-500 mb-1">{item.label}</p>
                <p className="font-bold">{item.value || "-"}</p>
                {item.diff !== undefined && item.diff !== 0 && (
                  <p className={`text-xs ${item.diff < 0 ? "text-green-400" : "text-red-400"}`}>
                    {item.diff > 0 ? "+" : ""}{item.diff.toFixed(1)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add new measurement form */}
      {showAdd && (
        <motion.div
          className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-zinc-400">Nueva medición:</p>
          <div className="grid grid-cols-2 gap-2">
            {["chest", "waist", "hips", "arm", "thigh"].map((field) => (
              <input
                key={field}
                type="number"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1) + " (cm)"}
                value={newM[field as keyof typeof newM]}
                onChange={(e) => setNewM({ ...newM, [field]: e.target.value })}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"
              />
            ))}
          </div>
          <input
            type="text"
            placeholder="Notas (opcional)"
            value={newM.notes}
            onChange={(e) => setNewM({ ...newM, notes: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"
          />
          <motion.button
            onClick={addMeasurement}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium"
            whileTap={{ scale: 0.98 }}
          >
            Guardar medición
          </motion.button>
        </motion.div>
      )}

      {/* Measurement history */}
      <div className="space-y-2">
        {measurements.slice().reverse().map((m) => (
          <motion.div
            key={m.id}
            className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => toggleExpand(m.id)}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📏</span>
                <div className="text-left">
                  <p className="font-medium">{m.date}</p>
                  {m.notes && <p className="text-xs text-zinc-500">{m.notes}</p>}
                </div>
              </div>
              <motion.div animate={{ rotate: expandedId === m.id ? 180 : 0 }}>
                <ChevronDown size={18} className="text-zinc-500" />
              </motion.div>
            </button>

            {expandedId === m.id && (
              <motion.div
                className="px-4 pb-4 pt-2 border-t border-white/5"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
              >
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {[
                    { label: "Pecho", value: m.chest },
                    { label: "Cintura", value: m.waist },
                    { label: "Cadera", value: m.hips },
                    { label: "Brazo", value: m.arm },
                    { label: "Muslo", value: m.thigh },
                  ].map((item, i) => (
                    <div key={i} className="text-center p-2 rounded-xl bg-white/5">
                      <p className="text-xs text-zinc-500">{item.label}</p>
                      <p className="font-bold">{item.value || "-"}</p>
                    </div>
                  ))}
                </div>
                <motion.button
                  onClick={() => deleteMeasurement(m.id)}
                  className="w-full py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 size={14} />
                  Eliminar
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
